import { db } from '../db.js';

// date_naissance renvoyée en TEXTE 'AAAA-MM-JJ' : sinon pg la convertit en Date JavaScript à minuit
// heure locale, que res.json écrit en UTC… soit la veille (1941-03-14 → "1941-03-13T22:00:00.000Z")
const DATE_NAISSANCE = `TO_CHAR(b.date_naissance, 'YYYY-MM-DD') AS date_naissance`;
const COLONNES_PUBLIQUES = `b.id, b.nom, b.prenom, ${DATE_NAISSANCE}, b.personne_id`;

// Statuts d'un lien accompagner (cf. migration 006) : une invitation ne donne AUCUN accès
// tant qu'elle n'est pas acceptée par la personne invitée.
const ACCEPTE = 'accepte';
const EN_ATTENTE = 'en_attente';

/**
 * Rôle d'une personne chez un bénéficiaire : c'est sur lui que repose tout le contrôle d'accès
 * (middleware exigerRoleSur, règles des membres).
 *
 * Un rôle n'est renvoyé que si les TROIS conditions sont réunies :
 *   - le bénéficiaire n'est pas archivé ;
 *   - le lien accompagner est ACCEPTÉ (une invitation en attente ne donne aucun droit) ;
 *   - le compte de la personne n'est pas archivé (un compte archivé perd tous ses accès,
 *     même si son jeton est encore valide).
 *
 * @returns {Promise<number|null>} role_id, ou null si l'une des conditions manque
 */
export async function trouverRoleDe(personneId, beneficiaireId) {
	const { rows } = await db.query(
		`
		SELECT a.role_id 
		FROM accompagner a 
		JOIN beneficiaire b 
		ON a.beneficiaire_id = b.id 
		JOIN personne p 
		ON p.id = a.personne_id 
		WHERE a.personne_id = $1 
		AND b.est_archive = false 
		AND p.est_archive = false
		AND a.statut=$2 AND b.id = $3`,
		[personneId, ACCEPTE, beneficiaireId],
	);

	return rows[0]?.role_id ?? null;
}

// Les bénéficiaires qu'une personne accompagne (liens acceptés), avec son rôle chez chacun
export async function trouverParPersonne(personneId) {
	const { rows } = await db.query(
		`SELECT ${COLONNES_PUBLIQUES}, a.role_id, r.intitule AS role
		 FROM accompagner a
		 JOIN beneficiaire b ON b.id = a.beneficiaire_id
		 JOIN role r ON r.id = a.role_id
		 WHERE a.personne_id = $1 AND a.statut = $2 AND b.est_archive = false
		 ORDER BY b.nom, b.prenom`,
		[personneId, ACCEPTE],
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

// Membres ayant ACCEPTÉ (les invitations en attente n'apparaissent pas), comptes actifs seulement.
// Pas de téléphone : le front ne l'affiche pas (minimisation des données, RGPD).
export async function listerMembres(beneficiaireId) {
	const { rows } = await db.query(
		`SELECT p.id, p.nom, p.prenom, p.mail, a.role_id, r.intitule AS role
		 FROM accompagner a
		 JOIN personne p ON p.id = a.personne_id
		 JOIN role r ON r.id = a.role_id
		 WHERE a.beneficiaire_id = $1 AND a.statut = $2 AND p.est_archive = false
		 ORDER BY a.role_id, p.nom, p.prenom`,
		[beneficiaireId, ACCEPTE],
	);
	return rows;
}

// Nombre de membres (liens acceptés, comptes actifs) qui ont ce rôle chez ce bénéficiaire
export async function compterParRole(beneficiaireId, roleId) {
	const { rows } = await db.query(
		`SELECT count(*)::int AS nombre
		 FROM accompagner a
		 JOIN personne p ON p.id = a.personne_id
		 WHERE a.beneficiaire_id = $1 AND a.role_id = $2 AND a.statut = $3
		   AND p.est_archive = false`,
		[beneficiaireId, roleId, ACCEPTE],
	);
	return rows[0].nombre; // ::int : sinon pg renvoie count(*) en chaîne (bigint)
}

// Crée une invitation EN ATTENTE. ON CONFLICT DO NOTHING : si la personne est déjà membre
// ou déjà invitée, rien ne change et rien n'est signalé (réponse identique pour l'appelant).
export async function inviter(beneficiaireId, personneId, roleId) {
	await db.query(
		`INSERT INTO accompagner (personne_id, beneficiaire_id, role_id, statut)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (personne_id, beneficiaire_id) DO NOTHING`,
		[personneId, beneficiaireId, roleId, EN_ATTENTE],
	);
}

// ---------------------------------------------------------------- invitations (côté personne invitée)

// Invitations EN ATTENTE d'une personne : le bénéficiaire et le rôle proposé
export async function listerInvitations(personneId) {
	const { rows } = await db.query(
		`SELECT b.id, b.nom, b.prenom, a.role_id, r.intitule AS role
		 FROM accompagner a
		 JOIN beneficiaire b ON b.id = a.beneficiaire_id
		 JOIN role r ON r.id = a.role_id
		 WHERE a.personne_id = $1 AND a.statut = $2 AND b.est_archive = false
		 ORDER BY b.nom, b.prenom`,
		[personneId, EN_ATTENTE],
	);
	return rows;
}

/**
 * La personne accepte SA propre invitation : le lien passe de « en attente » à « accepté ».
 * Ne doit toucher QUE une invitation en attente, de CETTE personne, chez un bénéficiaire non archivé.
 *
 * @returns {Promise<{personne_id: number, beneficiaire_id: number, role_id: number}|null>}
 *          le lien accepté, ou null s'il n'y avait pas d'invitation en attente à accepter
 */
export async function accepterInvitation(personneId, beneficiaireId) {
	const { rows } = await db.query(
		`UPDATE accompagner a
		SET statut=$1
		FROM beneficiaire b
		WHERE b.id = a.beneficiaire_id 
		AND a.personne_id = $2 
		AND a.beneficiaire_id = $3 
		AND a.statut = $4 
		AND b.est_archive = false
		RETURNING a.personne_id, a.beneficiaire_id, a.role_id`,
		[ACCEPTE, personneId, beneficiaireId, EN_ATTENTE],
	);
	return rows[0] ?? null;
}

// Refuser = supprimer l'invitation (seulement si elle est encore en attente)
export async function refuserInvitation(personneId, beneficiaireId) {
	const { rows } = await db.query(
		`DELETE FROM accompagner
		 WHERE personne_id = $1 AND beneficiaire_id = $2 AND statut = $3
		 RETURNING personne_id`,
		[personneId, beneficiaireId, EN_ATTENTE],
	);
	return rows[0] ?? null;
}

// Seulement sur un lien accepté : une invitation en attente ne se modifie pas
export async function modifierRoleMembre(beneficiaireId, personneId, roleId) {
	const { rows } = await db.query(
		`UPDATE accompagner SET role_id = $3
		 WHERE personne_id = $1 AND beneficiaire_id = $2 AND statut = $4
		 RETURNING personne_id, beneficiaire_id, role_id`,
		[personneId, beneficiaireId, roleId, ACCEPTE],
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
		// Le créateur n'a pas à accepter sa propre invitation : lien directement accepté
		await client.query(
			`INSERT INTO accompagner (personne_id, beneficiaire_id, role_id, statut)
			 VALUES ($1, $2, $3, $4)`,
			[personneId, beneficiaire.id, roleId, ACCEPTE],
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
