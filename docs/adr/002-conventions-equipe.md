# ADR 002 - Conventions d'équipe

Date : 2026-11-02  
Statut : Accepté

## Contexte
L'équipe de Vi'Assist compte 4 personnes. Le projet s'inscrit dans une formation de 14 semaines et n'est pas encore en production.

Le jeudi est consacré à la spécialisation de chacun, et le vendredi se déroule en distanciel. Chaque membre développe une fonctionnalité de A à Z (du front jusqu'à la base de données), en parallèle des autres.

Sans règles communes, ce fonctionnement expose à des conflits Git, des incohérences de style et de nommage, des relectures difficiles et une perte d'information entre les membres.

Le workflow Git (Gitflow, avec une branche `dev` et une branche `main`) a été décidé dans l'[ADR 001](./001-choix-du-workflow-git.md). Cet ADR fixe les conventions de travail qui le complètent. Le détail des règles (formats, exemples, template de pull request) est décrit dans le fichier [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

## Options considérées

### Méthode de travail
1. Scrum allégé : sprints courts, avec planification, daily et rétrospective.
2. Kanban continu : flux de tâches sans itérations, plus souple mais sans point d'étape régulier.

### Outil de suivi des tâches
1. Linear : outil de suivi de tickets rapide et épuré, de plus en plus adopté par les équipes tech, avec une intégration GitHub.
2. GitHub Projects : intégré directement au dépôt, mais moins pensé pour le suivi de sprints.
3. Notion : très flexible, mais généraliste : le tableau et le workflow sont entièrement à construire.

### Messages de commit
1. Conventional Commits : format normalisé (`type: description`), lisible et exploitable par des outils.
2. Messages libres : aucune contrainte, mais un historique hétérogène et difficile à parcourir.

### Revue de code
1. Pas de revue : intégration plus rapide, mais aucune vérification avant le merge.
2. Un relecteur minimum : contrôle systématique sans bloquer l'équipe.
3. Deux relecteurs obligatoires : contrôle renforcé, mais délais plus longs pour une équipe de 4 où chacun porte sa fonctionnalité.

### Qualité et mise en forme du code
1. ESLint et Prettier avec une configuration commune : erreurs détectées et mise en forme uniformisée automatiquement.
2. Relecture manuelle seule : rien à configurer, mais tout repose sur la vigilance de chacun, et les pull requests mélangent changements de fond et différences de mise en forme.

### Définition du « terminé »
Une tâche passe en Done dans Linear lorsque :
1. Minimale : la pull request est relue, approuvée et mergée dans `dev`.
2. Intermédiaire : option 1, et le lint ne remonte aucune erreur, et les tests passent.
3. Complète : option 2, et la documentation est mise à jour si nécessaire (README, Swagger).

### Niveau de tests
Les outils sont Vitest pour les tests automatisés et REST Client pour les tests manuels de l'API.
1. Tests Vitest sur les services du back uniquement, REST Client utilisé librement pour vérifier les routes.
2. Option 1, et un fichier REST Client (`.http`) versionné par ressource de l'API, couvrant les cas nominaux et les cas d'erreur.
3. Option 2, et des tests Vitest sur les principaux composants du front (avec React Testing Library).

## Décision

### Organisation du travail
- Sprints d'une semaine :
  - lundi matin : planification du sprint
  - daily chaque matin, sauf le jeudi (journée de spécialisation)
  - vendredi, sur Discord : démo, rétrospective et merge de `dev` vers `main`
- Suivi des tâches dans Linear, avec les colonnes To do, In progress, In review et Done
- Chaque membre se positionne lui-même sur les tickets
- Communication en présentiel sur site, et sur Discord à distance

### Git
- Branches nommées en anglais, en kebab-case, préfixées par leur type : `feature/appointment-form`, `fix/date-format`
- Commits au format Conventional Commits, en anglais
- Intégration des branches dans `dev` par merge classique
- Merge de `dev` vers `main` en fin de sprint, avec toute l'équipe réunie sur Discord
- Seule la branche `main` est protégée

### Revue de code
- Toute modification passe par une pull request vers `dev`, rédigée à partir d'un template commun
- Au moins un relecteur ; l'auteur peut en solliciter plusieurs
- Relecture sous 24 h
- Le relecteur merge la pull request après l'avoir approuvée

### Code
- Code et commentaires en anglais, documentation (README, ADR, CONTRIBUTING) en français
- Conventions de nommage standard de chaque technologie : camelCase en JavaScript, PascalCase pour les composants React, kebab-case pour les fichiers et dossiers, snake_case en SQL (détail dans le [`CONTRIBUTING.md`](../../CONTRIBUTING.md)).
- ESLint et Prettier, avec une configuration commune enregistrée dans le dépôt

### Définition du « terminé »
Une tâche passe en Done dans Linear lorsque :
- la pull request est relue, approuvée et mergée dans `dev`
- le lint ne remonte aucune erreur
- les tests passent

### Tests
- Tests automatisés avec Vitest sur les services du back
- Un fichier REST Client (`.http`) versionné par ressource de l'API, couvrant les cas nominaux et les cas d'erreur

## Conséquences

### Avantages
- Rythme hebdomadaire aligné sur les livrables de la formation, avec des points d'étape réguliers pour ajuster l'organisation
- Avancement de chacun visible dans Linear, ce qui est précieux avec un développement en parallèle
- Historique Git lisible grâce aux branches typées et à Conventional Commits
- Chaque modification est relue par au moins un autre membre : erreurs repérées plus tôt et connaissances partagées
- Code homogène quel que soit son auteur, et pull requests centrées sur le fond grâce à Prettier
- Prise en main facilitée pour un tiers : code en anglais, documentation en français pour l'équipe pédagogique et le jury
- Les routes de l’API sont documentées et testables par tous grâce aux fichiers `.http`

### Inconvénients
- Les rituels prennent du temps sur un planning déjà court
- La branche `dev` n'étant pas protégée, la règle de relecture repose sur la discipline de l'équipe et non sur un blocage technique
- Le délai de relecture de 24 h peut ralentir l'intégration, notamment autour du jeudi consacré à la spécialisation
- Le merge de fin de sprint se fait à distance : la résolution d'éventuels conflits est moins simple qu'en présentiel
- La configuration initiale d'ESLint et de Prettier est à prévoir, ainsi qu'un temps d'adaptation à Conventional Commits
- Linear est un outil supplémentaire à prendre en main, séparé du dépôt GitHub
- L’écriture des tests et des fichiers `.http` demande du temps à chaque fonctionnalité
