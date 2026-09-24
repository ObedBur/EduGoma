# Plan d'améliorations — Dashboard « Vue d'ensemble »

Page concernée : `http://localhost:3000/dashboard`
Fichiers principaux : `client/src/app/(dashboard)/dashboard/page.tsx`, hook `useDashboard`, `client/src/components/layout/DashboardShared.tsx`
Créé le 2026-09-23 — méthode : **un lot à la fois**, validation visuelle après chaque lot, `npx tsc --noEmit` obligatoire en fin de lot.

---

## Lot 1 — Données & libellés (crédibilité de la page)

- [x] 1.1 **Une seule source de vérité pour « Dossiers en attente »** : le KPI (page.tsx ~767) lit `summary.pendingDossiers.count` (0) alors que la page Écoles affiche 5 via `counts.pending` de l'API tenants. Brancher le KPI sur `counts.pending` (ou aligner le serveur).
  *Critère d'acceptation : même nombre sur /dashboard et /dashboard/schools.*
- [x] 1.2 **Supprimer les métriques fantômes** : « Validation : — », « Conversion : — », « Taux de complétude : — » + barre vide. Masquer le bloc si la valeur n'est pas calculable (rendu conditionnel), jamais de « — ».
- [x] 1.3 **Sémantique des trends** : masquer le chip si la base < 5 ou si la variation = 0 ; « 0 % » en neutre (gris), vert réservé aux variations positives significatives ; retirer « +400 % » sur base 4 et « +7 » à côté de 3.
- [x] 1.4 **Journal d'activité en français** : mapper les enums bruts (`SUBSCRIPTION_MARKED_PAID`, scopes `PAYMENT` / `TENANT` / `action`, ActivityPanel ~247) vers des phrases : « Paiement de l'abonnement enregistré », « Accès école activé », « Connexion réussie ».
- [x] 1.5 **Sévérités en français et un seul système de badges** : tags `CRITICAL / WARNING / INFO` des alertes → `Critique / Avertissement / Info` (le mapping existe déjà page.tsx ~82) ; harmoniser avec les tickets (`CRITIQUE / FAIBLE / NORMAL`) : même forme, même langue, pastille couleur cohérente.
- [x] 1.6 **Statut de service unique** : counts des onglets libellés (« 3 alertes », « 7 services ») ou supprimés ; pill « Service : Opérationnel » conservée seule en top-right.

## Lot 2 — Graphique & typographie

