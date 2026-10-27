# Dictionnaire des données

| Nom | Description | Type | Taille | Contraintes | Remarques |
| --- | ----------- | ---- | ------ | ----------- | --------- |
| nomPersonne | nom de famille de la personne | Texte | 50 | Obligatoire | ... |
| prénomPersonne | prénom de la personne | Texte | 50 | Obligatoire | ... |
| dateNaissancePersonne | date de naissance de la personne | Date | ... | Facultatif | ... |
| mailPersonne | adresse mail de la personne | Texte | 255 | Obligatoire, Unique | Sert d'identifiant de connexion |
| rôlePersonne | rôle de la personne dans l'application | Enum | ... | Obligatoire | "admin", "invité", "proche", "intervenant", "bénéficiaire" |
| nomÉvénement | intitulé de l'événement | Texte | 50 | Obligatoire | ... |
| dateDébutÉvénement | date de début de l'événement | Date | ... | Obligatoire | ... |
| dateFinÉvénement | date de fin de l'événement | Date | ... | Obligatoire | Postérieure ou égale à dateDébutÉvénement |
| heureDébutÉvénement | heure de début de l'événement | Heure | ... | Obligatoire | ... |
| heureFinÉvénement | heure de fin de l'événement | Heure | ... | Obligatoire | ... |
| typeÉvénement | catégorie du rendez-vous | Enum | ... | Obligatoire | "Médical", "Paramédical", "Aide à domicile", "Autres", "Proches" |
| lieuÉvénement | lieu du rendez-vous | Enum | ... | Obligatoire | "à domicile", "à l'extérieur" |
| descriptionÉvénement | informations complémentaires sur l'événement | Texte | 255 | Facultatif | ... |
| descriptionMessage | contenu du message du journal de bord | Texte | ... | Obligatoire | Texte long, sans limite de taille |
| dateMessage | date du message | Date | ... | Obligatoire | ... |
| importanceMessage | niveau d'importance du message | Enum | ... | Obligatoire | "faible", "moyenne", "élevée" |
| nomCatégorie | nom de la catégorie de classement des messages | Texte | 50 | Obligatoire, Unique | ... |
