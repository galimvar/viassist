# ADR 006 - Architecture back

Date : 2026-10-27  
Statut : Proposé

## Contexte
Le back de Vi'Assist est une API Node.js / Express consommée par le front React. Il gère l'agenda, le journal de bord, la fiche personne et les comptes avec rôles (aidant principal, famille, aide à domicile, personnel médical).

Chaque donnée doit être protégée selon le rôle de l'utilisateur, et certaines règles métier sont à prévoir (alerte de journée surchargée, récurrence des rendez-vous, filtrage des informations selon le rôle).

L'équipe compte 4 personnes qui travaillent en parallèle, est formée à Express, et le projet n'est pas encore en production. Nous voulons un code lisible, testable, où chacun sait où placer son code.

## Options considérées
1. Architecture par couches (routes, contrôleurs, services, accès aux données) : chaque couche a une responsabilité unique et ne dialogue qu'avec la couche voisine.
2. Tout dans les routes et contrôleurs (MVC simplifié, sans couche service) : rapide à démarrer, mais la logique métier se mélange au code HTTP et devient difficile à tester et à réutiliser.
3. Architecture hexagonale / clean architecture : isole fortement le métier, mais introduit beaucoup de concepts (ports, adaptateurs) et de code, disproportionné pour une V1 portée par une équipe de 4.
4. Organisation par fonctionnalité (modules agenda, journal, fiche, comptes) : bonne cohésion, mais plus difficile à prendre en main pour l'équipe que la séparation en couches.

## Décision
Nous adoptons une architecture par couches pour le back :
- **Routes** : déclarent les endpoints et enchaînent les middlewares
- **Middlewares** : authentification, vérification des rôles et permissions, validation des données entrantes, gestion centralisée des erreurs
- **Contrôleurs** : reçoivent la requête, appellent le service et renvoient la réponse HTTP. Aucune logique métier
- **Services** : portent la logique métier (alerte de surcharge, règles de récurrence, règles d'accès selon le rôle)
- **Accès aux données (models)** : seule couche qui dialogue avec PostgreSQL

Règle de dépendance : une couche n'appelle que la couche située juste en dessous (pas de requête SQL dans un contrôleur, pas d'objet `req` / `res` dans un service).

## Conséquences

### Avantages
- Responsabilités claires : chacun sait où écrire et où chercher son code
- Services testables sans serveur HTTP ni base de données réelle
- Contrôle des rôles centralisé dans des middlewares, ce qui limite le risque d'oubli sur des données sensibles
- Changement du mode d'accès aux données (ORM, requêtes SQL) isolé dans une seule couche
- Travail en parallèle facilité, prise en main simple pour de nouveaux arrivants

### Inconvénients
- Plus de fichiers pour une fonctionnalité simple : un CRUD basique traverse toutes les couches
- Risque de couches « passe-plat » (un service qui ne fait qu'appeler l'accès aux données)
- Demande de la discipline et des relectures de code pour respecter la règle de dépendance
- Une même fonctionnalité est répartie sur plusieurs dossiers
