# Dictionnaire des données

| Nom | Description | Type | Taille | Contraintes | Remarques |
| --- | ----------- | ---- | ------ | ----------- | --------- |
| nomPersonne | nom de famille de la personne | VARCHAR | 50 | Obligatoire | ... |
| prénomPersonne | prénom de la personne | VARCHAR | 50 | Obligatoire | ... |
| dateNaissancePersonne | date de naissance de la personne | DATE | ... | Facultatif | ... |
| mailPersonne | adresse mail de la personne | VARCHAR | 255 | Obligatoire, Unique | Sert d'identifiant de connexion |
| intituléÉvénement | intitulé de l'événement | VARCHAR | 50 | Obligatoire | ... |
| dateDébutÉvénement | date de début de l'événement | DATE | ... | Obligatoire | ... |
| dateFinÉvénement | date de fin de l'événement | DATE | ... | Obligatoire | Postérieure ou égale à dateDébutÉvénement |
| heureDébutÉvénement | heure de début de l'événement | Heure | ... | Obligatoire | ... |
| heureFinÉvénement | heure de fin de l'événement | Heure | ... | Obligatoire | ... |
| lieuÉvénement | lieu du rendez-vous | Enum | ... | Obligatoire | "à domicile", "à l'extérieur" |
| descriptionÉvénement | informations complémentaires sur l'événement | VARCHAR | 255 | Facultatif | ... |
| intituleType | type d'évèenement | VARCHAR | 50 | Obligatoire | ... |
| descriptionMessage | contenu du message du journal de bord | VARCHAR | ... | Obligatoire | TEXT |
| dateMessage | date du message | DATE | ... | Obligatoire | ... |
| importanceMessage | niveau d'importance du message | ENUM | ... | Obligatoire | "faible", "moyenne", "élevée" |
| intituleCatégorie | nom de la catégorie de classement des messages | VARCHAR | 50 | Obligatoire, Unique | ... |
| intituléRôle | rôle de la personne dans l'application | VARCHAR | 50 | Obligatoire | ... |