# User Stories

## Agenda

### MUST-01 Visualisation

-> **En tant que** proche d'une personne en perte d'autonomie, **je veux** pouvoir consulter le planning **afin de** savoir quand passer voir ce membre de la famille.  

-> **Étant donné que** je consulte le planning **quand** je souhaite rendre visite à mon proche **alors** je peux m'apercevoir qu'il est actuellement en rendez-vous **mais** que je peux y aller mardi.

### MUST-02-Must Créer un RDV

-> **En tant** qu'aidant familial je veux pouvoir créer des RDV d'un proche en perte d'autonomie **afin d**'avoir un agenda dédié qui le concerne.

-> **Étant donné que** je suis connectée en tant qu'aidant familial **quand** je consulte l'agenda **alors** je peux créer un RDV.

### MUST-03 Supprimer un RDV

-> **En tant qu**'aidant familial **je veux** pouvoir supprimer un RDV déjà créé **afin** que mon proche ne se déplace pas pour rien.

-> **Étant donné qu'**un RDV de mon proche a été annulé **quand** je sélectionne un RDV déjà créé **alors** je peux le supprimer.

### MUST-04 Modifier un RDV

-> **En tant qu**'aidant familial **je veux** pouvoir modifier un RDV déjà créé **afin de** ne pas le faire manquer à mon proche.

-> **Étant donné qu'**un RDV de mon proche a été décalé **quand** je sélectionne un RDV déjà créé **alors** je peux le modifier.

### SHOULD-05 Catégorie de RDV

-> **En tant qu**'aidant familial **je veux** pouvoir catégoriser les RDV de mon proche **afin de** les identifier rapidement.

-> **Étant donné que** je suis connecté en tant qu'aidant familial principal **quand** je consulte les rendez-vous **alors** leur catégorie est visuellement représentée par une couleur.

Catégories :

- Médical (infirmière, médecin, spécialiste…) - BLEU
- Paramédical (kiné, podologue…) - VERT
- Aide à domicile (ménage, toilette…) - JAUNE
- Famille - [couleur ?]
- Autres (coiffeuse, banquier, notaire…) - [couleur ?]

### SHOULD-06 Lieu de RDV

-> **En tant qu**'aidant familial **je veux** pouvoir renseigner si le RDV de mon proche est à domicile ou à l'extérieur **afin de** pouvoir anticiper le temps/type de transport.

-> **Étant donné que** je suis connecté en tant qu'aidant familial principal **quand** j'arrive sur l'agenda **alors** les RDV s'affichent avec une icône indiquant leur lieu.

Lieu de RDV :

- Domicile - 🏠
- Extérieur - 🚗

### SHOULD-07 Filtrer un RDV

-> **En tant qu**'aidant familial **je veux** pouvoir trier les RDV médicaux de mon proche **afin de** m'assurer que celui du cardiologue n'a pas été oublié.

-> **Étant donné que** je suis dans l'agenda de mon proche **quand** j'applique les filtres "Médical" et "Extérieur" des RDV **alors** je vois uniquement ceux de ces catégories.

Filtres :

- 🗂️ Catégorie
- 📍 Lieu

### SHOULD-08 Récurrence des RDV

-> **En tant qu**'aidant familial **je veux** qu'un RDV hebdomadaire puisse être créé automatiquement **afin de** ne pas avoir à le faire manuellement toutes les semaines.

-> **Étant donné que** mon proche a RDV avec son kiné toutes les semaines **quand** je crée son 1er RDV **alors** je peux lui affecter une récurrence.

Récurrences possibles :

- Quotidienne
- Hebdomadaire
- Mensuelle
- Annuelle (?)
- Libre ?

### COULD-09 Alerte

-> **En tant qu**'aidant familial **je veux** éviter de surcharger la journée de mon proche **afin de** ne pas le fatiguer avec trop de RDV en peu de temps. 

-> **Étant donné que** je dois prendre un nouveau RDV pour mon proche **quand** je l'ajoute dans l'agenda **alors** une alerte m'indique que la journée est déjà bien chargée.

### WON'T-10 Interface du proche

-> **En tant qu**'aidant familial **je veux** que mon proche en perte d'autonomie puisse voir son agenda afin d'être tenu au courant des visites qu'il va avoir.

-> **Étant donné que** je suis une personne en perte de mémoire **quand** je vois l'agenda de l'appli **alors** je vois tous mes RDV prévus aujourd'hui.

## Fiche Personne

### MUST - 01 - Fiche Personne - Ajouter des constantes physiques

-> **En tant qu**'aidant (familial ou non) **je veux** pouvoir ajouter les conditions physiques de la personne en perte d'autonomie afin qu'elles puissent être consultées par la famille

-> **Étant donné que** je suis un aidant **quand** je souhaite ajouter le poids de la personne **alors** j'en ai la possibilité

### MUST - 02 - Fiche Personne - Consultation Constantes physiques

-> **En tant qu'**aidant/soignant, je veux connaître les conditions physiques de la personne **afin d'**adapter les soins/l'assistance apportés

-> **Étant donné que** je constate un IMC élevé **quand** j'accède à la fiche du patient **alors** je peux venir avec le matériel adapté pour les soins.

### MUST - 03 - Modifier des constantes physiques

-> **En tant qu**'aidant (familial ou non) **je veux** pouvoir modifier les conditions physiques de la personne en perte d'autonomie **afin qu'**elles puissent être consultées par la famille.

