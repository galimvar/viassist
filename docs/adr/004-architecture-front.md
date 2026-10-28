# ADR 007 - Architecture front

Date : 2026-10-27  
Statut : Proposé

## Contexte
Le front de Vi'Assist sera utilisé par des profils variés (proches, aidants familiaux, aides à domicile, personnel médical) sur plusieurs écrans qui partagent beaucoup d'éléments : agenda avec rendez-vous catégorisés par couleur et lieu par icône, journal de bord, fiche personne, filtres, formulaires, alertes.

Nous voulons une interface cohérente, développée rapidement par une équipe de 4 personnes qui travaillent en parallèle, formée à React et Tailwind. Le projet n'est pas encore en production.

## Options considérées

### Bibliothèque front
1. React : bibliothèque de composants très répandue, maîtrisée par l'équipe.
2. Vue.js / Angular : alternatives solides, mais l'équipe n'y est pas formée.

### Style et composants d'interface
1. Tailwind CSS + DaisyUI : classes utilitaires et composants prêts à l'emploi (boutons, modales, badges, alertes) avec système de thèmes.
2. Tailwind CSS seul : plus de liberté, mais tous les composants sont à construire et à styliser.
3. Bootstrap ou bibliothèque de composants React (MUI, Chakra) : complets, mais d'autres outils à apprendre et un style plus imposé.

### Organisation du code
1. Architecture en composants : interface découpée en composants réutilisables assemblés dans des pages.
2. Pages monolithiques : plus rapides à écrire au début, mais éléments dupliqués et code difficile à maintenir.

## Décision
Nous utilisons React avec Tailwind CSS et DaisyUI, organisés en architecture en composants :
- **Composants d'interface génériques** : bouton, modale, badge, alerte, champ de formulaire, stylés avec Tailwind / DaisyUI
- **Composants métier** : carte de rendez-vous, entrée du journal, fiche personne, filtres
- **Pages** : assemblent les composants pour chaque grande zone (agenda, journal de bord, fiche personne, compte)
- **Logique partagée** : regroupée dans des hooks personnalisés, et appels à l'API isolés dans une couche de services dédiée (pas d'appel API dans les composants d'affichage)

L'affichage s'adapte au rôle de l'utilisateur, mais la sécurité des données reste garantie par le back (voir ADR 003).

## Conséquences

### Avantages
- Réutilisation : un même composant pour tous les rendez-vous, avec une catégorie représentée par un badge de couleur
- Cohérence visuelle et développement rapide grâce aux composants DaisyUI
- Équipe déjà formée, donc démarrage rapide
- Travail en parallèle facilité, chacun pouvant développer et tester un composant isolément
- Large écosystème et documentation abondante

### Inconvénients
- Les classes utilitaires peuvent alourdir le JSX : à atténuer en les encapsulant dans des composants
- Personnalisation de DaisyUI limitée si le design devient très spécifique, et rendu générique sans thème personnalisé
- React laisse d'autres choix à faire (routage, gestion d'état), à trancher dans de futurs ADR si nécessaire
- Demande de la discipline dans le découpage : éviter les composants trop gros ou trop imbriqués
