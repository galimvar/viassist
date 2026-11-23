import { db } from '../db.js';

const COLONNES_PUBLIQUES = 'b.id, b.nom, b.prenom, b.date_naissance, b.personne_id';

/**
 * Rôle d'une personne chez un bénéficiaire (non archivé).
 * @returns {Promise<number|null>} role_id, ou null si la personne n'accompagne pas ce bénéficiaire
 */
export async function trouverRoleDe(personneId, beneficiaireId) {
	const { rows } = await db.query(
		`SELECT a.role_id
		 FROM accompagner a
		 JOIN beneficiaire b ON b.id = a.beneficiaire_id
		 WHERE a.personne_id = $1 AND a.beneficiaire_id = $2 AND b.est_archive = false`,
		[personneId, beneficiaireId],
	);
	return rows[0]?.role_id ?? null;
}

// Les bénéficiaires qu'une personne accompagne, avec son rôle chez chacun
export async function trouverParPersonne(personneId) {
	const { rows } = await db.query(
		`SELECT ${COLONNES_PUBLIQUES}, a.role_id, r.intitule AS role
		 FROM accompagner a
		 JOIN beneficiaire b ON b.id = a.beneficiaire_id
		 JOIN role r ON r.id = a.role_id
		 WHERE a.personne_id = $1 AND b.est_archive = false
		 ORDER BY b.nom, b.prenom`,
		[personneId],
	);
	return rows;
}

export async function trouverParId(id) {
	const { rows } = await db.query(
		`SELECT ${COLONNES_PUBLIQUES} FROM beneficiaire b WHERE b.id = $1 AND b.est_archive = false`,
		[id],
	);
	return rows[0] ?? null;
}

/**
 * Crée un bénéficiaire et rattache son créateur avec le rôle donné (admin).
 * Les deux INSERT sont dans une transaction : pas de bénéficiaire sans admin.
 */
export async function creerAvecAdmin({ nom, prenom, date_naissance }, personneId, roleId) {
	// Une transaction doit passer par UNE connexion : on en emprunte une au pool
	const client = await db.connect();
	try {
		await client.query('BEGIN');
		const { rows } = await client.query(
			`INSERT INTO beneficiaire (nom, prenom, date_naissance)
			 VALUES ($1, $2, $3)
			 RETURNING id, nom, prenom, date_naissance, personne_id`,
			[nom, prenom, date_naissance],
		);
		const beneficiaire = rows[0];
		await client.query(
			`INSERT INTO accompagner (personne_id, beneficiaire_id, role_id) VALUES ($1, $2, $3)`,
			[personneId, beneficiaire.id, roleId],
		);
		await client.query('COMMIT');
		return beneficiaire;
	} catch (erreur) {
		await client.query('ROLLBACK');
		throw erreur;
	} finally {
		client.release(); // toujours rendre la connexion au pool, même en cas d'erreur
	}
}
