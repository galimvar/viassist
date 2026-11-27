import * as invitationService from '../services/invitationServices.js';
import { ErreurHttp } from '../erreurs.js';

// :beneficiaireId vient de l'URL, donc c'est une chaîne (même traitement que dans exigerRoleSur)
function lireBeneficiaireId(req) {
	const beneficiaireId = parseInt(req.params.beneficiaireId, 10);
	if (!Number.isInteger(beneficiaireId)) {
		throw new ErreurHttp(404, 'Invitation introuvable');
	}
	return beneficiaireId;
}

// GET /api/invitations : mes invitations en attente
export async function lister(req, res) {
	const invitations = await invitationService.lister(req.personne.id);
	res.json({ invitations });
}

// POST /api/invitations/:beneficiaireId/accepter
export async function accepter(req, res) {
	const invitation = await invitationService.accepter(req.personne.id, lireBeneficiaireId(req));
	res.json({ invitation });
}

// DELETE /api/invitations/:beneficiaireId : refuser
export async function refuser(req, res) {
	await invitationService.refuser(req.personne.id, lireBeneficiaireId(req));
	res.status(204).end();
}
