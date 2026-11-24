import { db } from '../db.js';

// date_naissance renvoyée en TEXTE 'AAAA-MM-JJ' : sinon pg la convertit en Date JavaScript à minuit
// heure locale, que res.json écrit en UTC… soit la veille (1941-03-14 → "1941-03-13T22:00:00.000Z")
const DATE_NAISSANCE = `TO_CHAR(b.date_naissance, 'YYYY-MM-DD') AS date_naissance`;
const COLONNES_PUBLIQUES = `b.id, b.nom, b.prenom, ${DATE_NAISSANCE}, b.personne_id`;

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
 * Remplace la fiche d'un bénéficiaire (non archivé) par les valeurs reçues.
 * Le contrôleur envoie TOUJOURS les trois champs : nom et prénom non vides,
 * date_naissance en 'AAAA-MM-JJ' ou null (champ vidé dans le formulaire).
 *
 * @returns {Promise<object|null>} la fiche modifiée (mêmes colonnes que trouverParId), ou null si introuvable
 */
export async function modifier(id, { nom, prenom, date_naissance }) {
	const { rows } = await db.query(
		`UPDATE beneficiaire b 
		SET nom = $1, prenom=$2,  date_naissance=$3 WHERE id=$4 
		AND est_archive = false 
		RETURNING ${COLONNES_PUBLIQUES}`,
		[nom, prenom, date_naissance, id],
	);

	return rows[0] ?? null;
}

// ---------------------------------------------------------------- membres (table accompagner)

// Les comptes archivés n'apparaissent pas : ils ne peuvent plus se connecter
export async function listerMembres(beneficiaireId) {
	const { rows } = await db.query(
		`SELECT p.id, p.nom, p.prenom, p.mail, p.telephone, a.role_id, r.intitule AS role
		 FROM accompagner a
		 JOIN personne p ON p.id = a.personne_id
		 JOIN role r ON r.id = a.role_id
		 WHERE a.beneficiaire_id = $1 AND p.est_archive = false
		 ORDER BY a.role_id, p.nom, p.prenom`,
		[beneficiaireId],
	);
	return rows;
}

// Nombre de membres (comptes actifs) qui ont ce rôle chez ce bénéficiaire
export async function compterParRole(beneficiaireId, roleId) {
	const { rows } = await db.query(
		`SELECT count(*)::int AS nombre
		 FROM accompagner a
		 JOIN personne p ON p.id = a.personne_id
		 WHERE a.beneficiaire_id = $1 AND a.role_id = $2 AND p.est_archive = false`,
		[beneficiaireId, roleId],
	);
	return rows[0].nombre; // ::int : sinon pg renvoie count(*) en chaîne (bigint)
}

// Lève une erreur 23505 (clé primaire) si la personne est déjà membre
export async function ajouterMembre(beneficiaireId, personneId, roleId) {
	const { rows } = await db.query(
		`INSERT INTO accompagner (personne_id, beneficiaire_id, role_id)
		 VALUES ($1, $2, $3)
		 RETURNING personne_id, beneficiaire_id, role_id`,
		[personneId, beneficiaireId, roleId],
	);
	return rows[0];
}

export async function modifierRoleMembre(beneficiaireId, personneId, roleId) {
	const { rows } = await db.query(
		`UPDATE accompagner SET role_id = $3
		 WHERE personne_id = $1 AND beneficiaire_id = $2
		 RETURNING personne_id, beneficiaire_id, role_id`,
		[personneId, beneficiaireId, roleId],
	);
	return rows[0] ?? null;
}

export async function retirerMembre(beneficiaireId, personneId) {
	const { rows } = await db.query(
		`DELETE FROM accompagner
		 WHERE personne_id = $1 AND beneficiaire_id = $2
		 RETURNING personne_id`,
		[personneId, beneficiaireId],
	);
	return rows[0] ?? null;
}

// ---------------------------------------------------------------- création

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
			 RETURNING id, nom, prenom, TO_CHAR(date_naissance, 'YYYY-MM-DD') AS date_naissance, personne_id`,
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
