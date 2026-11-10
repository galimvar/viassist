import { db } from '../db.js';

// Les colonnes qu'on peut renvoyer au front : jamais le hash
const COLONNES_PUBLIQUES = 'id, nom, prenom, date_naissance, mail, role_id';

export async function trouverParMail(mail) {
	const { rows } = await db.query(
		`SELECT ${COLONNES_PUBLIQUES}, mot_de_passe_hash FROM personne WHERE mail = $1`,
		[mail],
	);
	return rows[0] ?? null;
}

export async function trouverParId(id) {
	// Jointure sur role : on renvoie aussi l'intitulé (« admin », « proche »...) et pas seulement l'id
	const { rows } = await db.query(
		`SELECT p.id, p.nom, p.prenom, p.date_naissance, p.mail, p.role_id, r.intitule AS role
		 FROM personne p JOIN role r ON r.id = p.role_id
		 WHERE p.id = $1`,
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

export async function creer({ nom, prenom, date_naissance, mail, mot_de_passe_hash, role_id }) {
	const { rows } = await db.query(
		`INSERT INTO personne (nom, prenom, date_naissance, mail, mot_de_passe_hash, role_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${COLONNES_PUBLIQUES}`,
		[nom, prenom, date_naissance, mail, mot_de_passe_hash, role_id],
	);
	return rows[0];
}

export async function trouverRole(role) {
	const { rows } = await db.query(`SELECT id FROM role WHERE intitule = $1`, [role]);
	return rows[0];
}

export async function updateUser(id, { nom, prenom, date_naissance, mail, mot_de_passe_hash }) {
	const { rows } = await db.query(
		`UPDATE personne 
		SET nom = COALESCE($1, nom),
			prenom = COALESCE($2, prenom), 
			date_naissance = COALESCE($3, date_naissance),
			mail = COALESCE($4, mail),
			mot_de_passe_hash = COALESCE($5, mot_de_passe_hash)
		WHERE id = $6
		RETURNING ${COLONNES_PUBLIQUES}`,
		[nom, prenom, date_naissance, mail, mot_de_passe_hash, id],
	);
	return rows[0] ?? null;
}
