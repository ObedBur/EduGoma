# 🏫 Système de Gestion des Écoles - Education Goma

## Vue d'ensemble

Ce système permet l'inscription de nouvelles écoles avec **validation manuelle obligatoire** par l'administrateur. Aucune école ne peut être active sans votre approbation explicite.

---

## 📋 Flux Complet d'Inscription

### Phase 1: Inscription de l'École (PUBLIC)
```
1. Une école remplit le formulaire d'inscription:
   - Nom de l'école (unique)
   - Numéro WhatsApp (+243...)
   - Email (optionnel)
   - Commune (Goma/Karisimbi/Mugunga/Nyiragongo/Other)
   - Type (private/conventionned/community/public)

2. Le système:
   ✓ Vérifie l'unicité du nom et téléphone
   ✓ Génère un code SMS à 6 chiffres
   ✓ Crée l'école avec status="pending"
   ✓ Envoie le code par SMS

3. L'école reçoit:
   📱 SMS: "Votre code de vérification Education Goma est: 123456"
```

### Phase 2: Vérification du Téléphone (PUBLIC)
```
1. L'école entre le code SMS reçu
2. Le système:
   ✓ Vérifie le code
   ✓ Marque isPhoneVerified=true
   ✓ Status reste "pending"
   ✓ Notification: "En attente de validation admin"
```

### Phase 3: Validation Manuelle (ADMIN)
```
1. Vous consultez le dashboard admin
2. Vous voyez les écoles en attente (phone verified)
3. Vous vérifiez manuellement (appel WhatsApp, etc.)
4. Vous cliquez sur:
   
   ✅ VALIDER
   → Status passe à "active"
   → École reçoit un SMS de bienvenue
   → Peut maintenant créer des comptes utilisateurs
   
   OU
   
   ❌ REJETER
   → Status passe à "rejected"
   → École reçoit un SMS avec la raison du rejet
   → Sera supprimée automatiquement après 30 jours
```

---

## 🔐 Sécurité & Règles Métier

### Règles d'Inscription
- ✅ 1 seul numéro de téléphone par école
- ✅ 1 seul nom d'école (pas de doublons)
- ✅ Format téléphone: +243XXXXXXXXX (RDC uniquement)
- ✅ Vérification SMS obligatoire
- ✅ Validation admin obligatoire

### Statuts Possibles
| Statut | Description | Actions Possible |
|--------|-------------|------------------|
| `pending` | En attente (après inscription) | Aucune, doit vérifier téléphone |
| `pending` (verified) | Téléphone vérifié, attend admin | Aucune, attend validation admin |
| `active` | Validée par admin | Peut créer utilisateurs |
| `rejected` | Rejetée par admin | Aucune, sera supprimée |
| `suspended` | Suspendue (futur) | Bloquée temporairement |

### Protections
- **Rate Limiting**: 3 inscriptions/heure par IP (TODO)
- **Liste noire**: Numéros frauduleux bloqués (TODO)
- **Logs**: Toutes les actions sont tracées dans `TenantLog`

---

## 🚀 API Endpoints

### PUBLIC (Sans Authentification)

#### 1. Inscrire une École
```http
POST /tenants/register
Content-Type: application/json

{
  "name": "École Primaire de Goma",
  "phone": "+243998765432",
  "email": "contact@ecolegoma.cd",
  "commune": "Goma",
  "type": "private"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "École enregistrée. Vérifiez votre téléphone pour le code SMS.",
  "tenant": {
    "id": "clXXX...",
    "name": "École Primaire de Goma",
    "phone": "+243998765432",
    "status": "pending"
  }
}
```

#### 2. Vérifier le Code SMS
```http
POST /tenants/verify-phone
Content-Type: application/json

{
  "phone": "+243998765432",
  "code": "123456"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Téléphone vérifié avec succès. En attente de validation admin.",
  "status": "pending"
}
```

#### 3. Vérifier le Statut
```http
GET /tenants/check-status/+243998765432
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "clXXX...",
    "name": "École Primaire de Goma",
    "phone": "+243998765432",
    "status": "pending",
    "isPhoneVerified": true,
    "createdAt": "2025-12-11T...",
    "rejectionReason": null
  }
}
```

---

### ADMIN (Authentification Requise)

#### 4. Liste des Écoles en Attente
```http
GET /admin/tenants/pending
Authorization: Bearer {admin_token}
```

