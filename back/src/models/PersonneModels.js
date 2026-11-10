import { db } from '../db.js';

// Les colonnes qu'on peut renvoyer au front : jamais le hash
const COLONNES_PUBLIQUES = 'id, nom, prenom, date_naissance, mail';

export async function trouverParMail(mail) {
	const { rows } = await db.query(
		`SELECT ${COLONNES_PUBLIQUES}, mot_de_passe_hash, role_id FROM personne WHERE mail = $1 AND est_archive=false`,
		[mail],
	);
	return rows[0] ?? null;
}

export async function trouverTous() {
	const { rows } = await db.query(
		`SELECT p.id, p.nom, p.prenom, p.date_naissance, p.mail, r.intitule FROM personne p JOIN role r ON p.role_id = r.id WHERE est_archive=false ORDER BY p.id ASC`,
	);
	return rows ?? null;
}

export async function trouverParId(id) {
	const { rows } = await db.query(`SELECT ${COLONNES_PUBLIQUES} FROM personne WHERE id = $1`, [
		id,
	]);
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

export async function archiverParId(id) {
	const { rows } = await db.query(
		`UPDATE personne SET est_archive=true WHERE id=$1 RETURNING id`,
		[id],
	);

	return rows[0];
}
