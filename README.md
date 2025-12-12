# 🎓 Education Goma - Backend API

Backend API pour le système de gestion scolaire multi-tenant de Goma, RDC.

## 🚀 Fonctionnalités

### ✅ Système Multi-Tenant
- Enregistrement d'écoles avec validation manuelle par admin
- Vérification SMS du numéro de téléphone
- États : pending, active, rejected, suspended
- Logs détaillés de toutes les actions

### 🔐 Authentification & Autorisation
- JWT (Access & Refresh tokens)
- RBAC (Role-Based Access Control)
- 8 rôles prédéfinis : Admin, Directeur, Secrétaire, Surveillant, Enseignant, Comptable, Parent, Élève
- 25+ permissions granulaires

### 📱 Modules
- **Tenant Management** : Gestion des écoles
- **User Management** : Gestion des utilisateurs
- **Auth** : Authentification JWT
- **RBAC** : Permissions et rôles
- **Access Logs** : Traçabilité

## 🛠️ Stack Technique

- **Framework** : NestJS 10
- **Database** : PostgreSQL
- **ORM** : Prisma 6
- **Auth** : JWT, bcryptjs
- **Validation** : class-validator
- **Security** : helmet, CORS
- **Compiler** : SWC (ultra rapide)

## 📦 Installation

```bash
# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos credentials

# Démarrer PostgreSQL
# Vérifier que le service postgresql-x64-17 est actif

# Appliquer les migrations et seed
pnpm exec prisma migrate reset --force

# Démarrer le serveur
pnpm run start:dev
```

## 🔑 Compte Admin par défaut

**Email** : `obedburindi@gmail.com`  
**Password** : `Obed2321Jtb`

⚠️ **À changer en production !**

## 📚 API Endpoints

### Public (Sans authentification)
- `POST /tenants/register` - Enregistrer une école
- `POST /tenants/verify-phone` - Vérifier le téléphone
- `GET /tenants/check-status/:phone` - Vérifier le statut

### Admin (Authentification requise)
- `GET /admin/tenants/pending` - Écoles en attente
- `GET /admin/tenants/active` - Écoles actives
- `POST /admin/tenants/:id/validate` - Valider une école
- `POST /admin/tenants/:id/reject` - Rejeter une école

### Auth
- `POST /auth/register` - Inscription utilisateur
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token
- `GET /auth/me` - Profil utilisateur
- `POST /auth/logout` - Déconnexion

## 🧪 Tests

Utiliser les fichiers `.http` pour tester :
- `tests-api.http` - Tests d'authentification
- `tests-tenant-api.http` - Tests de gestion des tenants

## 📂 Structure du projet

```
Backend/
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   ├── seed.ts            # Données initiales
│   └── migrations/        # Historique des migrations
├── src/
│   ├── common/            # Guards, filters, middlewares
│   ├── config/            # Configuration (env, logger)
│   ├── core/              # Prisma service
│   └── modules/
│       ├── auth/          # Authentification JWT
│       ├── tenant/        # Gestion des écoles
│       ├── user/          # Gestion des utilisateurs
│       ├── rbac/          # Permissions et rôles
│       └── access-log/    # Logs d'accès
└── tests-*.http           # Tests API
```

## 🔒 Sécurité

- ✅ Helmet pour les headers de sécurité
- ✅ CORS configuré
- ✅ Validation stricte des inputs
- ✅ Mots de passe hashés (bcrypt)
- ✅ JWT avec refresh tokens
- ✅ Rate limiting (à implémenter en production)

## 🌍 Environnement

Variables requises dans `.env` :

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/education_goma
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_secret
CLIENT_URL=http://localhost:5173
```

## 🚀 Déploiement

TODO: Instructions de déploiement pour production

## 📝 Licence

MIT

## 👨‍💻 Auteur

Obed Durindi - Education Goma Project