**Réponse:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "clXXX...",
      "name": "École Primaire de Goma",
      "phone": "+243998765432",
      "email": "contact@ecolegoma.cd",
      "commune": "Goma",
      "type": "private",
      "status": "pending",
      "isPhoneVerified": true,
      "createdAt": "2025-12-11T..."
    }
  ]
}
```

#### 5. Liste des Écoles Actives
```http
GET /admin/tenants/active
Authorization: Bearer {admin_token}
```

#### 6. Valider une École
```http
POST /admin/tenants/{tenantId}/validate
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "validatedBy": "Admin Obed"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "École \"École Primaire de Goma\" validée avec succès",
  "tenant": {
    "id": "clXXX...",
    "name": "École Primaire de Goma",
    "status": "active",
    "validatedAt": "2025-12-11T..."
  }
}
```

#### 7. Rejeter une École
```http
POST /admin/tenants/{tenantId}/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Informations incomplètes",
  "validatedBy": "Admin Obed"
}
```

---

## 📊 Modèle de Données

### Table: Tenant (École)
```typescript
{
  id: string;                  // UUID
  name: string;                // Unique
  phone: string;               // Unique, +243...
  email?: string;              // Optionnel
  commune?: string;            // Goma/Karisimbi/...
  type?: string;               // private/conventionned/...
  status: string;              // pending/active/rejected/suspended
  validationCode?: string;     // Code SMS (supprimé après vérif)
  isPhoneVerified: boolean;    // false par défaut
  rejectionReason?: string;    // Si rejeté
  validatedAt?: DateTime;      // Quand validé
  validatedBy?: string;        // Par qui
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Table: TenantLog (Traçabilité)
```typescript
{
  id: string;
  tenantId: string;
  action: string;              // registered, phone_verified, validated, rejected
  ip?: string;
  userAgent?: string;
  metadata?: string;           // JSON
  createdAt: DateTime;
}
```

---

## 🧪 Tests

### Fichier de Tests
Utilisez `tests-tenant-api.http` avec l'extension **REST Client** de VS Code.

### Scénario de Test Complet
```bash
# 1. Inscrire une école
POST /tenants/register

# 2. Copier le code SMS depuis la console
# Exemple: "Code: 123456"

# 3. Vérifier le téléphone
POST /tenants/verify-phone
{ "phone": "+243...", "code": "123456" }

# 4. Vérifier le statut
GET /tenants/check-status/+243...

# 5. (ADMIN) Voir les écoles en attente
GET /admin/tenants/pending

# 6. (ADMIN) Valider l'école
POST /admin/tenants/{id}/validate

# 7. Vérifier que le statut est maintenant "active"
GET /tenants/check-status/+243...
```

---

## 📱 Configuration SMS

### Développement
Les SMS sont **simulés** et affichés dans la console:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 SMS VERIFICATION CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: +243998765432
Code: 123456
Message: Votre code de vérification Education Goma est: 123456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Production (Africa's Talking)
Décommenter et configurer dans `sms.service.ts`:
```typescript
// .env
SMS_API_KEY=your_africas_talking_api_key
SMS_USERNAME=your_africas_talking_username
SMS_SENDER_ID=EducationGoma
```

---

## 🔄 Commandes de Mise en Place

```bash
# 1. Formater le schema Prisma
npx prisma format

# 2. Créer la migration
npx prisma migrate dev --name add_tenant_validation_system

# 3. Générer le client Prisma
npx prisma generate

# 4. Démarrer le serveur
pnpm run start:dev

# 5. Tester avec REST Client
# Ouvrir tests-tenant-api.http et exécuter les requêtes
```

---

## ⚠️ TODO / Prochaines Étapes

- [ ] Ajouter un Guard Admin réel (actuellement les endpoints admin sont ouverts)
- [ ] Implémenter Rate Limiting (3 inscriptions/heure/IP)
- [ ] Configurer Africa's Talking pour prod
- [ ] Ajouter une tâche CRON pour supprimer les écoles rejetées après 30j
- [ ] Créer un dashboard admin simple (frontend)
- [ ] Ajouter liste noire de numéros

---

## 📝 Notes Importantes

1. **Les endpoints `/admin/*` sont temporairement OUVERTS** (pas de Guard). En production, ajoutez un Guard admin.
2. **Les SMS sont en mode DEV** (console). Configurez Africa's Talking pour la prod.
3. **Un seul admin pour l'instant** (vous). Système multi-admin à ajouter plus tard si nécessaire.
4. **Tous les logs sont tracés** dans `TenantLog` pour audit.

---

*Dernière mise à jour: 11 Décembre 2025*
