import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/core/prisma/prisma.service';
import { hashSetupToken } from '../src/modules/auth/utils/setup-token';

jest.setTimeout(60000);

describe('Admin schools e2e (dashboard)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let adminToken: string;
  let schoolId: string;
  const phone = `+24389${String(Date.now()).slice(-7)}`;
  const schoolName = `E2E École ${Date.now()}`;
  const schoolPassword = 'Ecole@2026Test';
  let setupTokenPlain: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@edugoma.cd', password: 'Admin@2024' });

    if (login.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('Admin login failed', login.status, login.body);
    }
    expect(login.status).toBe(200);
    adminToken = login.body.data.accessToken;
    expect(adminToken).toBeTruthy();
  });

  afterAll(async () => {
    if (prisma && schoolId) {
      await prisma.setupToken.deleteMany({ where: { tenantId: schoolId } }).catch(() => undefined);
      await prisma.userRole
        .deleteMany({ where: { user: { tenantId: schoolId } } })
        .catch(() => undefined);
      await prisma.user.deleteMany({ where: { tenantId: schoolId } }).catch(() => undefined);
      await prisma.payment.deleteMany({ where: { tenantId: schoolId } }).catch(() => undefined);
      await prisma.tenant.delete({ where: { id: schoolId } }).catch(() => undefined);
    }
    await app?.close();
  });

  it('GET /admin/tenants without token → 401', async () => {
    const res = await request(app.getHttpServer()).get('/admin/tenants?limit=5');
    expect(res.status).toBe(401);
  });

  it('POST /admin/tenants creates a pending school', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/tenants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: schoolName,
        phone,
        email: `e2e-${Date.now()}@example.com`,
        commune: 'Goma',
        type: 'private',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    schoolId = res.body.tenant.id;
    expect(schoolId).toBeTruthy();

    const tenant = await prisma.tenant.findUnique({ where: { id: schoolId } });
    expect(tenant?.status).toBe('pending');
  });

  it('POST validate provisions user + setup link + notifies 3 channels', async () => {
    const res = await request(app.getHttpServer())
      .post(`/admin/tenants/${schoolId}/validate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ validatedBy: 'E2E Super Admin' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.notifications.sms).toBe(true);
    // WhatsApp is best-effort (Meta API may fail in CI)
    expect(typeof res.body.notifications.whatsapp).toBe('boolean');
    // email boolean (true if sent) or null if no email — we sent an email
    expect(res.body.notifications.email).not.toBe(false);

    const user = await prisma.user.findFirst({ where: { tenantId: schoolId, phone } });
    expect(user).toBeTruthy();
    expect(user?.mustChangePassword).toBe(true);

    const tokens = await prisma.setupToken.findMany({
      where: { tenantId: schoolId, usedAt: null },
    });
    expect(tokens.length).toBeGreaterThanOrEqual(1);
    expect(tokens[0].expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('GET /auth/setup/:token invalid → 404', async () => {
    const res = await request(app.getHttpServer()).get('/auth/setup/deadbeef');
    expect(res.status).toBe(404);
  });

  it('POST /auth/setup/:token sets password and allows school login', async () => {
    const user = await prisma.user.findFirst({ where: { tenantId: schoolId, phone } });
    expect(user).toBeTruthy();

    // E2E cannot recover the clear token from messages — issue a known one
    setupTokenPlain = `e2e-setup-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await prisma.setupToken.updateMany({
      where: { userId: user!.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    await prisma.setupToken.create({
      data: {
        tokenHash: hashSetupToken(setupTokenPlain),
        userId: user!.id,
        tenantId: schoolId,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const weak = await request(app.getHttpServer())
      .post(`/auth/setup/${setupTokenPlain}`)
      .send({ password: 'weak' });
    expect(weak.status).toBe(400);

    const ok = await request(app.getHttpServer())
      .post(`/auth/setup/${setupTokenPlain}`)
      .send({ password: schoolPassword });
    expect(ok.status).toBe(200);
    expect(ok.body.success).toBe(true);

    const after = await prisma.user.findFirst({ where: { id: user!.id } });
    expect(after?.mustChangePassword).toBe(false);

    // Token is one-time
    const reuse = await request(app.getHttpServer())
      .post(`/auth/setup/${setupTokenPlain}`)
      .send({ password: 'Other@2026X' });
    expect(reuse.status).toBe(410);

    const schoolLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ phone, password: schoolPassword });
    expect(schoolLogin.status).toBe(200);
    expect(schoolLogin.body.data.accessToken).toBeTruthy();
  });

  it('school admin cannot access super-admin list → 403', async () => {
    const schoolLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ phone, password: schoolPassword });
    expect(schoolLogin.status).toBe(200);
    const schoolToken = schoolLogin.body.data.accessToken;

    const res = await request(app.getHttpServer())
      .get('/admin/tenants?limit=5')
      .set('Authorization', `Bearer ${schoolToken}`);
    expect(res.status).toBe(403);
  });

  it('GET /admin/tenants/suspended works for super admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/tenants/suspended')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('mark paid is idempotent (one Payment per period)', async () => {
    const first = await request(app.getHttpServer())
      .patch(`/admin/tenants/${schoolId}/subscription`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'mark_paid' });
    expect(first.status).toBe(200);

    const second = await request(app.getHttpServer())
      .patch(`/admin/tenants/${schoolId}/subscription`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'mark_paid' });
    expect(second.status).toBe(200);

    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const payments = await prisma.payment.count({
      where: { tenantId: schoolId, period },
    });
    expect(payments).toBe(1);
  });

  it('suspend then reactivate school', async () => {
    const suspend = await request(app.getHttpServer())
      .post(`/admin/tenants/${schoolId}/deactivate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'E2E suspend' });
    expect(suspend.status).toBe(200);

    let tenant = await prisma.tenant.findUnique({ where: { id: schoolId } });
    expect(tenant?.status).toBe('suspended');

    const suspendedList = await request(app.getHttpServer())
      .get('/admin/tenants/suspended')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(suspendedList.status).toBe(200);
    const ids = (suspendedList.body.data as Array<{ id: string }>).map((t) => t.id);
    expect(ids).toContain(schoolId);

    const reactivate = await request(app.getHttpServer())
      .post(`/admin/tenants/${schoolId}/reactivate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(reactivate.status).toBe(200);

    tenant = await prisma.tenant.findUnique({ where: { id: schoolId } });
    expect(tenant?.status).toBe('active');
  });

  it('POST /admin/tenants/:id/resend-access re-issues link', async () => {
    const res = await request(app.getHttpServer())
      .post(`/admin/tenants/${schoolId}/resend-access`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.notifications.sms).toBe(true);

    const open = await prisma.setupToken.count({
      where: { tenantId: schoolId, usedAt: null },
    });
    expect(open).toBeGreaterThanOrEqual(1);
  });
});
