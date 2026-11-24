# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Vi'Assist : application web pour les aidants familiaux (agenda partagé, journal de bord, fiche personne, accès selon le rôle). Les données manipulées sont sensibles (santé). Le besoin et le périmètre MoSCoW sont décrits dans `README.md` et `conception/` (user stories, backlog, MCD/MLD, dictionnaire de données).

## Commandes

Monorepo sans package.json racine : lancer chaque commande dans `back/` ou `front/`.

| Dossier | Commande                                  | Effet                                            |
| ------- | ----------------------------------------- | ------------------------------------------------ |
| back    | `npm run dev`                             | API Express sur le port `PORT` (3000, nodemon)   |
| back    | `npm run lint`                            | ESLint                                           |
| back    | `npm run format` / `npm run format:check` | Prettier (écrit / vérifie)                       |
| front   | `npm run dev`                             | Vite ; `/api` est proxifié vers `localhost:3000` |
| front   | `npm run build`                           | Build de production                              |
| front   | `npm run lint`                            | oxlint                                           |

- **Tests** : aucun test automatisé n'existe encore (`npm test` échoue volontairement dans `back/`, et Vitest, cité dans CONTRIBUTING, n'est pas installé). Les tests d'API sont des fichiers `back/test/requetes/*.http` (extension REST Client), une requête par cas avec le code attendu en commentaire. Il faut se connecter d'abord (`auth.http`) : le cookie `token` est réutilisé par les autres requêtes.
- **Base PostgreSQL** : schéma dans `bdd/migrations/NNN-*.sql`, à appliquer dans l'ordre (aucun script npm ne le fait), données de test dans `bdd/seed.sql`, remise à zéro avec `bdd/migration_down.sql`. Une nouvelle migration prend le numéro suivant et s'écrit dans `BEGIN; … COMMIT;`.
- **Environnement** : `back/.env` (gitignoré) d'après `back/.env.exemple` : `PORT` (3000, le proxy Vite l'attend), `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, et `JWT_SECRET` (requis, voir le commentaire dans l'exemple pour le générer). Ne jamais lire ni afficher `back/.env`.

## Architecture back (`back/src`, Express 5, ES modules)

Couches strictes, une ressource = un fichier par couche :
`routes/` → `controllers/` → `services/` → `models/` → `db.js` (Pool `pg`).

- **routes** : chemin + middlewares `auth` puis `exigerRoleSur(ROLES.X, …)` (`middlewares/auth.js`). `auth` lit le JWT (`{ sub }`) dans le cookie httpOnly `token` et remplit `req.personne = { id }`. `exigerRoleSur` lit `:beneficiaireId` dans l'URL, cherche le rôle de la personne chez ce bénéficiaire (table `accompagner`) et remplit `req.acces = { beneficiaireId, role }` ; 404 si elle ne l'accompagne pas, 403 si le rôle n'est pas autorisé. Montées sous `/api/<ressource>` dans `app.js`.
- **Multi-bénéficiaires (ADR 006)** : le rôle n'est pas global, il est porté par le lien personne ↔ bénéficiaire (`accompagner`). Les ressources d'un bénéficiaire sont imbriquées : `/api/beneficiaires/:beneficiaireId/agenda/…`, `/messages`, `/membres` (sous-routeurs en `Router({ mergeParams: true })`). Toute requête sur `evenement` ou `message` filtre par `beneficiaire_id`.
- **Invitations** : un admin n'ajoute pas un membre, il l'**invite** (`accompagner.statut = 'en_attente'`). Une invitation ne donne aucun accès et n'apparaît pas dans la liste des membres tant que la personne ne l'a pas acceptée (`/api/invitations`, sans `exigerRoleSur` : tout est filtré sur `req.personne.id`). L'invitation répond toujours 202 avec le même message, que le mail existe ou non (pas d'énumération des comptes). Toute requête qui donne un accès filtre donc sur `statut = 'accepte'`, `beneficiaire.est_archive` et `personne.est_archive` (voir `trouverRoleDe`).
- **controllers** : validation de la _forme_ des entrées (types, formats, longueurs), normalisation, puis appel du service et réponse HTTP.
- **services** : règles métier (unicité, hash bcrypt, signature JWT).
- **models** : seul endroit où il y a du SQL. Toujours en requêtes paramétrées (`$1`, …). Le JSON est souvent construit directement en SQL (`json_build_object`, `json_agg`) : voir `models/AgendaModels.js`.
- **Erreurs** : lancer `new ErreurHttp(status, message, details)` (`erreurs.js`). Express 5 transmet seul les rejets des handlers `async` au middleware `middlewares/erreurs.js`, qui renvoie `{ message, erreurs }` : pas de try/catch dans les contrôleurs.
- **Rôles** : `constantes/roles.js` (ADMIN 1, INVITE 2, PROCHE 3, INTERVENANT 4, BENEFICIAIRE 5). Ce sont les id de la table `role`, dupliqués dans `front/src/constantes/roles.js` : modifier les trois ensemble. Le rôle BENEFICIAIRE est réservé au compte lié au bénéficiaire (`beneficiaire.personne_id`), et un bénéficiaire garde toujours au moins un admin.
- La suppression d'une personne est un archivage logique (`personne.est_archive`), pas un `DELETE`.

## Architecture front (`front/src`, React 19, react-router 8, Tailwind 4 + DaisyUI 5)

- `api/auth.js` : **tous** les appels réseau passent par `appeler()` (fetch sur `/api…`, lève une erreur portant `status` et `erreurs` par champ). Aucun `fetch` dans les composants d'affichage.
- `context/AuthContext.jsx` : `useAuth()` → `{ utilisatrice, chargement, connexion, deconnexion }`. La session est restaurée via `GET /api/auth/moi`, puisque le token n'est jamais accessible au JS.
- `App.jsx` : routes imbriquées sous `<RouteProtegee><Layout/></RouteProtegee>`. Le filtrage par rôle (`roles={[...]}`) n'est que de l'ergonomie : chaque route API doit aussi avoir son `exigerRoleSur`.
- `pages/` = écrans, `components/` = éléments réutilisables. Mobile-first, HTML sémantique, contraste WCAG AA (CONTRIBUTING §7).

## Conventions (CONTRIBUTING.md)

- Gitflow : branches `feature/…`, `fix/…`, etc. créées depuis `dev`, PR vers `dev` (jamais de push sur `dev` ni `main`).
- Conventional Commits en anglais, à l'impératif, en minuscules, 72 caractères max : `feat(back): add …`.
- Avant une PR : `npm run lint` et `npm run format`. Ne pas modifier la config ESLint/Prettier sans en parler à l'équipe.
- Écart connu : CONTRIBUTING demande du code en anglais et des fichiers `name.layer.js`, mais le code existant utilise des noms français et `agendaControllers.js`. Suivre le style des fichiers voisins.
