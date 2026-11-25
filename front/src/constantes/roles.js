//! WARNING A MODIFIER SI LES ROLES CHANGENT EN BASE DE DONNEES !!

export const ROLES = Object.freeze({
	ADMIN: 1,
	INVITE: 2,
	PROCHE: 3,
	INTERVENANT: 4,
	BENEFICIAIRE: 5,
});

// Rôles autorisés CHEZ le bénéficiaire actif : mêmes listes que dans back/src/routes
export const AGENDA_ROLES = Object.freeze([ROLES.ADMIN, ROLES.PROCHE, ROLES.BENEFICIAIRE]);

export const JOURNAL_ROLES = Object.freeze([
	ROLES.ADMIN,
	ROLES.PROCHE,
	ROLES.INTERVENANT,
	ROLES.BENEFICIAIRE,
]);

// Intitulé de la table role → « en tant qu'admin », « en tant que proche »
// (élision devant une voyelle : admin, invité, intervenant)
export function enTantQue(intitule) {
	return /^[aeiouyéèê]/i.test(intitule) ? `en tant qu'${intitule}` : `en tant que ${intitule}`;
}
