import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from '../tenant.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { SmsService } from '../services/sms.service';
import { EmailService } from '../services/email.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { AuditService } from '../../auth/services/audit.service';
import { ListTenantsQueryDto } from '../dto/list-tenants.query';

describe('TenantService.listTenants', () => {
  let service: TenantService;
  let prisma: {
    tenant: {
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    user: { findMany: jest.Mock };
    payment: { findUnique: jest.Mock; create: jest.Mock };
    tenantLog: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      tenant: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      user: { findMany: jest.fn().mockResolvedValue([]) },
      payment: { findUnique: jest.fn(), create: jest.fn() },
      tenantLog: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: PrismaService, useValue: prisma },
        { provide: SmsService, useValue: { sendVerificationCode: jest.fn(), sendWelcomeMessage: jest.fn(), sendRejectionMessage: jest.fn() } },
        { provide: EmailService, useValue: { sendWelcomeEmail: jest.fn() } },
        { provide: WhatsAppService, useValue: { sendWelcomeMessage: jest.fn() } },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn(),
            logTenantCreated: jest.fn(),
            logTenantApproved: jest.fn(),
            logTenantRejected: jest.fn(),
            logTenantDeactivated: jest.fn(),
            logTenantReactivated: jest.fn(),
            logTenantUpdated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  it('paginates with page/limit', async () => {
    const query: ListTenantsQueryDto = { page: 2, limit: 5, sort: 'name', order: 'asc' };
    await service.listTenants(query);

    expect(prisma.tenant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
      }),
    );
  });

  it('filters by status, commune and search', async () => {
    const query: ListTenantsQueryDto = {
      page: 1,
      limit: 10,
      status: 'pending',
      commune: 'Goma',
      search: 'Institut',
    };
    await service.listTenants(query);

    const arg = prisma.tenant.findMany.mock.calls[0][0];
    expect(arg.where.AND).toEqual(
      expect.arrayContaining([
        { status: 'pending' },
        { commune: 'Goma' },
        {
          OR: expect.arrayContaining([
            { name: { contains: 'Institut', mode: 'insensitive' } },
            { phone: { contains: 'Institut', mode: 'insensitive' } },
          ]),
        },
      ]),
    );
  });

  it('filters overdue subscription', async () => {
    await service.listTenants({
      page: 1,
      limit: 10,
      subscription: 'overdue',
    });

    const arg = prisma.tenant.findMany.mock.calls[0][0];
    expect(arg.where.AND).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          OR: expect.any(Array),
        }),
      ]),
    );
  });

  it('returns meta with counts', async () => {
    prisma.tenant.count.mockResolvedValue(3);
    const result = await service.listTenants({ page: 1, limit: 10 });

    expect(result.meta).toMatchObject({
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
      counts: expect.objectContaining({
        all: 3,
        active: 3,
        overdue: 3,
      }),
    });
  });

  it('clamps limit to max 100', async () => {
    await service.listTenants({ page: 1, limit: 500 });
    expect(prisma.tenant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
  });
});
