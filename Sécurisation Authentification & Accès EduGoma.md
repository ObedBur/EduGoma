# EPIC — Sécurisation de l'authentification et des accès EduGoma

## Issue 1 — Sécuriser les secrets JWT et la configuration sensible

### 🎯 Objectif

Empêcher EduGoma de fonctionner en production avec des secrets JWT absents, faibles ou définis avec des valeurs par défaut.

### 🛠️ Travail demandé

* Identifier tous les secrets utilisés par l'authentification.
* Supprimer les valeurs par défaut telles que `change_me`.
* Charger les secrets uniquement depuis les variables d'environnement.
* Ajouter une validation de configuration au démarrage.
* Refuser le démarrage en production si :

  * un secret obligatoire est absent ;
  * un secret utilise une valeur par défaut connue ;
  * un secret est manifestement trop faible.
* Vérifier qu'aucun secret réel n'est présent dans Git ou dans le code source.

### ✅ Critères d'acceptation

* [ ] Aucun secret par défaut en production.
* [ ] Secrets JWT uniquement via variables d'environnement.
* [ ] Démarrage refusé avec une configuration invalide.
* [ ] Démarrage autorisé avec une configuration valide.
* [ ] Aucun secret réel commité.
* [ ] Tests de configuration ajoutés.

### 🚫 Hors périmètre

Rate limiting, lockout, CAPTCHA, OTP, MFA et password reset.

---

# Issue 2 — Sécuriser HTTPS, cookies et HSTS en production

### 🎯 Objectif

Garantir que les informations d'authentification transitent uniquement dans des conditions sécurisées.

### 🛠️ Travail demandé

* Vérifier la configuration HTTPS de production.
* Vérifier les cookies d'authentification.
* En production :

  * `HttpOnly: true`
  * `Secure: true`
  * `SameSite` explicitement configuré.
* Vérifier le `Path` des cookies.
* Ajouter HSTS lorsque HTTPS est correctement actif.
* Vérifier que les tokens d'authentification ne sont pas exposés au JavaScript.

### ✅ Critères d'acceptation

* [ ] Cookies d'authentification `HttpOnly`.
* [ ] Cookies d'authentification `Secure` en production.
* [ ] `SameSite` explicitement configuré.
* [ ] HTTPS utilisé en production.
* [ ] HSTS activé dans la configuration appropriée.
* [ ] Aucun refresh token dans `localStorage`.
* [ ] Login / refresh / logout fonctionnent après modification.
* [ ] Tests ajoutés ou mis à jour.

### 🚫 Hors périmètre

Rate limiting et lockout.

---

# Issue 3 — Ajouter un rate limiting dédié à Login et Register

### 🎯 Objectif

Empêcher les tentatives automatisées massives sur les endpoints d'authentification.

### 🔎 Problème

Le throttler global existe, mais l'audit indique qu'il n'est pas correctement appliqué à :

* `/auth/login`
* `/auth/register`

### 🛠️ Travail demandé

* Ajouter un throttling spécifique à `/auth/login`.
* Ajouter un throttling spécifique à `/auth/register`.
* Définir des limites adaptées à chaque endpoint.
* Vérifier le comportement lorsque la limite est dépassée.
* Conserver le throttling global comme couche supplémentaire.

### ✅ Critères d'acceptation

* [ ] `/auth/login` est protégé.
* [ ] `/auth/register` est protégé.
* [ ] Une série de requêtes excessives est bloquée.
* [ ] La limite est configurable.
* [ ] La réponse de dépassement est cohérente.
* [ ] Tests automatisés ajoutés.
* [ ] Aucun impact sur une utilisation normale.

---

# Issue 4 — Implémenter le verrouillage temporaire après échecs de connexion

### 🎯 Objectif

Ajouter une protection contre le brute-force ciblant un compte particulier.

### 🛠️ Travail demandé

* Compter les échecs de connexion.
* Définir un seuil configurable.
* Après plusieurs échecs consécutifs :

  * verrouiller temporairement le compte ;
  * empêcher de nouvelles tentatives pendant une durée définie.
* Réinitialiser le compteur après authentification réussie.
* Éviter un verrouillage permanent.
* Éviter qu'un attaquant puisse facilement utiliser cette fonctionnalité pour bloquer les comptes d'autres utilisateurs.
* Enregistrer les événements de verrouillage dans l'audit.

### ✅ Critères d'acceptation

* [ ] Les échecs sont comptabilisés.
* [ ] Le seuil est configurable.
* [ ] Le verrouillage est temporaire.
* [ ] Le compte peut se reconnecter après expiration du verrouillage.
* [ ] Une connexion réussie réinitialise le compteur.
* [ ] L'événement est journalisé.
* [ ] Les réponses ne permettent pas de révéler inutilement l'état du compte.
* [ ] Tests de brute-force et de déverrouillage ajoutés.