- [x] 2.1 **Graphique assaini** : un seul axe Y (supprimer l'axe droit 0k–10k mort) ; légende = noms de séries (« Écoles partenaires actives », « Démos converties ») au lieu d'une conclusion ; titre court « Croissance du parc écoles », plage de dates en sous-titre.
- [x] 2.2 **Courbe lisible** : points marqués + tooltip au survol ; dernier label d'axe sans gras injustifié.
- [x] 2.3 **Bouton « Exporter le rapport »** en ghost button aligné sur le titre de carte.
- [x] 2.4 **Échelle typographique** : corps 12 px, métadonnées 11 px minimum (aujourd'hui 8–10 px partout) ; capitales réservées aux eyebrows de section.
- [x] 2.5 **Tickets lisibles** : métadonnées sur 2 lignes à 10–11 px au lieu d'une ligne tronquée à 8 px ; priorité et statut visuellement séparés.

## Lot 3 — Grille & densité

- [x] 3.1 **Rangée du bas restructurée** : 3 cartes stats à hauteur fixe compacte (supprimer le vide central) ; panneau tickets déplacé en colonne droite sous le journal ou pleine largeur dessous.
- [x] 3.2 **Alertes compactes** : lignes resserrées avec liseré de sévérité à gauche + horodatage ; supprimer les 60 % d'espace vide entre message et tag.
- [x] 3.3 **Footers de cartes nettoyés** : retirer les carrés « — » rose/vert énigmatiques (carte « Délai moyen d'activation »). *(fait avec le lot 1)*

## Lot 4 — Onglet « État du service » (dé-duplication & statut honnête)

Audit du 2026-09-23 : chaque donnée y était affichée 2 à 3 fois (DB, uptime, écoles/utilisateurs, charge avec deux valeurs contradictoires 88,7 % vs 89 %, alertes critiques), statut global « Tout va bien » contredit par ses propres signaux (charge Élevé + alerte critique), barre de charge pleine largeur, tuiles centrées à libellés sur 3 lignes.

- [x] 4.1 **Statut calculé depuis les signaux** : alerte critique → « Dégradé » ; sinon charge ≥ 85 % → « Sous surveillance » ; sinon « Opérationnel ». Pill d'en-tête et bannière alignées sur cet état calculé (fini le « Tout va bien » contredit).
- [x] 4.2 **Carte d'état unique** : en-tête (statut + uptime, sans le pléonasme « sans interruption ») + 4 tuiles compactes alignées à gauche (Base de données, Charge, Écoles, Utilisateurs) — chaque donnée une seule fois.
- [x] 4.3 **Supprimer le bloc « Alertes urgentes » interne** à la carte d'état : doublon de la carte « Alertes priorité » (qui a le liseré, le badge et l'horodatage).
- [x] 4.4 **Supprimer les 4 cartes basses dupliquées** (Vitesse de la base, Charge serveur, Sans interruption, Total) de l'onglet infrastructure.
- [x] 4.5 **Une seule valeur de charge** : `usagePercent` partout (supprime la contradiction 88,7 % vs 89 %) ; jauge contenue dans la tuile (h-1.5) au lieu de la barre pleine largeur.
- [x] 4.6 **Conserver** « Alertes priorité » (style compact du lot 3) et « Écoles sur la plateforme » (seule source de la répartition inscrites/actives/en attente).

---

## Page Écoles — Audit « équipe 10 experts » (2026-09-24)

Page concernée : `http://localhost:3000/dashboard/schools` + tiroir de détail.
Fichiers : `client/src/app/(dashboard)/dashboard/schools/page.tsx`, `client/src/components/ui/list-table.tsx`.
Règle : CLARTÉ → EFFICACITÉ → HIÉRARCHIE → FEEDBACK → ESTHÉTIQUE. Chaque changement doit aider l'admin à gérer les écoles plus vite et avec moins d'erreurs.
Forces préservées : recherche debounce 300 ms, pagination/tri/filtres côté serveur, badges icône+texte, optimistic UI + rollback, chip « Synchronisé ».

### Lot A — Corrections factuelles & accessibilité

- [x] A.1 **Désync « Par page »** : `DEFAULT_LIST_QUERY.limit = 30` mais options `[10,20,50]` → ajout de 30 (`list-table.tsx`).
- [x] A.2 **`aria-sort`** sur le `<th>` triable (état de tri exposé aux lecteurs d'écran).
- [x] A.3 **Ligne tableau activable au clavier** : `tabIndex`, `Enter`/`Espace`, anneau `focus-visible`.
- [x] A.4 **Tiroir accessible** : `role="dialog"`, `aria-modal`, `aria-labelledby`, focus initial + piège à focus (Tab), fermeture `Échap`, restauration du focus ; effet monté une seule fois via `onCloseRef`.

### Lot B — Typographie & contraste *(à faire)*

- [x] B.1 Remonter l'échelle sous 11 px (thead `8px`, footer/filtres/cellules `9-10px`, tiroir `8-9px`) vers corps 12 px / métadonnées 11 px, aligné sur le dashboard.
- [x] B.2 Contraste WCAG AA : texte secondaire trop clair (`#9aa5af`, `#8a97a4`) → capitales `#5a6b7c` (~5.5:1), secondaire `#64748b` (~4.8:1).
- [x] B.3 Pluralisation « comptes » + libellé honnête « Comptes »/« Effectif » (fin du texte technique « élèves à venir ») (`page.tsx`).

### Lot C — UX tableau & filtres *(à faire)*

- [ ] C.1 KPI cards cliquables → appliquent le filtre correspondant.
- [ ] C.2 Chips de filtres actifs + bouton « Réinitialiser les filtres ».
- [ ] C.3 En-tête de tableau collant (sticky thead).

### Lot D — Motion & responsive *(à faire)*

- [ ] D.1 Slide-in du tiroir ~200 ms + fondu du backdrop.
- [ ] D.2 États `focus-visible` sur les boutons du tiroir.
- [ ] D.3 Ajustements mobile (tiroir pleine largeur, actions hors écran en scroll horizontal).

> Écarté : centralisation des couleurs en design tokens (chantier transverse au-delà de la page Écoles).

---

## Déjà traité (mémoire)

- **Page Écoles** (2026-09-23) : 3 lots livrés — cohérence (CTA/breadcrumb/terminologie/KPI/IDs/colonne Élèves), UX (recherche unique, filtres en selects, pills violettes, chevron, métriques calculées), visuel (H1 28 px, nowrap badges, contraste IDs, chip résultats, carte sidebar dupliquée supprimée).
- Effectifs élèves : colonne retirée faute de donnée serveur ; **reste à faire** : endpoint serveur de comptage élèves par tenant si le besoin revient.

## Rituel de travail

1. Ouvrir le lot, cocher les items au fur et à mesure.
2. `npx tsc --noEmit` dans `client/`.
3. Capture d'écran de la page avant/après pour validation utilisateur.
4. Ne passer au lot suivant qu'après accord.
