// Appels à l'API des bénéficiaires et de leurs ressources (ADR 006).
// Tout ce qui concerne UN bénéficiaire est imbriqué sous /beneficiaires/:beneficiaireId/…
import { appeler } from './auth.js';

// appeler() envoie déjà l'en-tête Content-Type: application/json

// ---------------------------------------------------------------- bénéficiaires

// → { beneficiaires: [{ id, nom, prenom, date_naissance, personne_id, role_id, role }] }
export const recupererBeneficiaires = () => appeler('/beneficiaires');

// infos = { nom, prenom, date_naissance? (AAAA-MM-JJ) } → { beneficiaire }
export const creerBeneficiaire = (infos) =>
	appeler('/beneficiaires', { method: 'POST', body: JSON.stringify(infos) });

// Admin du bénéficiaire. infos = { nom, prenom, date_naissance } (date '' ou absente = effacée)
export const modifierBeneficiaire = (beneficiaireId, infos) =>
	appeler(`/beneficiaires/${beneficiaireId}`, { method: 'PATCH', body: JSON.stringify(infos) });

// ---------------------------------------------------------------- invitations reçues

// → { invitations: [{ id (du bénéficiaire), nom, prenom, role_id, role }] }
export const recupererInvitations = () => appeler('/invitations');

export const accepterInvitation = (beneficiaireId) =>
	appeler(`/invitations/${beneficiaireId}/accepter`, { method: 'POST' });

export const refuserInvitation = (beneficiaireId) =>
	appeler(`/invitations/${beneficiaireId}`, { method: 'DELETE' });

// ---------------------------------------------------------------- agenda et journal

export const getAgendaDay = (beneficiaireId, decalage) =>
	appeler(`/beneficiaires/${beneficiaireId}/agenda/jour?decalage=${decalage}`);

export const getAgendaWeek = (beneficiaireId, decalage) =>
	appeler(`/beneficiaires/${beneficiaireId}/agenda/semaine?decalage=${decalage}`);

export const getMessagesByDate = (beneficiaireId, date) =>
	appeler(`/beneficiaires/${beneficiaireId}/messages?date=${date}`);

// ---------------------------------------------------------------- membres (admin du bénéficiaire)

// → { membres: [{ id, nom, prenom, mail, telephone, role_id, role }] }
export const recupererMembres = (beneficiaireId) =>
	appeler(`/beneficiaires/${beneficiaireId}/membres`);

// Crée une INVITATION. infos = { mail, role_id } → 202 { message } identique que le mail existe ou non
export const inviterMembre = (beneficiaireId, infos) =>
	appeler(`/beneficiaires/${beneficiaireId}/membres`, {
		method: 'POST',
		body: JSON.stringify(infos),
	});

export const modifierRoleMembre = (beneficiaireId, personneId, role_id) =>
	appeler(`/beneficiaires/${beneficiaireId}/membres/${personneId}`, {
		method: 'PATCH',
		body: JSON.stringify({ role_id }),
	});

export const retirerMembre = (beneficiaireId, personneId) =>
	appeler(`/beneficiaires/${beneficiaireId}/membres/${personneId}`, { method: 'DELETE' });
