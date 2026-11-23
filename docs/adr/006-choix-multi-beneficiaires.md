# ADR 006 - Gestion de plusieurs bénéficiaires et rôles par bénéficiaire

Date : 2026-11-23  
Statut : Proposé

## Contexte
En V1, Vi'Assist suppose un seul bénéficiaire. Le rôle d'une personne est global : il est stocké dans `personne.role_id` et recopié dans le JWT. Les événements et les messages ne sont rattachés à aucun bénéficiaire, donc l'agenda et le journal affichent toute la table.

Dans la réalité :
- un intervenant (infirmier, auxiliaire de vie…) se rend chez plusieurs bénéficiaires dans la journée ;
- un aidant peut accompagner plusieurs proches, par exemple ses deux parents ;
- la même personne peut avoir un rôle différent selon le bénéficiaire : admin chez sa mère, simple proche chez son oncle.

Avec un rôle global, un admin peut aujourd'hui agir sur toutes les personnes de la base. Ce n'est plus acceptable dès qu'il y a plusieurs bénéficiaires.

Une personne aidée ne se connecte pas forcément : une personne atteinte de troubles cognitifs peut n'avoir jamais de compte.

## Options considérées
1. **Rôle global + liste des bénéficiaires accessibles.** On garde `personne.role_id` et on ajoute une table d'accès. C'est simple, mais on ne peut pas être proche chez l'un et admin chez l'autre.
2. **Rôle porté par le lien personne ↔ bénéficiaire.** On crée une table d'association `accompagner(personne_id, beneficiaire_id, role_id)` et `personne.role_id` disparaît.
3. **Option 2 + super-admin global de plateforme.** C'est plus puissant, mais personne n'en a besoin pour l'instant et cela crée un risque d'accès trop large.

Pour représenter le bénéficiaire :
- **a. Une ligne de `personne`.** Chaque personne aidée doit alors avoir un compte, avec un mail unique.
- **b. Une entité `beneficiaire` à part.** Elle peut être liée à un compte (`personne_id` facultatif).

Pour savoir quel est le bénéficiaire actif dans une requête :
- **dans le JWT** : il faut ré-émettre le token à chaque changement, et l'état est caché ;
- **dans l'URL** (`/api/beneficiaires/:beneficiaireId/agenda/...`) : l'API reste sans état, et chaque requête dit explicitement sur quelle ressource elle porte.

## Décision
- **Option 2** : le rôle est porté par `accompagner`, et `personne.role_id` est supprimé.
- **Option b** : on crée une table `beneficiaire`. Elle a un `personne_id` facultatif et unique, renseigné quand le bénéficiaire possède un compte. Ce compte a alors le rôle « bénéficiaire » dans `accompagner`.
- `evenement` et `message` reçoivent une colonne `beneficiaire_id` obligatoire.
- Le bénéficiaire actif est passé **dans l'URL**. Le middleware `exigerRoleSur(...roles)` lit `req.params.beneficiaireId` et cherche le rôle de la personne connectée chez ce bénéficiaire :
  - si la personne n'a aucun lien avec ce bénéficiaire, il répond 404, pour ne pas révéler son existence ;
  - si le rôle ne fait pas partie des rôles autorisés, il répond 403.
- Ce middleware interroge directement la couche models. C'est une exception assumée à l'ADR 004 : le contrôle d'accès est transverse, comme `auth`.
- Tout utilisateur connecté peut créer un bénéficiaire, et il en devient automatiquement admin. Un bénéficiaire garde toujours au moins un admin.
- Le JWT ne contient plus que `{ sub }`.

## Conséquences

### Avantages
- Les droits correspondent à la réalité : on n'est admin que là où on l'est.
- Les données d'un bénéficiaire sont isolées : chaque requête de l'agenda et du journal est filtrée par `beneficiaire_id`.
- Une personne aidée peut avoir une fiche sans compte.
- L'API reste sans état et les URL disent sur quoi elles portent, ce qui facilite les tests avec les fichiers `.http`.

### Inconvénients
- Chaque requête protégée fait une requête SQL de plus pour lire le rôle.
- C'est un gros chantier : migration avec reprise des données, nouvelles URL d'API, écran de choix du bénéficiaire, refonte de l'écran de gestion des personnes.
- Les écrans qui affichaient « le rôle de l'utilisateur » doivent maintenant savoir quel bénéficiaire est actif.