---

# Issue 5 — Sécuriser complètement l'OTP de vérification du téléphone

### 🎯 Objectif

Protéger le processus `/tenants/verify-phone` contre les attaques par devinette et l'utilisation prolongée d'un code.

### 🔎 Problèmes constatés

L'audit indique :

* absence d'expiration du code ;
* absence de nombre maximal de tentatives ;
* absence de rate limiting.

### 🛠️ Travail demandé

* Ajouter une durée d'expiration à chaque OTP.
* Limiter le nombre de tentatives.
* Ajouter un rate limiting sur la vérification.
* Invalider l'OTP après utilisation réussie.
* Empêcher la réutilisation d'un OTP.
* Ne jamais stocker le code OTP en clair si l'architecture permet son hashage.
* Sécuriser également le renvoi d'un nouveau code.

### ✅ Critères d'acceptation

* [ ] OTP expiré → refusé.
* [ ] Nombre maximal de tentatives respecté.
* [ ] OTP valide → vérification réussie.
* [ ] OTP utilisé une seconde fois → refusé.
* [ ] Trop de requêtes → rate limit.
* [ ] Renvoi OTP protégé contre l'abus.
* [ ] Tests expiration / tentatives / réutilisation ajoutés.

---

# Issue 6 — Corriger les fuites d'énumération des comptes et des écoles

### 🎯 Objectif

Empêcher un utilisateur non autorisé de déterminer facilement si un compte ou une école existe.

### 🔎 Problèmes constatés

L'audit indique des fuites sur :

* `/auth/register`
* `/tenants/*`

Alors que `/auth/login` possède déjà une réponse générique.

### 🛠️ Travail demandé

* Identifier toutes les réponses révélant l'existence d'un compte.
* Identifier les endpoints permettant de déterminer l'existence d'une école.
* Uniformiser les réponses lorsque cela est pertinent.
* Ne pas retourner inutilement :

  * `User already exists`
  * `Tenant already exists`
  * informations permettant de distinguer directement les cas.
* Vérifier que les modifications ne dégradent pas l'expérience normale d'inscription.

### ✅ Critères d'acceptation

* [ ] `/auth/register` ne révèle plus inutilement l'existence d'un compte.
* [ ] Les endpoints `tenants` concernés ne révèlent plus inutilement l'existence d'une école.
* [ ] `/auth/login` conserve son comportement générique.
* [ ] Tests d'énumération ajoutés.
* [ ] Les réponses restent fonctionnelles pour les utilisateurs légitimes.

---

# Issue 7 — Implémenter Forgot Password, Reset Password et Change Password

### 🎯 Objectif

Mettre en place un cycle complet et sécurisé de récupération et modification du mot de passe.

### 🛠️ Travail demandé

Créer les flux nécessaires :

```text
Forgot Password
      ↓
Reset Token
      ↓
Reset Password
```

Et :

```text
Utilisateur connecté
      ↓
Change Password
```

### Exigences

* Token de récupération aléatoire et difficile à deviner.
* Token à usage unique.
* Expiration du token.
* Hash du token côté serveur lorsque pertinent.
* Réponse générique sur `forgot-password`.
* Révocation des sessions/refresh tokens après reset.
* Vérification de l'ancien mot de passe pour `change-password`.
* Réutilisation de l'ancien token interdite.
* Rate limiting des endpoints sensibles.

### ✅ Critères d'acceptation

* [ ] `forgot-password` fonctionne.
* [ ] `reset-password` fonctionne.
* [ ] `change-password` fonctionne.
* [ ] Token expiré → refusé.
* [ ] Token utilisé → inutilisable une seconde fois.
* [ ] Reset → sessions existantes correctement invalidées.
* [ ] Aucun mot de passe ou token sensible dans les logs.
* [ ] Tests complets ajoutés.

---

# Issue 8 — Compléter les Audit Logs des actions sensibles

### 🎯 Objectif

Permettre de savoir précisément **qui a effectué quelle action, sur quelle ressource et quand**.

### 🔎 État actuel

`AuditService` couvre déjà une partie de l'authentification, mais plusieurs actions importantes liées aux tenants et à l'administration manquent.

### 🛠️ Travail demandé

Ajouter des événements pour :

#### Écoles

* création ;
* modification ;
* approbation ;
* désactivation ;
* réactivation.

#### Utilisateurs

* création ;
* modification ;
* désactivation ;
* suppression si applicable.

#### Rôles et permissions

* attribution d'un rôle ;
* modification d'un rôle ;
* ajout/retrait de permission.

#### Système

* modification des paramètres sensibles ;
* actions importantes du Super-Admin.

### Informations à enregistrer

