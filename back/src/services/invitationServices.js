import * as Beneficiaire from '../models/BeneficiaireModels.js';
import { ErreurHttp } from '../erreurs.js';

// Une personne ne voit et ne traite que SES invitations : personneId vient toujours du jeton

export async function lister(personneId) {
	return Beneficiaire.listerInvitations(personneId);
}

export async function accepter(personneId, beneficiaireId) {
	const lien = await Beneficiaire.accepterInvitation(personneId, beneficiaireId);
	if (!lien) {
		// Pas d'invitation en attente : jamais invitée, déjà acceptée, refusée ou bénéficiaire archivé
		throw new ErreurHttp(404, 'Invitation introuvable');
	}
	return lien;
}

export async function refuser(personneId, beneficiaireId) {
	const lien = await Beneficiaire.refuserInvitation(personneId, beneficiaireId);
	if (!lien) {
		throw new ErreurHttp(404, 'Invitation introuvable');
	}
}
