# Accès écoles — envoi auto 3 canaux + lien de création de mot de passe

## Contexte

Aujourd’hui, à la validation d’une école :

1. Le serveur envoie **déjà** SMS + WhatsApp + email (messages d’accueil).
2. `PostValidationModal` demande **en plus** à l’admin de choisir un moyen (WhatsApp / mailto / copier) → **double envoi** et travail manuel inutile.
3. Les messages disent « Identifiant : téléphone » mais **aucun compte `User` n’est créé** → l’école ne peut **jamais se connecter**.
4. Envoyer un mot de passe en clair dans WhatsApp/SMS/email est **mauvais**.

**Objectif :** à la validation, le serveur crée l’accès, génère un **lien unique** et notifie **automatiquement** sur les 3 canaux. L’école ouvre le lien, choisit **son** mot de passe.

---

## Décisions

| Sujet | Décision |
|-------|----------|
| Choix du canal par l’admin | **Supprimé** |
| Envoi | **Automatique** : SMS + WhatsApp + email (best-effort) |
| Secret envoyé | **Lien** `set-password?token=…` — **jamais** de mot de passe en clair |
| Premier mdp | Choisi **par l’école** sur la page du lien |
| Validité du lien | **30 min** (config `SETUP_LINK_TTL_SECONDS`, défaut `1800`) |
| Usages du token | **1 seule fois** ; nouveau lien = ancien révoqué |
| Après setup | `mustChangePassword = false` ; login normal email/téléphone + mdp |

---

## Flux cible

```
[Super admin] Clique « Valider »
        ↓
[Server] POST /admin/tenants/:id/validate
        ├─ status = active (existant)
        ├─ upsert User admin (si absent) + rôle Admin tenant
        ├─ gen token setup (30 min, hashé en base)
        ├─ SMS     → bienvenue + lien
        ├─ WhatsApp→ bienvenue + lien
        └─ Email   → bienvenue + lien
        ↓
[Front] PostValidationModal simplifiée
        → « Accès envoyés (SMS / WhatsApp / Email) » + statuts
        → bouton « Renvoyer »
        ↓
[École] Ouvre le lien → /set-password?token=…
        → choisit son mot de passe
        → connectée
```

---

## Schéma Prisma (ajouts)

```prisma
model User {
  // … existant …
  mustChangePassword Boolean   @default(false)
}

model SetupToken {
  id        String    @id @default(cuid())
  tokenHash String    @unique
  userId    String
  tenantId  String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([tenantId])
  @@index([expiresAt])
}
```

