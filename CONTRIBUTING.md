# Contribution au nom du projet

Chers collègues, je tiens tout d'abord à vous remercier pour la contribution au nom du projet et à sa conception.

**Code de conduite** 

En participant à ce projet vous acceptez notre [code de conduite].

**Sommaire**

1. [Processus de pull request](#-processus-de-pull-request-pr)
2. [Messages de commit](#messages-de-commit)
3. [Pull  requests](#3-pull-requests)
4. [Revue de code](#4-revue-de-code)
5. [Définition du terminé](#5-définition-du--terminé-)
6. [Conventions de code](#6-conventions-de-code)
7. [Normes de qualité](#7-normes-de-qualité-et-design)

## 1. 🚀 Workflow Git

Nous suivons Gitflow (voir ADR 001) :

| Branche | Rôle |
|---|---|
| `main` | Version stable. Branche protégée : aucun push direct |
| `dev` | Branche de développement, où sont intégrées les fonctionnalités terminées |
| `feature/...`, `fix/...`, etc. | Branches de travail, créées à partir de `dev` |

**Nommage des branches**
Format : `type/short-description`, en anglais et en kebab-case.


| Type | Usage | Exemple |
|---|---|---|
| `feature/` | Nouvelle fonctionnalité | `feature/appointment-form` |
| `fix/` | Correction de bug | `fix/date-format` |
| `hotfix/` | Correction urgente sur `main` | `hotfix/login-crash` |
| `docs/` | Documentation uniquement | `docs/api-readme` |
| `refactor/` | Réorganisation du code sans changement de comportement | `refactor/appointment-service` |
| `chore/` | Configuration, outillage, dépendances | `chore/eslint-config` |


## 2. 📢 Messages de commit

Nous suivons la convention **Conventional Commits**, en anglais.

### Format

```
type: short description
```

Une portée (*scope*) facultative peut préciser la partie du projet concernée :

```
type(scope): short description
```

### Types

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `style` | Mise en forme sans changement de logique (espaces, points-virgules…) |
| `refactor` | Réorganisation du code sans changement de comportement |
| `test` | Ajout ou modification de tests |
| `chore` | Configuration, outillage, dépendances |

### Règles
- Description en anglais, à l'impératif : `add`, pas `added` ni `adds`
- Description en minuscules, sans point final
- 72 caractères maximum
- Un commit = une modification cohérente

### Exemples

```
feat: add appointment form
feat(back): add overload alert to appointment service
fix: correct timezone in appointment dates
docs: fix ADR numbering and file names
test: add tests for log entry service
chore: add eslint and prettier config
```

## 3. 👨‍💻 Pull requests

### Règles
- Toute modification passe par une pull request vers `dev`
- La pull request est rédigée à partir du template commun
- Au moins **un relecteur**. L'auteur peut en solliciter plusieurs s'il le juge utile
- La relecture se fait **sous 24 h**
- C'est **le relecteur** qui merge la pull request après l'avoir approuvée (merge classique)
- Après le merge, la branche de travail est supprimée
- Le ticket Linear passe en « In review » à l'ouverture de la pull request

La branche `dev` n'est pas protégée techniquement : le respect de ces règles repose sur chacun. On ne pousse jamais directement sur `dev`.

### Template
Le fichier `.github/pull_request_template.md` pré-remplit automatiquement chaque pull request :

```markdown
## Ce que fait cette PR

## Ticket Linear

## Comment tester

## Captures d'écran (si front)

## Checklist
- [ ] Les tests passent
- [ ] Le lint ne remonte pas d'erreur
- [ ] La documentation est à jour si nécessaire
```

## 4. 👩‍💻 Revue de code

### Ce que vérifie le relecteur
- La pull request fait ce qu'annonce le ticket
- Le code respecte l'architecture (voir les ADR front et back) : pas de requête SQL dans un contrôleur, pas d'appel à l'API dans un composant d'affichage, etc.
- Les conventions de nommage sont respectées
- Les tests et les fichiers `.http` sont présents et passent
- Le code est compréhensible : noms explicites, commentaires utiles

### Bonnes pratiques
- Commenter le code, pas la personne
- Formuler ses remarques comme des questions ou des suggestions : « Est-ce qu'on pourrait extraire cette logique dans le service ? »
- Distinguer ce qui est bloquant de ce qui est une simple suggestion
- En cas de désaccord, en discuter de vive voix ou sur Discord

---

## 5. ☑️ Définition du « terminé »

Une tâche passe en **Done** dans Linear lorsque :
- la pull request est relue, approuvée et mergée dans `dev`
- le lint ne remonte aucune erreur
- les tests passent

---

## 6. 👨‍💻 Conventions de code

### Langue
- Code et commentaires : **anglais**
- Documentation (README, ADR, CONTRIBUTING) : **français**

### Nommage

| Élément | Convention | Exemple |
|---|---|---|
| Variables, fonctions | camelCase | `appointmentList`, `getUserById` |
| Booléens | préfixe `is` / `has` | `isRecurring`, `hasAccess` |
| Constantes globales | UPPER_SNAKE_CASE | `MAX_DAILY_APPOINTMENTS` |
| Composants React (et leur fichier) | PascalCase | `AppointmentCard.jsx` |
| Hooks | `use` + camelCase | `useAppointments.js` |
| Fichiers du back | `name.layer.js`, en kebab-case | `log-entry.controller.js`, `appointment.service.js` |
| Autres fichiers et dossiers | kebab-case | `date-utils.js`, `user-roles/` |
| Tables et colonnes SQL | snake_case, tables au pluriel | `appointments`, `created_at`, `user_id` |
| Routes de l'API | kebab-case, noms au pluriel | `/api/appointments`, `/api/log-entries` |
| Variables d'environnement | UPPER_SNAKE_CASE | `DATABASE_URL` |

### ESLint et Prettier
La configuration est commune et enregistrée dans le dépôt : `eslint.config.js`, `.prettierrc`, `.prettierignore` et `.vscode/settings.json`. On ne la modifie pas sans en parler à l'équipe.

- **Prettier** reformate automatiquement chaque fichier à la sauvegarde dans VS Code
- **ESLint** souligne les erreurs en direct dans VS Code
- Avant d'ouvrir une pull request, lancer dans le terminal :

```bash
npm run lint
npm run format
```

---

## 7. 🎨 Normes de qualité et design

Pour garantir la cohérence du site web, veillez à respecter les critères suivants :

**👁️ Responsive Design & UI**
- Toute nouvelle interface doit être **Mobile-First** et s'adapter parfaitement à toutes les tailles d'écrans.
- Respectez la palette de couleurs et les espacements définis dans les fichiers CSS globaux / composants (Design System).

**♿ Accessibilité (a11y)**
- Utilisez des balises HTML5 sémantiques (`<main>`, `<nav>`, `<article>`, `<button>`).
- Assurez-vous que toutes les images ont un attribut `alt` descriptif pertinent.
- Veillez à ce que le contraste des textes reste lisible (normes WCAG AA).

## Commandes utiles

| Commande | Effet |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run lint` | Affiche les erreurs ESLint |
| `npm run format` | Reformate les fichiers avec Prettier |
| `npm run test` | Lance les tests Vitest |

---

Un mainteneur du projet viendra relire votre code (Code Review) pour valider l'intégration ou vous proposer de légères modifications.

**Merci encore pour votre aide !** ❤️