* acteur ;
* action ;
* type de ressource ;
* identifiant de la ressource ;
* date/heure ;
* IP lorsque disponible ;
* User-Agent lorsque pertinent ;
* métadonnées utiles.

### 🚫 Ne jamais enregistrer

* mots de passe ;
* OTP en clair ;
* refresh tokens ;
* secrets JWT ;
* autres données d'authentification sensibles.

### ✅ Critères d'acceptation

* [ ] Les actions sensibles sont persistées.
* [ ] Chaque événement possède un acteur.
* [ ] Chaque événement possède une date/heure.
* [ ] La ressource ciblée est identifiable.
* [ ] Les données sensibles ne sont jamais enregistrées.
* [ ] Les logs ne peuvent pas être modifiés par un utilisateur ordinaire.
* [ ] Tests ajoutés.

---

# Issue 9 — Implémenter une authentification MFA pour les comptes privilégiés

### 🎯 Objectif

Ajouter une deuxième étape d'authentification pour les comptes ayant des privilèges élevés.

### 🎯 Périmètre initial

Priorité aux :

* `SUPER_ADMIN`
* comptes administrateurs ayant accès aux fonctions sensibles.

Le mécanisme exact devra être choisi avant implémentation.

Options possibles :

* TOTP avec application d'authentification ;
* passkeys/WebAuthn ;
* autre mécanisme MFA approprié.

### 🛠️ Travail demandé

* Activation du MFA.
* Enrôlement sécurisé.
* Vérification MFA lors de la connexion.
* Stockage sécurisé des secrets.
* Codes de récupération si nécessaire.
* Protection de la désactivation du MFA.
* Journalisation des événements MFA.

### ✅ Critères d'acceptation

* [ ] Un Super-Admin peut activer le MFA.
* [ ] Le MFA est demandé lors des connexions concernées.
* [ ] Un code incorrect est refusé.
* [ ] La désactivation est protégée.
* [ ] Les secrets MFA ne sont pas exposés.
* [ ] Les événements sont auditables.
* [ ] Tests d'activation / connexion / désactivation ajoutés.

### 🚫 Important

L'OTP utilisé pour vérifier le téléphone d'une école n'est **pas** considéré comme du MFA de connexion.

---

# Issue 10 — Ajouter une protection CAPTCHA adaptative contre les abus

### 🎯 Objectif

Ajouter une protection supplémentaire contre les bots uniquement lorsqu'un comportement suspect est détecté.

### 🛠️ Principe

Ne pas imposer un CAPTCHA à chaque utilisateur.

Le CAPTCHA peut être déclenché après :

* plusieurs échecs de connexion ;
* comportement automatisé ;
* nombre anormal de requêtes ;
* tentatives répétées sur une même adresse IP ;
* autres signaux d'abus définis par le système.

### Endpoints potentiels

* `/auth/login`
* `/auth/register`
* `/auth/forgot-password`
* autres endpoints publics si nécessaire.

### Exigences

* Validation du CAPTCHA côté backend.
* Secret du fournisseur uniquement côté serveur.
* Ne jamais considérer une validation frontend comme suffisante.
* Intégration avec le rate limiting existant.
* Éviter d'imposer inutilement le CAPTCHA aux écoles utilisant normalement EduGoma.

### ✅ Critères d'acceptation

* [ ] CAPTCHA déclenché uniquement lorsque les règles l'exigent.
* [ ] Validation effectuée côté backend.
* [ ] Secret fournisseur absent du frontend.
* [ ] Un CAPTCHA invalide bloque la requête.
* [ ] Un comportement normal n'est pas inutilement interrompu.
* [ ] Tests d'intégration ajoutés.
* [ ] Le CAPTCHA peut être activé/désactivé via configuration.

---

# 🔄 Ordre d'implémentation recommandé

```text
01  Secrets JWT / configuration
 ↓
02  HTTPS / Secure Cookie / HSTS
 ↓
03  Rate limiting Login / Register
 ↓
04  Account Lockout
 ↓
05  OTP Verify Phone
 ↓
06  Anti-enumeration
 ↓
07  Forgot / Reset / Change Password
 ↓
08  Audit Logs
 ↓
09  MFA
 ↓
10  CAPTCHA adaptatif
```

# 🧪 Definition of Done globale

Une issue de sécurité est considérée comme terminée lorsque :

* [ ] Le comportement attendu est implémenté.
* [ ] Les tests automatisés correspondants existent.
* [ ] Aucun secret sensible n'est ajouté au repository.
* [ ] Aucun mot de passe, OTP ou token n'apparaît dans les logs.
* [ ] Les endpoints concernés ont été testés avec des requêtes normales et abusives.
* [ ] Aucune régression d'authentification n'est constatée.
* [ ] La documentation de configuration est mise à jour lorsque nécessaire.
* [ ] Les variables d'environnement nécessaires sont documentées sans exposer leurs valeurs.