> Après migration : `npx prisma migrate dev --name setup-token-access`  
> (suite à #6, la baseline est en place — pas de `db push`).

---

## Backend

### 1. Helpers

| Fichier | Rôle |
|---------|------|
| `server/src/modules/auth/utils/setup-token.ts` | `generateSetupToken()` → token aléatoire (32 bytes hex) + hash SHA-256 pour la base |
| `env` | `SETUP_LINK_TTL_SECONDS` (défaut `1800`), `CLIENT_URL` (existant) |

- Stocker **uniquement** `tokenHash` (jamais le token clair).
- URL : `${CLIENT_URL}/set-password?token=${tokenPlain}`

### 2. `tenant.service.validate()` (existant → enrichi)

Ordre :

1. Logique statut `active` + logs + audit **existants**.
2. **Provisioning compte** (si aucun `User` pour ce tenant / téléphone) :
   - `email` = email école si présent, sinon placeholder dérivé du téléphone si le modèle l’autorise, sinon phone comme identifiant login côté service.
   - `password` : hash d’un aléatoire inutilisable (jamais envoyé) OU laisser null selon contrainte Prisma → utiliser hash bcrypt d’un secret jetable.
   - `firstName` = nom école ou « Admin », `lastName` = « École ».
   - `isActive = true`, `mustChangePassword = true`.
   - Créer rôle `Admin` (level 2) du tenant si absent + `UserRole`.
3. **Révoquer** les `SetupToken` non utilisés du user.
4. **Créer** nouveau `SetupToken` (expiresAt = now + TTL).
5. Construire **un seul** payload message (texte identique 3 canaux) :
   - Nom école
   - Lien set-password
   - Expiration (ex. « valable 30 minutes »)
   - **Pas** de mot de passe, **pas** « identifiant = phone » faux.
6. Envoyer **en parallèle best-effort** :
   - `smsService` → texte court + lien
   - `whatsappService` → texte d’accueil + lien
   - `emailService` → si `tenant.email`
7. Retour API : `{ ..., notifications: { sms: boolean, whatsapp: boolean, email: boolean|skipped } }` pour alimenter la modal.

### 3. Endpoints setup password

| Méthode | Route | Body | Effet |
|---------|-------|------|-------|
| `GET` | `/auth/setup/:token` | — | Valide token → `{ schoolName, expiresAt }` ou 400/410 |
| `POST` | `/auth/setup/:token` | `{ password }` | Hash password, `mustChangePassword=false`, marque token `usedAt`, login OK ensuite |
| `POST` | `/auth/setup/:token/resend` *ou* re-validate | — | (option) régénérer — via super admin `validate` à nouveau |

Validation password : **mêmes règles** que `RegisterDto` (min 8, maj, min, chiffre, spécial).

**Cas d’erreur :**

| Cas | HTTP | Message |
|-----|------|---------|
| Token inconnu | 400 | Lien invalide |
| Expired | 410 | Lien expiré — demander un nouvel envoi |
| Déjà utilisé | 410 | Lien déjà utilisé |
| Password trop faible | 400 | Règles class-validator |

### 4. Login (déjà OK côté API)

- `POST /auth/login` email **ou** phone + password — inchangé.
- Front doit envoyer `phone` quand l’utilisateur tape un numéro (voir client).

---

## Frontend

### 1. `PostValidationModal.tsx` — **simplifier**

**Supprimer :**

- Boutons « Envoyer WhatsApp » (`wa.me`)
- Bouton mailto
- Bouton copier message
- Texte « Identifiant de connexion : téléphone »

**Remplacer par :**

- Bandeau succès (existant)
- Liste des 3 canaux avec statut reçu de l’API :
  - WhatsApp → numéro · ✅ envoyé / ⚠️ échec
  - SMS → numéro · ✅ / ⚠️
  - Email → adresse · ✅ / ⚠️ / — pas d’email
- Mention : « Lien de création du mot de passe — valable 30 min »
- Bouton **Renvoyer les accès** (relance validate ou endpoint resend)
- Bouton **Continuer**

### 2. Page `/set-password` (nouvelle)

`client/src/app/set-password/page.tsx` :

1. Lire `token` depuis l’URL.
2. `GET /auth/setup/:token` → nom école ou erreur.
3. Formulaire : mot de passe + confirmation + (option) régle d’aide.
4. `POST /auth/setup/:token` → toast succès → `router.push("/login")`.
5. États : chargement, token invalide/expiré (CTA « Contacter le support » / « Renvoyer »).

### 3. Login

- Si l’utilisateur tape `+243…` dans le champ email → envoyer `{ phone, password }` au lieu de `{ email, password }` (backend le supporte déjà).

---

## Modal / messages (texte sugerme)

### WhatsApp / SMS (court)

```
Votre école « {name} » est validée sur EduGoma.
Créez votre mot de passe (lien valable 30 min) :
{CLIENT_URL}/set-password?token=…
```

### Email

Sujet : `Activation de votre espace EduGoma — {name}`  
Corps : statut actif + même lien + note expiration + support.

---

## Ce qu’on ne fait plus

- [ ] Modal « choisir WhatsApp / email / copier »
- [ ] Mot de passe envoyé en clair
- [ ] Phrase « Identifiant de connexion : +243… » sans compte
- [ ] `db push` (baseline #6 déjà en place)

---

## Ordre d’implémentation

1. **Prisma** : modèle `SetupToken` + `User.mustChangePassword` + migration  
2. **Utils** : génération/hash token + helper URL  
3. **Validate** : provision user + token + envoi 3 canaux + retour `notifications`  
4. **API setup** : `GET`/`POST /auth/setup/:token`  
5. **Front** : `PostValidationModal` simplifiée (statuts)  
6. **Front** : page `/set-password`  
7. **Front** : login téléphone vs email  
8. **Vérifs** : `tsc` server + client, `jest`, seed, parcours manuel validate → lien → login  
9. **Commit** sur `feat/auth-security-and-dashboard-ui`

---

## Config env

```env
CLIENT_URL=http://localhost:3000
SETUP_LINK_TTL_SECONDS=1800
# WhatsApp / SMS / SMTP : déjà utilisés par validate (best-effort)
```

---

## Tests minimaux

| Test | Type |
|------|------|
| Validate crée User + SetupToken + n’envoie pas de mdp clair | unit / e2e |
| `POST /auth/setup/:token` avec bon mdp → login OK | e2e |
| Token expiré → 410 | unit |
| Token déjà utilisé → 410 | unit |
| Modal n’appelle plus `wa.me` / `mailto` | revue front |

---

## Statut

| Étape | Statut |
|-------|--------|
| Ce document | ✅ |
| Prisma SetupToken | ✅ |
| Validate auto 3 canaux + token | ✅ |
| API set-password | ✅ |
| Modal simplifiée | ✅ |
| Page `/set-password` | ✅ |
| Login phone/email | ✅ |
| Tests | ✅ (tsc server+client, jest 126, e2e admin 10/10, next build) |
| Commit | ⬜ (en attente validation)
