# Plan d’améliorations — EduGoma

Document de suivi des améliorations prévues (issues GitHub à créer plus tard si besoin).

**État :** 🔴 + 🟠 + 🟠🟡 + #1–#6 et #8 faits (voir bas de page) · #7 reste à planifier ci-dessous.

---

## 1. Liste écoles : tri, pagination et filtres avancés

**Priorité :** haute  
**Type :** feature  
**État :** ✅ fait

- Pagination côté serveur (`page`, `limit`) sur `GET /admin/tenants` **et** `pending` / `active` / `suspended` (DTO `ListPageQueryDto`)
- Tri : nom, date de création/validation, statut, commune (UI via `sortKey` : city→commune, validation→status, registered→createdAt)
- Filtres : commune, type d’école (UI + backend), statut (validation), abonnement (trial/active/overdue/suspended)
- Recherche serveur (nom / téléphone / e-mail / id)
- Compteur « En retard » (+ actives, en attente, essai, suspendues) via `meta.counts`
- UI : composant réutilisable `client/src/components/ui/list-table.tsx` (`useListQuery`, `ListTable`, `toListParams`)
- Doublon sélect commune en en-tête retiré (chips `LIST_FILTERS` uniquement)

---

## 2. Données réelles élèves / documents / effectifs

**Priorité :** haute  
**Type :** feature  
**État :** ✅ fait

- `GET /admin/tenants/:id/stats` → `{ users, usersActive, students: null, documents: { provided, missing }, note }`
- `_count.users` dans `listTenants` → colonne Élèves = compteur users (pas de modèle Student → proxy honnête + note)
- Drawer : documents réels via `getStats` (validé → 3 docs fournis ; sinon manquants) + compteur effectif
- Mock Documents hardcodé supprimé

---

## 3. Impersonation admin : bouton « Se connecter »

**Priorité :** moyenne  
**Type :** feature  
**État :** ✅ fait

- `POST /admin/tenants/:id/impersonate` → JWT 30 min avec claim `imp` + audit `AccessLog` (qui/quand/quel tenant)
- `POST /admin/tenants/:id/impersonate/stop` → audit stop
- `JwtAuthGuard` : accepte `imp` sans match user↔tenant stricte ; `request.impersonation` exposé
- Client : bouton **Se connecter** dans le drawer (si Validé) → sauvegarde token admin → switch → reload
- Bandeau « Vous êtes connecté en tant que {école} » + bouton **Quitter** dans `layout.tsx`
- `auth-context` : `impersonating`, `stopImpersonation()` (restore backup + audit stop)

---

## 4. Synchronisation stats dashboard racine

**Priorité :** moyenne  
**Type :** fix  
**État :** ✅ fait

- Helper partagé `server/src/stats/tenant-counts.ts` → `getTenantCounts()` (all/active/pending/suspended/trial/overdue)
- `getSummary()` retourne `counts` (même source que la liste écoles) → plus de double vérité
- `listTenants()` réutilise le helper
- Client : `SummaryStats.counts` ; `pendingCount = summary.counts.pending` (drop `getPending()` redondant dans `use-dashboard`)
- Tuiles dashboard : **Écoles suspendues** + **Paiements en retard** (+ essai gratuit en détail)

---

## 5. Seed réaliste Goma

**Priorité :** moyenne  
**Type :** chore  
**État :** ✅ fait

- 9 écoles fixes Goma/Karisimbi/Mugunga/Nyiragongo (noms plausibles) — upsert par `name` (idempotent)
- Statuts : active / pending / suspended
- Abonnements : trial, actif payé, en retard (45j), suspendu
- Users + rôle Admin par école (upsert par email)
- `subscriptionStatus` défaut `trial` (jamais null — contrainte Prisma)
- Faker retiré pour les écoles (gardé pour users admin)

---

## 6. Migration Prisma (drift base de données)

**Priorité :** haute  
**Type :** fix  
**État :** ✅ fait

- Diagnostic : base créée via `db push` → table `_prisma_migrations` absente ; 2 migrations `init` obsolètes (colonnes retirées + tables manquantes : `subscriptionStatus`, `Payment`, `NotificationLog`, `Alert`, `Ticket`, etc.)
- **Baseline unique** `prisma/migrations/20260924000000_baseline_init/` générée depuis `schema.prisma` (UTF-8 **sans BOM**)
- Anciennes migrations supprimées
- Base dev locale : `prisma migrate resolve --applied 20260924000000_baseline_init`
- Vérifs :
  - `migrate status` → up to date
  - `migrate diff` (datasource ↔ schema) → vide
  - `migrate dev --create-only` → pas de drift
  - `migrate deploy` sur base neuve (`edugoma_fresh`) → OK
  - jest 126/126 ✅ · tsc ✅

### Procédure (dev / CI / env neuf)

| Contexte | Commande |
|----------|----------|
| Env **neuf** (CI, nouveau poste) | `npx prisma migrate deploy` |
| Dev local **existant** (déjà `db push`) | `npx prisma migrate resolve --applied 20260924000000_baseline_init` |
| Après changement de `schema.prisma` | `npx prisma migrate dev --name <description>` |
| **Ne plus** utiliser `db push` en dev | remplacé par migrate |

> Note : ne pas réécrire le SQL avec `Out-File -Encoding utf8` (BOM → erreur shadow DB). Préférer `UTF8Encoding(false)`.

---

## 7. SMS réels + hardening notifications

**Priorité :** basse  
**Type :** feature  

- SMS encore en mock (email Brevo + WhatsApp Meta déjà branchés / mock)
- Provider SMS RDC-compatible (ou fallback email) + variables d’env
- Cron J+0→J+30 : métriques d’envoi, alertes en cas d’échec répété, idempotence déjà en place
- Tableau de bord simple des envois (`NotificationLog`)

---

## 8. Tests e2e admin écoles

**Priorité :** moyenne  
**Type :** test  
**État :** ✅ fait

- Parcours : create → validate → mark paid → suspend → reactivate
- Garde : `JwtAuthGuard` + `SuperAdminGuard` sur chaque route
- Idempotence paiement (un Payment par période)
- `GET /admin/tenants/:id/users` et `suspended`
- Régression sur les routes unifiées `PATCH /admin/tenants/:id/subscription`
- Accès écoles (setup link) inclus — 10/10 verts via `npm run test:e2e`

---

## Hors périmètre de ce plan (déjà noté ailleurs)

- Wire complet de `requests/page.tsx`
- Renommage des libellés « Élèves » sur les autres pages du dashboard
- Breakdown commune/type dans `stats.service.ts`

---

## Fait déjà (contexte session)

| Sujet | Statut |
|-------|--------|
| Suspendre / Réactiver via API + filtre Suspendues | ✅ |
| URL subscription unique `/admin/tenants/:id/subscription` | ✅ |
| Liste écoles : tri/pagination/filtres (#1) | ✅ |
| Stats par école + documents drawer (#2) | ✅ |
| Impersonation super admin (#3) | ✅ |
| Stats dashboard synchronisées (#4) | ✅ |
| Seed réaliste Goma (#5) | ✅ |
| Migration Prisma baseline (#6) | ✅ |
| Accès écoles : lien set-password + envoi 3 canaux | ✅ |
| Tests e2e admin écoles (#8) | ✅ |
| Drawer : plan / paidAt réels + users API | ✅ |
| StatCards « Abonnement en retard » calculées | ✅ |
| Reload après inscription d’une école | ✅ |
| Email + WhatsApp welcome (#48 / #49) | ✅ |
| Cron notifications onboarding (#51) | ✅ |
| Paiement abonnement (#43) | ✅ |
