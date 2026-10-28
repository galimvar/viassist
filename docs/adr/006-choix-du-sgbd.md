# ADR 005 - Choix du SGBD

Date : 2026-10-27  
Statut : Proposé

## Contexte
Vi'Assist centralise les informations liées au suivi d'un proche en perte d'autonomie : agenda de rendez-vous (catégorie, lieu, récurrence), journal de bord, fiche personne (constantes physiques, posologie, allergies) et comptes utilisateurs avec rôles.

Ces données sont fortement liées entre elles (un proche, plusieurs aidants et intervenants, chacun avec un rôle et des droits d'accès différents) et sensibles (données de santé). Nous avons besoin d'une bonne cohérence des données, de filtres sur l'agenda et le journal (catégorie, lieu, importance) et d'un historique dans le temps (évolution du poids, par exemple).

L'équipe compte 4 personnes, est formée à PostgreSQL et le projet n'est pas encore en production.

## Options considérées
1. PostgreSQL : SGBD relationnel open source, avec contraintes d'intégrité, transactions et types riches (dates avec fuseau horaire, énumérations, JSON).
2. MySQL / MariaDB : alternative relationnelle également mature, mais l'équipe n'y est pas formée et aucun besoin du projet ne la rend plus adaptée.
3. MongoDB : base documentaire au schéma flexible. Nos données étant fortement relationnelles (utilisateurs, rôles, proches, rendez-vous), l'intégrité et les jointures seraient à gérer côté applicatif.
4. SQLite : très simple à mettre en place (pas de serveur), mais limité pour un usage multi-utilisateurs concurrent en production.

## Décision
Nous utilisons PostgreSQL comme SGBD de Vi'Assist.

## Conséquences

### Avantages
- Intégrité garantie par les clés étrangères et les contraintes, adaptée aux relations proche / aidants / intervenants / rôles
- Transactions fiables pour garder des données cohérentes (par exemple la création d'une série de rendez-vous récurrents)
- Types adaptés à nos besoins : dates avec fuseau horaire pour l'agenda, énumérations pour les catégories et lieux, types numériques pour les constantes physiques
- Compétences déjà présentes dans l'équipe, solution open source avec une large communauté et un bon support dans l'écosystème Node.js
- Possibilité de stocker ponctuellement des données semi-structurées (JSONB) si le besoin apparaît

### Inconvénients
- Schéma plus rigide : les évolutions passent par des migrations, qu'il faudra outiller
- Un serveur de base de données à héberger et à administrer (sauvegardes, mises à jour)
- Il s'agit de données de santé : l'hébergement de la base en production devra respecter les exigences réglementaires (RGPD, certification HDS en France). À étudier avant la mise en production, car cela peut contraindre le choix de l'hébergeur
