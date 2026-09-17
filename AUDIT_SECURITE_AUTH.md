# Audit de sécurité — Porte d'entrée d'EduGoma

## Tableau synthétique

| Protection | Statut | Preuve dans le code | Emplacement |
|------------|--------|---------------------|-------------|
| Rate limiting `/login` | ❌ Absent | ThrottlerModule configuré globalement (10 req/min) mais **pas appliqué** sur `/auth/login` | `app.module.ts:19-22`, `auth.controller.ts:34-60` |
| Account lockout | ❌ Absent | Aucun mécanisme de verrouillage après échecs | `auth.service.ts:97-168`, `README.md:426` (futur) |
| CAPTCHA | ❌ Absent | Aucune implémentation ni référence | — |
| Failed login logging | ✅ Implémenté | `AuditService.logLoginFailed()` appelé dans `login()` | `auth.service.ts:127-128`, `audit.service.ts:77-85` |
| Helmet | ✅ Implémenté | `app.use(helmet())` au bootstrap | `main.ts:13` |
| CORS | ⚠️ Partiellement implémenté | `origin: env.CLIENT_URL`, `credentials: true` — pas de restriction par environnement | `main.ts:19-22` |
| HttpOnly (refresh cookie) | ✅ Implémenté | `httpOnly: true` sur cookie refreshToken | `auth.controller.ts:48` |
| Secure (refresh cookie) | ⚠️ Partiellement implémenté | `secure: process.env.NODE_ENV === 'production'` — dépend de variable d'env | `auth.controller.ts:49` |
| SameSite (refresh cookie) | ✅ Implémenté | `sameSite: 'strict'` | `auth.controller.ts:50` |
| Refresh rotation | ✅ Implémenté | Nouveau token généré, ancien révoqué via `revokeRefreshToken()` | `auth.service.ts:199-221`, `token.service.ts:140-145` |
| Refresh revocation | ✅ Implémenté | `revokeRefreshToken()`, `revokeAllUserTokens()`, `revokeRefreshTokenByHash()` | `token.service.ts:140-165` |
| Password policy | ✅ Implémenté | Min 8 chars, majuscule, minuscule, chiffre, spécial + bcrypt 12 rounds | `register.dto.ts:15-21`, `auth.service.ts:9,65` |
| 2FA / MFA | ❌ Absent | Aucune implémentation, seulement prévu dans README | `README.md:422` |
| Global API rate limit | ⚠️ Partiellement implémenté | ThrottlerModule global (10 req/min) — pas sur endpoints sensibles | `app.module.ts:19-22` |
| OTP protection (verify-phone) | ⚠️ Partiellement implémenté | Code 6 chiffres, expiration DB (null après usage), **pas de rate limit ni max tentatives** | `tenant.service.ts:93-126`, `verify-phone.dto.ts:11-14` |
| Account enumeration protection | ✅ Implémenté | Messages identiques "Invalid credentials" user existe ou non | `auth.service.ts:113-116` |
| RBAC / Autorisation | ✅ Implémenté | Guards globaux (JwtAuthGuard), RolesGuard, PermissionsGuard, AdminGuard | `auth.module.ts:24-27`, `guards/*.ts` |
| Audit Log | ✅ Implémenté | `AuditService` log toutes actions auth + `TenantLog` pour actions tenant | `audit.service.ts`, `tenant.service.ts:306-322` |

---

## Détail par protection

### 1. Protection du endpoint `/login`

#### Rate limiting — ❌ Absent
- **Fichier** : `app.module.ts:19-22`, `auth.controller.ts:34-60`
- **Configuration** : `ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }])` — limite globale de 10 req/min/IP
- **Ce qui manque** : Le décorateur `@Throttle()` n'est **pas appliqué** sur `POST /auth/login` ni sur `POST /auth/register`
- **Ce qui est réellement protégé** : Seulement `POST /demo-requests` (5 req/min)
- **Production** : La protection globale existe mais est trop permissive (10 req/min) et ne cible pas spécifiquement l'auth

#### Brute force / verrouillage — ❌ Absent
- **Fichier** : `auth.service.ts:97-168`, `README.md:426`
- **Constat** : Aucun compteur d'échecs, aucune temporisation, aucun verrouillage compte/IP
- **Documentation** : Le README mentionne explicitement `[ ] Account lockout after failed attempts` comme "Future Enhancement"
- **Logging** : Les échecs sont logués (`AuditService.logLoginFailed`) mais ne déclenchent aucune action

