# Corrections du dashboard — ordre de mise en œuvre

## Périmètre et limite

Ce plan concerne uniquement /dashboard, son layout, ses composants directs et ses données/API. Les efforts sont estimés à partir de l'analyse du code et classés du plus lourd au plus léger. Aucun correctif applicatif n'a été appliqué.

Le navigateur local n'était pas disponible lors de l'analyse. L'apparence réelle, les erreurs console et les comportements avec les données réelles restent à confirmer dans le navigateur.

## Étape 1 — Travaux lourds : fiabiliser les données et leurs contrats

### 1. Séparer les chargements et les erreurs par section — lourd

Fichiers : client/src/hooks/use-dashboard.ts, client/src/app/(dashboard)/dashboard/page.tsx.

Le hook lance neuf appels dans un Promise.all. Une seule requête en échec empêche l'enregistrement des autres résultats. L'erreur est montrée uniquement dans la vue « Métiers & Écoles » ; l'onglet infrastructure peut alors afficher des valeurs par défaut comme si elles étaient réelles.

Correction : traiter chaque requête séparément (par exemple avec Promise.allSettled) et conserver un état chargement/erreur par section. Afficher « Données indisponibles » au lieu de zéros en cas d'échec et ajouter une action Réessayer. Ne pas calculer de statut santé à partir de données absentes.

### 2. Remplacer l'estimation de stockage par une mesure correcte — lourd

Fichiers : client/src/app/(dashboard)/dashboard/page.tsx, server/src/stats/stats.service.ts, client/src/lib/api.ts.

La carte parle de documents scolaires et d'un quota de 500 Go, alors que le serveur estime le volume à partir du nombre de journaux d'accès. La note décrivant l'estimation n'est pas affichée.

Correction : calculer le volume depuis le stockage réel et lire le quota de sa source de vérité. Si ces données n'existent pas, renommer la métrique pour décrire l'estimation, afficher sa méthode, ou masquer la carte. Ne pas présenter 500 Go comme une limite réelle sans confirmation.

### 3. Corriger la signification et l'échelle des séries du graphique — lourd à moyen

Fichiers : client/src/app/(dashboard)/dashboard/page.tsx, server/src/stats/stats.service.ts.

La série écoles compte les écoles créées durant les six derniers mois sans filtrer leur statut, alors que la légende dit « Écoles partenaires actives ». La seconde série compte les demandes de démo converties, mais l'axe droit est en milliers et a un plancher de 10k qui peut aplatir les faibles volumes. En l'absence de données, le graphique dessine des zéros et affiche M1 à M6, interprétables comme de vraies mesures.

Correction : aligner les données et les libellés (filtrer les écoles actives ou nommer la série « écoles créées »), nommer les conversions selon leur véritable unité et adapter l'échelle aux valeurs. Afficher « Aucune donnée » plutôt qu'une série artificielle à zéro.

### 4. Aligner les types client sur les réponses serveur — moyen

Fichiers : client/src/lib/api.ts, server/src/stats/stats.service.ts.

Des métriques déclarées comme nombres obligatoires peuvent être nulles sans données. Le champ months est déclaré numérique côté client, mais le serveur retourne une liste de libellés.

Correction : refléter les réponses réelles dans les types (par exemple number | null et string[]) et valider ou partager le schéma entre client et serveur. Garder un état d'absence de donnée explicite dans l'interface.

## Étape 2 — Travaux moyens : réduire les requêtes et clarifier l'actualisation

### 5. Éviter les requêtes d'alertes en double — moyen

Fichiers : client/src/hooks/use-dashboard.ts, client/src/components/layout/DashboardShared.tsx.

Le hook demande cinq alertes ; la barre supérieure en demande huit au montage, puis les recharge à chaque ouverture des notifications. Le compteur et la liste peuvent différer, avec des appels réseau redondants.

Correction : partager une source d'état/cache unique et choisir une limite cohérente. Si le chargement se fait à l'ouverture du menu, conserver la réponse en cache pendant une durée courte.

### 6. Faire correspondre « Direct » à une vraie actualisation — moyen

