# Reformulation du brief

## Problématique reformulée :
**Nous cherchons à résoudre un problème d'organisation et de transmission de données pour un aidant, lorsque l'un de ses proches en perte d'autonomie nécessite une assistance à domicile.**

## Cible utilisateurice prioritaire = personna principal :

### 1. Qui ?

>Situation personnelle ou professionnelle pertinente.  

Personne ayant un proche nécessitant une assistance à domicile (médicale ou non).

>Contexte dans lequel la personne utilise le produit.  

Suivi des visistes, et de la vie quotidienne (soin, repas, ménage, etc...)

>Éventuellement quelques informations démographiques **uniquement si elles ont un impact sur le problème**.  

...

### 2. Quand et où ?

>Dans quelle situation le problème apparaît-il ?  

Losque des aidants ont besoin d'organiser la vie quotidienne d'un proche en perte d'autonomie.

>À quelle fréquence ?

Quotidiennement

>Dans quel environnement ?

Au domicile de la personne

>Qu’est-ce qui déclenche le besoin ?

La nécessité d'organiser la vie quotidienne et de transmettre des informations entre aidants et intervenants (infirmiers, aides à domicile, etc...)

### 3. Quel problème ?

>Que cherche-t-elle à faire ?

Optimiser la gestion de la vie quotidienne de la personne en perte d'autonomie

>Qu’est-ce qui lui pose difficulté ?

La multiplicité des intervenants et des tâches, ainsi que la centralisation des données à transmettre.

>Quelles conséquences cela a-t-il pour elle ?

Charge mentale, redondance, manque d'informations et de transparence.

### 4. Pourquoi ?

>Pourquoi ce problème est-il important ?

Parce que dans un quotidien déjà chargé par la perte d'autonomie d'un proche, la charge mentale est une peine supplémentaire à assumer.

>Qu’est-ce qui se passe si elle ne trouve pas de solution ?

Risque de surmenage, amenant à des défaillances dans la transmission d'informations aux intervenants, et par conséquent à un risque pour la santé du proche en perte d'autonomie.

## Périmètre d'une V1 (Vi'Assist)

### Fonctionnalités imaginées 

#### Must Have
- V1 - Planning - Liens familiaux 
- V1 - Journal de bord 
- V1 - Rdv (médical, paramédical, coiffeur, à domicile, à l'extérieur, etc...)
- V1 - Fiche patient (allergies, prescriptions médicales, etc...)
- V1 - Gestion de compte, connexion, mots de passe, rôles

#### Should Have
- V1 - Notifications message et calendrier
- Administratif (impôts, comptes, factures, créanciers, etc...)
- V1 - Fonctionnalité "liste" par priorité (courses, affaires manquantes, choses à penser, etc...)

#### Could Have
- V1 - Récurrence des tâches (ajouté au planning et tâches)
- Connexion par QR code, pour accès fiche patient
- Jauge charge mentale

#### Won't Have
- Domotique (appareils connectés) - API à distance
- Interface patient (appels, photos, proches, planning, rappels)
- Curatelle (gestion plus complète) ?
- Alertes (avec sonnerie)



### La stack
- Front : React / Tailwind Daisy UI
- Back : Node.js - Express 
- SQBG : Postgresql
