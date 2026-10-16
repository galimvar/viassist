# Vi'Assist

Vi'Assist est une application web qui aide les aidants familiaux à **organiser le quotidien d'un proche en perte d'autonomie** et à **centraliser les informations échangées avec tous les intervenants** (famille, infirmiers, aides à domicile).

Elle remplace les échanges dispersés par un espace partagé : un agenda (planning et rendez-vous), un journal de bord et une fiche personne, accessibles selon le rôle de chacun.

## 1. Problématique

Nous cherchons à résoudre un problème d'**organisation et de transmission de données** pour un aidant, lorsque l'un de ses proches en perte d'autonomie nécessite une assistance à domicile.

- **Difficulté** : multiplicité des intervenants et des tâches données à centraliser et à transmettre.
- **Conséquences** : charge mentale, redondance, manque d'informations et de transparence.
- **Enjeu** : sans solution, risque de surmenage de l'aidant, de défaillance dans la transmission d'informations, et donc de risque pour la santé du proche.

## 2. Utilisateurs et besoins

### Persona principal : l'aidant familial
Personne dont un proche a besoin d'une assistance à domicile (médicale ou non). Elle suit les visites et la vie quotidienne (soins, repas, ménage…), au domicile de la personne aidée. Le besoin naît de la nécessité d'organiser le quotidien et de transmettre l'information entre aidants et intervenants.

### Profils, besoins et accès prévus
| Profil | Besoin principal | Accès prévu |
|---|---|---|
| Aidant principal | Organiser l'agenda, attribuer les rôles, suivre l'état de son proche | Administrateur, accès complet |
| Aidant secondaire | Consulter et contribuer, sans modifier ce qui ne le concerne pas | Accès limité |
| Famille | Consulter l'agenda pour savoir quand rendre visite, lire le journal de bord | Agenda, journal de bord… |
| Aide à domicile | Connaître les allergies et le protocole sanitaire, transmettre ses observations | Journal de bord, allergies, protocole sanitaire… |
| Personnel médical (infirmier·ère…) | Connaître posologie et constantes, consigner précisément les soins, transmettre ses observations | Journal de bord, fiche personne complète, protocole sanitaire… |

### User stories
Le détail complet est dans `userstories.md`.

26 stories réparties en 4 modules, chacune avec sa priorité MoSCoW :

| Module | Nombre de stories |
|---|---|
| Agenda (planning et rendez-vous) | 10 |
| Fiche Personne | 8 |
| Gestion des comptes | 4 |
| Journal de bord | 4 |

## 3. Périmètre de la V1 (MoSCoW)

Les identifiants entre parenthèses renvoient à `userstories.md`.

### Must have (14 stories)
- **Agenda** : visualiser le planning, créer, supprimer et modifier un rendez-vous
- **Fiche Personne** : ajouter, consulter et modifier les constantes physiques, posologie, allergies
- **Gestion des comptes** : connexion déconnexion rôles
- **Journal de bord** : consulter les informations, informer des changements de manière précise

### Should have (8 stories)
- **Agenda** : catégorie de RDV représentée par une couleur, lieu domicile/extérieur avec icône, filtres par catégorie et lieu, récurrence des RDV
- **Fiche Personne** : évolution physique en graphique, ajout automatique au journal quand la prise de médicaments est validée
- **Journal de bord** : filtrer les événements, niveau d'importance d'une information

### Could have (3 stories)
- **Agenda** : alerte quand la journée est déjà chargée
- **Fiche Personne** : protocole sanitaire
- **Gestion des comptes** : connexion par QR code pour accéder à la fiche
- Issus du brief, **sans user story dans `userstories.md`** : jauge de charge mentale, administratif (impôts, factures…)

### Won't have (volontairement exclu de la V1)
- Interface du proche : voir son agenda, appels, photos, proches, rappels
- Domotique (appareils connectés, API à distance)
- Curatelle (gestion plus complète)
- Alertes avec sonnerie, notifications

### Ordre de développement

> **À compléter** : la connexion et les rôles conditionnent tous les autres modules (qui voit quoi). Faut-il les développer en premier ?

## 4. Choix techniques

| Brique | Choix | Justification |
|---|---|---|
| Front | React JS | Composants réutilisables |
| Style | Tailwind CSS + DaisyUI | Rapidité de mise en forme, composants prêts à l'emploi |
| Back | Node.js + Express | Equipe déjà formée, un seul et même langage |
| Base de données | PostgreSQL | Données relationnelles (personnes, rôles, rendez-vous, constantes physiques, traitements, entrées de journal) |
| Gestion de projet | Linear (Kanban) | Suivi des tickets et de l'avancement |
| Versionnement | Gitflow | Voir ADR 001 |

### Décision d'architecture : workflow Git (ADR 001, 2026-10-13)
- **Contexte** : équipe de 4, pas de mise en production, une fonctionnalité livrée à la fois.
- **Décision** : Gitflow, avec développement sur la branche `dev` et `main` protégée.
- **Avantages** : produit testé, `main` stable, plusieurs versions maintenables en parallèle.
- **Inconvénients** : plus de rigueur demandée, plus d'étapes avant déploiement.

## 5. Modèle de données et architecture (en cours de réflexion)

- ***Utilisateur (avec rôle : aidant principal, famille, aide à domicile, personnel médical)***
- ***Personne aidée (fiche personne : allergies, traitements et posologie, protocole sanitaire)***
- ***Constantes physiques (poids, taille…), à historiser pour suivre l'évolution (Fiche Personne SHOULD-06) ; l'IMC pourrait se calculer à partir du poids et de la taille — *à confirmer****
- ***Rendez-vous (catégorie, lieu domicile/extérieur, récurrence éventuelle)***
- ***Entrée de journal de bord (auteur, date et heure, niveau d'importance, détails précis comme l'heure et la quantité)***
- ***Liste et éléments de liste (si retenus, voir section 4)***

Livrables attendus : un MCD, puis un schéma d'architecture (client React ↔ API Express ↔ PostgreSQL).

## 6. Organisation du travail

- **Équipe** : 4 personnes.
- **Suivi** : Kanban dans Linear, un ticket par user story ou par tâche technique.
- **Git** : Gitflow (voir ci-dessus). **À compléter** : conventions de nommage des branches, de commit et règles de revue de code.
- **Rythme** : une fonctionnalité livrée à la fois.
- **Répartition des rôles** : **À compléter**.

## 7. Risques et inconnues (en cours de réflexion)

| Risque | Piste |
|---|---|
| Données de santé sensibles (allergies, posologie, constantes physiques) | Protection des données, hébergement, conformité RGPD |
| Gestion des droits par rôle, transversale à toute l'application | Concevoir le modèle de rôles **avant** le développement |
| Récurrence des RDV (Should) : comment stocker et modifier une série ? | Choix de modélisation **avant** le développement |
| Notifications (temps réel ou non ?) | Choix technique à faire avant de les développer |