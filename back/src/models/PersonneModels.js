import { db } from '../db.js';

// Les colonnes qu'on peut renvoyer au front : jamais le hash
const COLONNES_PUBLIQUES = 'id, nom, prenom, date_naissance, mail, telephone';

export async function trouverParMail(mail) {
	const { rows } = await db.query(
		`SELECT ${COLONNES_PUBLIQUES}, mot_de_passe_hash FROM personne WHERE mail = $1 AND est_archive=false`,
		[mail],
	);
	return rows[0] ?? null;
}

export async function trouverParId(id) {
	// Le rôle n'est plus ici : il dépend du bénéficiaire (voir BeneficiaireModels.trouverParPersonne)
	const { rows } = await db.query(
		`SELECT ${COLONNES_PUBLIQUES}
		 FROM personne
		 WHERE id = $1`,
		[id],
	);
	return rows[0] ?? null;
}

// permet de vérifier que l'ancien mot de passe correspond sans qu'il soit visible dans l'onglet network du navigateur
export async function trouverAvecHashParId(id) {
	const { rows } = await db.query(
		`SELECT id, mot_de_passe_hash 
		 FROM personne
		 WHERE id = $1`,
		[id],
	);
	return rows[0] ?? null;
}

export async function creer({ nom, prenom, date_naissance, mail, mot_de_passe_hash }) {
	const { rows } = await db.query(
		`INSERT INTO personne (nom, prenom, date_naissance, mail, mot_de_passe_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLONNES_PUBLIQUES}`,
		[nom, prenom, date_naissance, mail, mot_de_passe_hash],
	);
	return rows[0];
}

export async function updateUser(
	id,
	{ nom, prenom, date_naissance, mail, telephone, mot_de_passe_hash },
) {
	const { rows } = await db.query(
		`UPDATE personne 
		SET nom = COALESCE($1, nom),
			prenom = COALESCE($2, prenom), 
			date_naissance = COALESCE($3, date_naissance),
			mail = COALESCE($4, mail),

			telephone = CASE
			WHEN $5 = '' THEN NULL
			ELSE COALESCE($5, telephone)
			END,

			mot_de_passe_hash = COALESCE($6, mot_de_passe_hash)
		WHERE id = $7
		RETURNING ${COLONNES_PUBLIQUES}`,
		[nom, prenom, date_naissance, mail, telephone, mot_de_passe_hash, id],
	);
	return rows[0] ?? null;
}
