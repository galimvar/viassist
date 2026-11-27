import * as Beneficiaire from '../models/BeneficiaireModels.js';
import * as Personne from '../models/PersonneModels.js';
import { ROLES } from '../constantes/roles.js';
import { ErreurHttp } from '../erreurs.js';

// Le rôle « bénéficiaire » est réservé au compte lié (beneficiaire.personne_id, ADR 006) :
// un admin ne peut attribuer que ceux-là
const ROLES_ATTRIBUABLES = [ROLES.ADMIN, ROLES.INVITE, ROLES.PROCHE, ROLES.INTERVENANT];

export async function listerPourPersonne(personneId) {
	return Beneficiaire.trouverParPersonne(personneId);
}

// Règle métier (ADR 006) : la personne qui crée un bénéficiaire en devient admin
export async function creer(infos, personneId) {
	return Beneficiaire.creerAvecAdmin(infos, personneId, ROLES.ADMIN);
}

export async function fiche(beneficiaireId) {
	const beneficiaire = await Beneficiaire.trouverParId(beneficiaireId);
	if (!beneficiaire) {
		throw new ErreurHttp(404, 'Bénéficiaire introuvable');
	}
	return beneficiaire;
}

// Fiche du bénéficiaire (pas les comptes des membres : un compte est partagé entre bénéficiaires)
export async function modifierFiche(beneficiaireId, infos) {
	const beneficiaire = await Beneficiaire.modifier(beneficiaireId, infos);
	if (!beneficiaire) {
		throw new ErreurHttp(404, 'Bénéficiaire introuvable');
	}
	return beneficiaire;
}

// ---------------------------------------------------------------- membres

export async function listerMembres(beneficiaireId) {
	return Beneficiaire.listerMembres(beneficiaireId);
}

/**
 * Invite une personne (compte existant) : elle devra ACCEPTER avant d'avoir le moindre accès.
 * Ne renvoie rien et ne lève rien selon que le mail existe, est déjà membre ou déjà invité :
 * l'appelant reçoit toujours la même réponse, ce qui empêche de deviner quels mails sont inscrits.
 */
export async function inviterMembre(beneficiaireId, { mail, role_id }) {
	verifierRoleAttribuable(role_id);

	const personne = await Personne.trouverParMail(mail);
	if (personne) {
		await Beneficiaire.inviter(beneficiaireId, personne.id, role_id);
	}
}

export async function modifierRoleMembre(beneficiaireId, personneId, role_id) {
	verifierRoleAttribuable(role_id);
	const roleActuel = await roleModifiable(beneficiaireId, personneId);

	await verifierQuIlResteUnAdmin(beneficiaireId, roleActuel, role_id);

	return Beneficiaire.modifierRoleMembre(beneficiaireId, personneId, role_id);
}

export async function retirerMembre(beneficiaireId, personneId) {
	const roleActuel = await roleModifiable(beneficiaireId, personneId);

	// null = la personne n'aura plus aucun rôle chez ce bénéficiaire
	await verifierQuIlResteUnAdmin(beneficiaireId, roleActuel, null);

	await Beneficiaire.retirerMembre(beneficiaireId, personneId);
}

// ---------------------------------------------------------------- règles

function verifierRoleAttribuable(role_id) {
	if (!ROLES_ATTRIBUABLES.includes(role_id)) {
		throw new ErreurHttp(422, 'Données invalides', {
			role_id: 'Rôle invalide (le rôle « bénéficiaire » ne peut pas être attribué)',
		});
	}
}

// Rôle actuel du membre, s'il existe et si on a le droit d'y toucher
async function roleModifiable(beneficiaireId, personneId) {
	const roleActuel = await Beneficiaire.trouverRoleDe(personneId, beneficiaireId);
	if (roleActuel === null) {
		throw new ErreurHttp(404, 'Membre introuvable');
	}
	if (roleActuel === ROLES.BENEFICIAIRE) {
		throw new ErreurHttp(422, 'Le compte du bénéficiaire ne peut être ni modifié ni retiré');
	}
	return roleActuel;
}

/**
 * Règle métier (ADR 006) : un bénéficiaire garde toujours au moins un admin.
 * Lève une ErreurHttp 409 si le changement demandé retirerait le DERNIER admin.
 *
 * @param {number} beneficiaireId
 * @param {number} roleActuel   rôle du membre AVANT le changement
 * @param {number|null} nouveauRole rôle APRÈS le changement (null = membre retiré)
 */
async function verifierQuIlResteUnAdmin(beneficiaireId, roleActuel, nouveauRole) {
	if (roleActuel !== ROLES.ADMIN || nouveauRole === ROLES.ADMIN) {
		return;
	}

	const nombreAdmins = await Beneficiaire.compterParRole(beneficiaireId, ROLES.ADMIN);
	if (nombreAdmins <= 1) {
		throw new ErreurHttp(409, 'Il doit toujours y avoir au moins un admin.');
	}
}
