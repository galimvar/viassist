# Schéma MLD Vi'Assist - V2 (multi-bénéficiaires, cf. ADR 006)
## Lecture des liens
 
| Symbole | Signification |
| --- | --- |
| `\|\|` | exactement un |
| `\|o` | zéro ou un |
| `o{` | zéro ou plusieurs |
| `\|{` | un ou plusieurs |
 
Exemple : `categorie |o--o{ message : "classe"` se lit « un message est classé dans zéro ou une catégorie, et une catégorie classe zéro ou plusieurs messages ».

## Schéma
```mermaid
erDiagram
	personne {
		INTEGER id PK
		VARCHAR(50) nom
		VARCHAR(50) prenom
		DATE date_naissance "facultatif"
		VARCHAR(255) mail UK
		VARCHAR(17) telephone "facultatif"
		BOOLEAN est_archive
	}

	beneficiaire {
		INTEGER id PK
		VARCHAR(50) nom
		VARCHAR(50) prenom
		DATE date_naissance "facultatif"
		INTEGER personne_id FK, UK "facultatif : compte du bénéficiaire"
		BOOLEAN est_archive
	}

	accompagner {
		INTEGER personne_id PK, FK
		INTEGER beneficiaire_id PK, FK
		INTEGER role_id FK
	}

	role {
		INTEGER id PK
		VARCHAR(50) intitule UK
	}

	evenement {
		INTEGER id PK
		VARCHAR(50) intitule
		DATE date_debut
		DATE date_fin
		TIME heure_debut
		TIME heure_fin
		LIEUX lieu "ENUM"
		VARCHAR(255) description "facultatif"
		INTEGER type_evenement_id FK
		INTEGER personne_id FK "createur"
		INTEGER beneficiaire_id FK
	}

	participer {
		INTEGER personne_id PK, FK
		INTEGER evenement_id PK, FK
	}

	type_evenement {
		INTEGER id PK
		VARCHAR(50) intitule UK
	}

	message {
		INTEGER id PK
		TEXT description
		DATE date
		IMPORTANCE importance "ENUM"
		INTEGER personne_id FK "auteur"
		INTEGER categorie_id FK "facultatif"
		INTEGER beneficiaire_id FK
	}

	categorie {
		INTEGER id PK
		VARCHAR(50) intitule UK
	}

	personne ||--o{ accompagner : "accompagne"
	beneficiaire ||--o{ accompagner : "est accompagné"
	accompagner }o--|| role : "avec le rôle"
	personne |o--o| beneficiaire : "est le compte de"
	beneficiaire ||--o{ evenement : "concerne"
	beneficiaire ||--o{ message : "concerne"
	personne ||--o{ evenement : "crée"
	personne ||--o{ participer : "participe"
	evenement ||--o{ participer : "a pour participant"
	evenement }o--|| type_evenement : "est"
	personne ||--o{ message : "écrit"
	message }o--o| categorie : "appartient à"
```