Fichier : client/src/app/(dashboard)/dashboard/page.tsx.

Le journal d'activité est chargé au montage seulement, malgré l'indicateur « Direct ».

Correction : remplacer l'indicateur par « Dernière mise à jour à … », ou implémenter une actualisation périodique/temps réel. Arrêter le timer au démontage et éviter les appels qui se chevauchent.

### 7. Ne récupérer qu'un compteur pour les écoles en attente — moyen à léger

Fichiers : client/src/hooks/use-dashboard.ts, client/src/lib/api.ts, server/src/modules/tenant/admin-tenant.controller.ts.

Le dashboard télécharge la liste des écoles en attente et n'en utilise que le nombre d'éléments.

Correction : ajouter un endpoint de comptage ou inclure ce nombre dans le résumé du dashboard. Réserver le téléchargement de la liste complète à l'écran qui l'affiche.

### 8. Supprimer l'appel de statistiques de tickets inutilisé — léger

Fichiers : client/src/hooks/use-dashboard.ts, client/src/lib/api.ts.

ticketsApi.getStats() est appelé et stocké dans ticketStats, mais la page ne lit jamais cette valeur.

Correction : supprimer l'appel, l'état et la valeur retournée s'il n'y a pas de métrique correspondante à afficher.

## Étape 3 — Travaux légers : corriger les états visuels et l'accessibilité

### 9. Aligner les couleurs du statut santé — léger

Fichier : client/src/app/(dashboard)/dashboard/page.tsx.

Dans le panneau infrastructure, le fond et le point de statut restent verts même si l'état est dégradé ; seul le texte change.

Correction : piloter fond, texte et indicateur à partir du même état. Ajouter un état « Inconnu » quand aucune réponse santé n'est disponible.

### 10. Exposer correctement l'état des onglets — léger

Fichier : client/src/app/(dashboard)/dashboard/page.tsx.

Les boutons d'onglet indiquent la sélection visuellement seulement, sans sémantique de tabulation ni aria-selected.

Correction : implémenter tablist/tab/tabpanel avec aria-selected, aria-controls et gestion clavier. Si ces contrôles sont plutôt des boutons de filtre, utiliser aria-pressed.

### 11. Fournir une alternative accessible au graphique — léger

Fichier : client/src/app/(dashboard)/dashboard/page.tsx.

Les valeurs du SVG n'ont pas d'équivalent textuel accessible.

Correction : ajouter titre et description accessibles au SVG ainsi qu'un résumé ou tableau des périodes et des valeurs. Vérifier la lisibilité des libellés sur écran étroit.

### 12. Améliorer la taille des textes — léger

Fichiers : client/src/app/(dashboard)/dashboard/page.tsx, client/src/components/layout/DashboardShared.tsx.

Certains textes et badges font 7 à 10 px, ce qui peut les rendre difficiles à lire, notamment sur mobile.

Correction : agrandir les textes secondaires et badges, vérifier le contraste et contrôler l'affichage sur téléphone.

## Vérifications après implémentation

Le navigateur local n'était pas disponible lors de l'analyse ; ces contrôles restent à effectuer :

1. Toutes les API réussissent, puis échec isolé des alertes et de l'API santé.
2. Listes vides avec compteurs réellement égaux à zéro.
3. Graphique avec peu de conversions, puis avec plus de mille.
4. Santé en healthy, degraded et indisponible.
5. Navigation au clavier et affichage sur mobile étroit.
6. Export CSV et ouverture dans un tableur.

## Fichiers concernés

- client/src/app/(dashboard)/dashboard/page.tsx
- client/src/app/(dashboard)/layout.tsx
- client/src/app/(dashboard)/dashboard/loading.tsx
- client/src/hooks/use-dashboard.ts
- client/src/components/layout/DashboardShared.tsx
- client/src/components/skeletons/DashboardPageSkeleton.tsx
- client/src/lib/api.ts
- server/src/stats/stats.controller.ts et server/src/stats/stats.service.ts
- Contrôleurs et services des modules alert, ticket, health et tenant directement appelés par le dashboard.