-> **Étant donné que** je suis un aidant **quand** je souhaite mettre à jour la taille de la personne **alors** j'en ai la possibilité.

### MUST - 04 - Fiche Personne - Posologie

-> **En tant que** soignant, je veux connaître les médicaments et leur posologie **afin de** donner à la personne le bon traitement

-> **Étant donné que** ce traitement médical est indiqué **quand** j'ouvre la fiche patient **alors** je peux assurer le soin adapté.

### MUST - 05 - Fiche Personne - Allergies

-> **En tant qu**'aide à domicile qui prépare les repas, **je veux** avoir un rappel des allergies de mon bénéficiaire, **afin de** ne pas commettre d'erreur dans les plats que je lui prépare.

-> **Étant donné que** beaucoup d'allergies sont signalées **quand** j'accède à la fiche du bénéficiaire **alors** je peux adapter le repas du jour en conséquence.

### SHOULD - 06 - Fiche Personne - Évolution physique

-> **En tant qu**'aidant **je veux** pouvoir suivre l'évolution des conditions physiques de la personne en perte d'autonomie afin de visualiser l'état de santé du proche.

-> **Étant donné que** je suis un aidant **quand** je regarde l'évolution graphique **alors** je peux constater la perte de poids de ces dernières semaines.

### SHOULD-07 Ajout automatique

-> **En tant** qu'intervenant, **je veux** pouvoir indiquer que la prise de médicaments est faite **afin que** les autres intervenants soient au courant que tout est bien réalisé.

-> **Étant donné que** la personne en perte d'autonomie vient de prendre ses médicaments, **quand** je le valide sur la fiche, **alors** je veux qu'un rappel soit créé dans le journal de bord.

### COULD - 08- Fiche Personne - Protocole sanitaire

-> **En tant qu'**aide à domicile, je veux savoir si des conditions d'hygiène particulières sont nécessaires **afin de** prévoir le matériel nécessaire.

-> **Étant donné que** mon bénéficiaire est immunodéprimé **quand** j'ouvre la fiche de la personne **alors** j'ai une information m'indiquant le protocole sanitaire.

## Gestion des comptes

### MUST - 1 - Connexion

-> **En tant qu**'utilisateur, **je veux** pouvoir me connecter **afin de** pouvoir accéder à mes données personnalisées pour l'appli.

-> **Étant donné que** je demande accès à des données privées **quand** j'accède à l'application **alors** je dois me connecter avec mon identifiant et mon mot de passe.

### MUST - 2 - Déconnexion

-> **En tant qu**'utilisateur, **je veux** pouvoir me déconnecter **afin que** personne n'accède par mégarde à mon profil.

-> **Étant donné que** je veux protéger les données **quand** je n'utilise plus l'application **alors** j'ai besoin de pouvoir me déconnecter.

### MUST - 3 - Rôles

-> **En tant qu**'aidant principal d'une personne en perte d'autonomie, **je veux** pouvoir attribuer des rôles sur l'application **afin de** limiter l'accès de certaines données concernant mon proche aux personnes concernées.
-> **Étant donné que** je suis aidant secondaire **quand** j'essaie de modifier un rendez-vous qui ne me concerne pas **alors** l'appli me signale que je n'ai pas les autorisations.

Rôle → Accès :

- Aidant principal → totalité des infos
- Famille → Agenda, journal de bord…
- Aide à domicile → Journal de bord, allergies, protocole sanitaire…
- Personnel médical → Journal de bord, fiche patient complète, protocole sanitaire…

### COULD - 4 - QR Code

-> **En tant que** professionnel, **je veux** avoir accès à la fiche de la personne **afin de** ne pas avoir à fouiller dans l'appli.

-> **Étant donné que** j'ai beaucoup de patients **quand** je scanne le QR code en arrivant chez l'un d'entre eux **alors** j'ai accès facilement aux dernières infos.

## Journal de Bord

### MUST-01 Consulter des informations

-> **En tant** que proche d'une personne en perte d'autonomie, **je veux** pouvoir consulter les évènements passés dans la journée de mon proche, afin que je puisse adapter ma visite.

-> **Étant donné que** mon proche est tombé **quand** l'aide à domicile l'a aidé pour sa toilette **alors** le journal de bord me permet d'avoir cette information.

### MUST-02 Informer des changements

-> **En tant qu'**infirmière à domicile **je veux pouvoir** indiquer les changements de poche d'eau de manière précise **afin que** les autres intervenants aient l'information

-> **Étant donné que** les détails de temps et quantité sont importants **quand** je change une poche d'eau pour un patient **alors** le journal de bord me permet de notifier toutes ces informations de manière précise.

### SHOULD-03 Filtrer les événements

-> **En tant** que proche, **je veux** pouvoir filtrer les événements afin que seulement ceux liés aux rappels d'achats soient affichés.

-> **Étant donné que** je pars faire des achats, **quand** je consulte le journal de bord, **alors** je veux pouvoir filtrer les annonces pour n'afficher que celles liées aux stocks.

### SHOULD-04 Importance des informations

-> **En tant** qu'intervenant, **je veux** pouvoir indiquer le niveau d'importance d'une information afin que les consultants puissent rapidement la distinguer.

-> **Étant donné que** mon utilisation de couches est régulière **quand** le stock est presque épuisé **alors** je peux indiquer dans le journal de bord l'importance d'en racheter prochainement.