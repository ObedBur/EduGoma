# Auth Module - Security Documentation

## Overview

The Auth module provides enterprise-grade authentication and authorization with the following features:

- ✅ **Strong Password Hashing**: bcrypt with 12 rounds
- ✅ **Email OR Phone Login**: Flexible authentication methods
- ✅ **JWT Tokens**: Separate access (15m) and refresh (7d) tokens
- ✅ **Token Rotation**: Automatic refresh token rotation for enhanced security
- ✅ **Secure Storage**: Refresh tokens hashed in database, never stored in plaintext
- ✅ **HTTP-Only Cookies**: Refresh tokens stored in secure, HTTP-only cookies
- ✅ **Multi-Tenant Support**: Tenant isolation enforced at all levels
- ✅ **RBAC**: Role-Based Access Control with guards
- ✅ **Permissions**: Fine-grained permission-based access control
- ✅ **Audit Logging**: Complete audit trail of all authentication events
- ✅ **Token Revocation**: Logout and security breach protection

## Architecture

### Services

#### AuthService
Main authentication service handling:
- User registration with validation
- Login with email or phone
- Token refresh with rotation
- Logout with token revocation
- User validation for guards

#### TokenService
JWT token management:
- Generate access and refresh tokens
- Verify tokens
- Hash refresh tokens (bcrypt)
- Store and retrieve tokens from database
- Revoke tokens
- Cleanup expired tokens

#### AuditService
Audit logging for security monitoring:
- Log all authentication events
- Track failed login attempts
- Monitor user actions
- Query audit logs by user or tenant

### Guards

#### JwtAuthGuard
- Applied globally to all routes
- Validates JWT access tokens
- Enforces multi-tenant isolation
- Can be bypassed with `@Public()` decorator

#### RolesGuard
- Checks user roles
- Use with `@Roles('admin', 'manager')` decorator

#### PermissionsGuard
- Checks user permissions
- Use with `@Permissions('users:create', 'users:update')` decorator

### DTOs

#### RegisterDto
```typescript
{
  email?: string;        // Optional if phone provided
  phone?: string;        // Optional if email provided
  password: string;      // Min 8 chars, must contain uppercase, lowercase, number, special char
  tenantId: string;
  firstName: string;
  lastName: string;
}
```

#### LoginDto
```typescript
{
  email?: string;        // Optional if phone provided
  phone?: string;        // Optional if email provided
  password: string;
}
```

#### RefreshDto
```typescript
{
  refreshToken: string;  // Can also be sent via cookie
}
```

## API Endpoints

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "tenantId": "tenant_123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "tenantId": "tenant_123"
    }
  }
}
```

### POST /auth/login
Login with email or phone.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "tenantId": "tenant_123"
    }
  }
}
```

**Note:** Refresh token is set in HTTP-only cookie named `refreshToken`.

### POST /auth/refresh
Refresh access token.

**Request:**
Refresh token can be sent via cookie (automatic) or in body:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "tenantId": "tenant_123"
    }
  }
}
```

**Note:** Old refresh token is revoked, new one is set in cookie.

### POST /auth/logout
Logout and revoke refresh token.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/me
Get current user profile (protected route).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "tenantId": "tenant_123",
    "roles": ["admin", "user"]
  }
}
```

## Usage Examples

### Protecting Routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { Roles } from './modules/auth/decorators/auth.decorators';
import { CurrentUser } from './modules/auth/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard) // Already applied globally, but can be explicit
export class UsersController {
  // Public route (skip authentication)
  @Public()
  @Get('public')
  getPublicData() {
    return { message: 'This is public' };
  }

  // Protected route (requires authentication)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  // Role-protected route
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @Get('admin')
  getAdminData() {
    return { message: 'Admin only' };
  }

  // Permission-protected route
  @UseGuards(PermissionsGuard)
  @Permissions('users:delete')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return { message: 'User deleted' };
  }
}
```

### Multi-Tenant Isolation

The `JwtAuthGuard` automatically enforces tenant isolation:

```typescript
// User from tenant A cannot access tenant B's data
// The guard checks: request.tenantId === user.tenantId
```

To set tenant context, use the `x-tenant-id` header or subdomain (configured in TenantMiddleware).

### Audit Logs

All authentication events are automatically logged:

```typescript
// Query audit logs
const userLogs = await auditService.getUserAuditLogs(userId);
const tenantLogs = await auditService.getTenantAuditLogs(tenantId);
const failedLogins = await auditService.getFailedLoginAttempts(tenantId, since);
```

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character (@$!%*?&)

### Token Security
- Access tokens: 15 minutes (short-lived)
- Refresh tokens: 7 days (long-lived)
- Refresh tokens are hashed with bcrypt (12 rounds) before storage
- Refresh tokens are rotated on every refresh
- Old refresh tokens are immediately revoked

### Cookie Security
- HTTP-only: Cannot be accessed by JavaScript
- Secure: Only sent over HTTPS in production
- SameSite: Strict (CSRF protection)
- Path: / (available to all routes)

### Multi-Tenant Security
- Tenant ID is embedded in JWT payload
- Guards validate tenant ID matches request context
- Database queries are automatically scoped to tenant

## Environment Variables

Required environment variables:

```bash
# JWT Configuration
JWT_ACCESS_SECRET=your_strong_random_secret_here
JWT_REFRESH_SECRET=your_different_strong_random_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECRET=your_cookie_secret_here

# Application
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Database Schema

### RefreshToken Model
```prisma
model RefreshToken {
  id           String   @id @default(cuid())
  userId       String
  tenantId     String
  tokenHash    String   @unique
  userAgent    String?
  isRevoked    Boolean  @default(false)
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([tokenHash])
}
```

### AccessLog Model
```prisma
model AccessLog {
  id        String   @id @default(cuid())
  userId    String
  tenantId  String
  action    String
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  tenant Tenant @relation(fields: [tenantId], references: [id])
}
```

## Maintenance

### Cleanup Expired Tokens

Run periodically (e.g., daily cron job):

```typescript
const count = await tokenService.cleanupExpiredTokens();
console.log(`Cleaned up ${count} expired tokens`);
```

### Revoke All User Tokens

Useful for password change or security breach:

```typescript
await authService.revokeAllUserTokens(userId);
```

## Error Handling

All errors return standardized format:

```json
{
  "success": false,
  "error": {
    "statusCode": 401,
    "message": "Invalid credentials",
    "error": "Unauthorized"
  }
}
```

Common error codes:
- `400`: Bad Request (validation failed)
- `401`: Unauthorized (invalid credentials, expired token)
- `403`: Forbidden (insufficient permissions)
- `409`: Conflict (user already exists)

## Testing

Run tests:
```bash
pnpm test                 # Unit tests
pnpm test:e2e            # Integration tests
pnpm test:cov            # Coverage report
```

## Future Enhancements

- [ ] Rate limiting per IP/user
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub, etc.)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Account lockout after failed attempts
- [ ] Session management dashboard
- [ ] WebSocket authentication