#### CAPTCHA — ❌ Absent
- **Constat** : Aucune librairie (reCAPTCHA, hCaptcha, turnstile), aucune référence dans le code, aucune intégration frontend/backend

#### Logging tentatives échouées — ✅ Implémenté
- **Fichier** : `auth.service.ts:127-128`, `audit.service.ts:77-85`, `audit.service.ts:162-180`
- **Informations enregistrées** : `userId`, `tenantId`, `action: 'LOGIN_FAILED'`, `ip`, `userAgent`, `createdAt`
- **Requête de monitoring** : `AuditService.getFailedLoginAttempts(tenantId, since)` permet de récupérer les échecs par tenant sur une période
- **Identification attaque** : Possible via analyse des logs (IP, userId, fréquence), mais **pas d'alerte automatique**

---

### 2. Protection HTTP

#### Helmet / Security Headers — ✅ Implémenté
- **Fichier** : `main.ts:13`
- **Headers envoyés** (par défaut Helmet) :
  - `Content-Security-Policy`
  - `Cross-Origin-Embedder-Policy`
  - `Cross-Origin-Opener-Policy`
  - `Cross-Origin-Resource-Policy`
  - `Origin-Agent-Cluster`
  - `Referrer-Policy`
  - `Strict-Transport-Security` (HSTS)
  - `X-Content-Type-Options: nosniff`
  - `X-DNS-Prefetch-Control`
  - `X-Download-Options`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Permitted-Cross-Domain-Policies`
  - `X-XSS-Protection: 0`

#### CORS — ⚠️ Partiellement implémenté
- **Fichier** : `main.ts:19-22`
- **Configuration actuelle** :
  ```typescript
  app.enableCors({
    origin: env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });
  ```
- **Origines autorisées** : Une seule (`CLIENT_URL` ou localhost:5173)
- **Problèmes** :
  - Pas de distinction dev/prod (même config)
  - Pas de validation dynamique des origines
  - `methods` non explicitement restreint (tout autorisé par défaut)
  - `allowedHeaders` non configuré
- **Production** : Restreint à une seule origine mais sans défense en profondeur

---

### 3. Cookies et sessions

#### Cookie `refreshToken` (seul cookie d'auth)

| Attribut | Valeur | Validation |
|----------|--------|------------|
| `HttpOnly` | `true` | ✅ |
| `Secure` | `process.env.NODE_ENV === 'production'` | ⚠️ Dépend de variable d'env |
| `SameSite` | `'strict'` | ✅ |
| `Domain` | Non défini (défaut: host actuel) | ✅ OK si sous-domaine unique |
| `Path` | `'/'` | ✅ |
| `Max-Age` | `7 * 24 * 60 * 60 * 1000` (7 jours) | ✅ Cohérent avec JWT refresh |

- **Fichier** : `auth.controller.ts:47-53` (login), `auth.controller.ts:76-82` (refresh), `auth.controller.ts:104-109` (logout)
- **Access token** : Non stocké en cookie (retourné en JSON, stocké côté client en mémoire/localStorage)
- **Refresh token** : Stocké en cookie HTTP-only + haché en base (SHA256)

---

### 4. Access Token / Refresh Token

#### Access Token — ✅ Implémenté
- **Durée** : `15m` (`env.JWT_ACCESS_EXPIRES_IN`, `env.ts:10`)
- **Signature** : HMAC SHA256 (`jsonwebtoken`, secret `JWT_ACCESS_SECRET`)
- **Secret** : Variable d'env `JWT_ACCESS_SECRET` (défaut: 'change_me' — **à changer en prod**)
- **Contenu (payload)** : `sub` (userId), `tenantId`, `email`, `phone`
- **Validation backend** : `TokenService.verifyAccessToken()` + `AuthService.validateUser()` dans `JwtAuthGuard` (vérif user actif + tenant match)

#### Refresh Token — ✅ Implémenté avec rotation
- **Durée** : `7d` (`env.JWT_REFRESH_EXPIRES_IN`, `env.ts:11`)
- **Signature** : HMAC SHA256, secret différent `JWT_REFRESH_SECRET`
- **Rotation** : **OUI** — À chaque `POST /auth/refresh` :
  1. Vérification JWT + hash en base (`verifyStoredRefreshToken`)
  2. Génération **nouveau** access + refresh token
  3. **Révocation** ancien (`revokeRefreshToken(storedToken.id)`)
  4. Stockage nouveau hash en base
- **Stockage** : Hash SHA256 en base (`RefreshToken.tokenHash` @unique), jamais en clair
- **Expiration** : 7 jours (`expiresAt` en base), nettoyage possible via `cleanupExpiredTokens()`
- **Détection réutilisation** : **OUI** — Si token révoqué (`isRevoked=true`) → erreur "Refresh token has been revoked"
- **Révocation** : `revokeRefreshToken(id)`, `revokeRefreshTokenByHash(hash)`, `revokeAllUserTokens(userId)`
- **Logout** : Révoque le token utilisé + clear cookie
- **Compromission** : `revokeAllUserTokens(userId)` invalide toutes les sessions utilisateur

---

### 5. Politique de mot de passe

- **Longueur minimale** : 8 caractères (`register.dto.ts:17`)
- **Complexité** : Au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial `@$!%*?&` (`register.dto.ts:18-20`)
- **Hash** : **bcrypt 12 rounds** (`auth.service.ts:9`, `auth.service.ts:65`)
- **Protection mots de passe faibles** : Uniquement via regex complexité (pas de liste commune, pas de zxcvbn, pas de HaveIBeenPwned)
- **Réutilisation ancien mot de passe** : **Non implémenté** (pas d'historique)
- **Changement/réinitialisation mot de passe** : **Absent** (pas d'endpoint `/forgot-password`, `/reset-password`, `/change-password`)

---

### 6. Protection endpoints inscription / récupération

#### `/auth/register` — ⚠️ Partiellement protégé
- **Rate limiting** : ❌ Absent (pas de `@Throttle`)
- **Validation** : ✅ DTO strict (email XOR phone, password policy, tenantId requis)
- **Anti-spam** : ❌ Aucun (pas de CAPTCHA, pas de honeypot)
- **Vérif téléphone** : ❌ Non faite à l'inscription (séparée via `/tenants/register`)

#### `/tenants/register` (inscription école) — ⚠️ Partiellement protégé
- **Rate limiting** : ❌ Absent
- **Validation** : ✅ DTO strict (nom unique, phone unique format RDC, email optionnel)
- **Protection spam** : ❌ Aucune
- **Vérif téléphone** : ✅ Code SMS 6 chiffres généré, stocké en base (`validationCode`), envoyé via SMS
- **Expiration code OTP** : ❌ **Pas d'expiration** en base (champ `validationCode` sans TTL)
- **Max tentatives OTP** : ❌ **Pas de limite** (pas de compteur)

#### `/tenants/verify-phone` — ⚠️ Partiellement protégé
- **Expiration code** : ❌ Pas de TTL (code valide indéfiniment jusqu'à usage)
- **Nb tentatives** : ❌ Pas de limite, pas de compteur
- **Réutilisation ancien code** : ✅ Code mis à `null` après succès (`tenant.service.ts:115`)
- **Rate limiting** : ❌ Absent

#### `/forgot-password` — ❌ Absent
- **Endpoint inexistant** — Pas de flux récupération mot de passe

---

### 7. Protection contre l'énumération des comptes — ✅ Implémenté

| Endpoint | Comportement |
|----------|--------------|
| `/auth/login` | `auth.service.ts:113-116` — Même erreur `"Invalid credentials"` user existe ou non |
| `/auth/register` | `auth.service.ts:60-62` — `ConflictException: "User with this email or phone already exists"` — **FUITE** |
| `/tenants/register` | `tenant.service.ts:30-31` — `ConflictException: "This school already exists with this phone number"` — **FUITE** |
| `/tenants/verify-phone` | `tenant.service.ts:98-99` — `NotFoundException: "School not found"` vs `BadRequestException: "Phone number already verified"` — **FUITE** |
| `/forgot-password` | N/A (absent) |

**Conclusion** : Protection **partielle** — `/login` protège, mais `/register` et `/tenants/*` fuitent l'existence

---

### 8. Rate limiting global — ⚠️ Partiellement implémenté

- **Middleware/Guard/Interceptor** : `ThrottlerModule` (NestJS) — basé sur Guard `ThrottlerGuard`
- **Librairie** : `@nestjs/throttler`
- **Limites** : Global `10 req/min/IP` (`app.module.ts:21`)
- **Endpoints exclus** : Routes `@Public()` ne sont **pas** exclues automatiquement — le Throttler s'applique à toutes les routes sauf si `@SkipThrottle()`
- **Endpoints sensibles protégés** : **Non** — `/auth/login`, `/auth/register`, `/auth/refresh`, `/tenants/register`, `/tenants/verify-phone` n'ont **pas** de `@Throttle()` spécifique
- **Seul protégé** : `/demo-requests` (5 req/min)

---

### 9. 2FA / MFA — ❌ Absent

- **Recherche termes** : `2FA`, `MFA`, `TwoFactor`, `TOTP`, `Authenticator`, `OTP`, `WebAuthn`, `passkeys` — **Aucun résultat** dans le code backend
- **Frontend** : `stitch_login.html` et composants UI — aucune trace de 2FA
- **README** : `auth/README.md:422` — `[ ] Two-factor authentication (2FA)` listé comme "Future Enhancement"
- **Implémentation réelle** : **Aucune** (ni TOTP, ni SMS, ni email, ni WebAuthn)

---

### 10. RBAC / Autorisation — ✅ Implémenté

#### Architecture
- **Guards globaux** : `JwtAuthGuard` appliqué globalement via `APP_GUARD` (`auth.module.ts:24-27`)
- **Bypass** : Décorateur `@Public()` pour routes d'auth
- **Contrôle rôles** : `RolesGuard` + décorateur `@Roles('admin', 'manager')`
- **Contrôle permissions** : `PermissionsGuard` + décorateur `@Permissions('users:create')`
- **AdminGuard** : Vérifie rôle "Admin" spécifiquement (pour super-admin ?)

#### Séparation rôles
- **Modèle** : `Role` par tenant, `UserRole` liaison, `Permission` globale, `RolePermission` liaison
- **Rôles identifiés** : "Admin" (vérifié dans `AdminGuard`), autres selon seed
- **Vérification backend** : Oui — dans guards, requêtes Prisma avec jointures
- **Protection routes sensibles** : Via guards explicites sur contrôleurs

#### Attention
- **Frontend-only** : Non vérifié (pas d'audit frontend complet), mais backend **vérifie** à chaque requête protégée

---

### 11. Audit des actions sensibles — ✅ Implémenté (partiel)

#### Actions tracées (Auth)
| Action | Méthode | Fichier |
|--------|---------|---------|
| Création utilisateur | `logRegister` | `audit.service.ts:51-59` |
| Connexion succès | `logLoginSuccess` | `audit.service.ts:64-72` |
| **Connexion échec** | `logLoginFailed` | `audit.service.ts:77-85` |
| Refresh token | `logRefreshToken` | `audit.service.ts:90-98` |
| Déconnexion | `logLogout` | `audit.service.ts:103-111` |
| Changement mot de passe | `logPasswordChange` | `audit.service.ts:116-124` | ⚠️ **Non appelé** (endpoint absent) |
| Révocation token | `TOKEN_REVOKED` | Enum défini mais **pas de méthode** |

#### Actions tracées (Tenant / École)
| Action | Méthode | Fichier |
|--------|---------|---------|
| Création école | `logTenantAction('registered')` | `tenant.service.ts:71-74` |
| Modification école | ❌ Non tracé | — |
| Approbation école | `logTenantAction('validated')` | `tenant.service.ts:234-236` |
| Désactivation école | ❌ Non tracé (rejet tracé) | `logTenantAction('rejected')` |
| Création admin | ❌ Non tracé | — |
| Modification utilisateur | ❌ Non tracé | — |
| Désactivation utilisateur | ❌ Non tracé | — |
| Paramètres système | ❌ Non tracé | — |
| Changement rôle | ❌ Non tracé | — |
| Actions Super-Admin | ❌ Non tracé spécifiquement | — |

#### Système d'Audit Log
- **Modèle** : `AccessLog` (auth) + `TenantLog` (écoles)
- **Champs** : `userId`, `tenantId`, `action`, `ip`, `userAgent`, `createdAt` + `metadata` (JSON string) pour TenantLog
- **Requêtage** : `getUserAuditLogs()`, `getTenantAuditLogs()`, `getFailedLoginAttempts()`

---

## Conclusion

### 1. ✅ Déjà protégé
- Helmet (security headers)
- HttpOnly + SameSite=Strict sur refresh cookie
- Rotation + révocation refresh tokens (stockage hash SHA256)
- Bcrypt 12 rounds pour passwords
- Politique mot de passe forte (8 chars + 4 classes)
- Protection énumération sur `/login` (même message erreur)
- RBAC complet (JwtAuthGuard global, RolesGuard, PermissionsGuard, AdminGuard)
- Multi-tenant isolation (tenantId dans JWT + validation guard)
- Audit logs authentification (succès, échec, refresh, logout, register)
- Audit logs tenant (création, vérif phone, validation, rejet)

### 2. ⚠️ Partiellement protégé
| Protection | Lacune principale |
|------------|-------------------|
| CORS | Une seule origine, pas de config différenciée dev/prod, méthodes/headers non restreints |
| Secure cookie | Dépend de `NODE_ENV=production` (risque si mal configuré) |
| Global rate limit | 10 req/min trop permissif, pas ciblé sur auth |
| OTP verify-phone | Pas d'expiration code, pas de max tentatives, pas de rate limit |
| Account enumeration | Protégé sur `/login` MAIS fuite sur `/register` et `/tenants/*` |
| Audit actions sensibles | Manque : modif école, création admin, modif user, désactivation, params système, changement rôle |

### 3. ❌ Non implémenté
- Rate limiting spécifique sur `/auth/login`, `/auth/register`, `/auth/refresh`
- Account lockout / brute force protection (compteur échecs, verrouillage temporaire)
- CAPTCHA (aucun)
- 2FA / MFA (aucun — TOTP, SMS, email, WebAuthn)
- Forgot password / Reset password / Change password (endpoints absents)
- Historique mots de passe (réutilisation non empêchée)
- Expiration code OTP (tenants)
- Rate limiting sur endpoints tenant publics (`/tenants/register`, `/tenants/verify-phone`)

### 4. ❓ À vérifier manuellement
- **Variables d'env production** : `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET` changés ? (défauts 'change_me')
- **HTTPS en production** : `Secure` cookie + HSTS + `CLIENT_URL` en HTTPS ?
- **Reverse proxy / Load balancer** : `req.ip` fiable ? (headers `X-Forwarded-For` ?)
- **Configuration Helmet CSP** : Compatible avec frontend (inline scripts, styles, fonts) ?
- **Nettoyage tokens expirés** : Cron job configuré pour `TokenService.cleanupExpiredTokens()` ?
- **Monitoring alertes** : Alertes sur `getFailedLoginAttempts` (seuil, notification) ?
- **Secrets rotation** : Procédure rotation `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` ?
- **CORS production** : `CLIENT_URL` unique et HTTPS vérifié ?

---

## Priorités de vérification (dépendance technique / urgence)

1. **Secrets JWT / Cookie en production** — Dépendance : tous les tokens, cookies, sessions
2. **HTTPS + Secure cookie + HSTS** — Dépendance : `Secure` flag, CSP, confiance navigateur
3. **Rate limiting `/auth/login` + `/auth/register`** — Dépendance : protection brute force, énumération
4. **Account lockout (compteur échecs + verrouillage)** — Dépendance : logs échecs existants, pas d'action
5. **Expiration OTP + max tentatives `/tenants/verify-phone`** — Dépendance : code stocké sans TTL, réutilisable
6. **Forgot/Reset/Change password** — Dépendance : flux complet absent, `logPasswordChange` inutilisé
7. **2FA / MFA** — Dépendance : architecture tokens/sessions prête, mais aucun facteur second
8. **Audit actions manquantes (admin, users, rôles, système)** — Dépendance : modèle `AccessLog` existe, il faut instrumenter
9. **CORS production restrictif + validation dynamique origines** — Dépendance : config statique actuelle
10. **Nettoyage tokens expirés (cron)** — Dépendance : méthode `cleanupExpiredTokens()` existe, pas d'ordonnancement
11. **Historique mots de passe** — Dépendance : pas de modèle, pas de vérif à la maj
12. **CAPTCHA** — Dépendance : choix fournisseur, intégration frontend/backend