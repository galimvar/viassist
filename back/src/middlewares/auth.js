import jwt from 'jsonwebtoken';
import { ErreurHttp } from '../erreurs.js';
// Exception assumée à l'ADR 004 (cf. ADR 006) : le contrôle d'accès est transverse, il lit le modèle directement
import * as Beneficiaire from '../models/BeneficiaireModels.js';

// Qui es-tu ? Remplit req.personne
export function auth(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		throw new ErreurHttp(401, 'Connexion requise');
	}

	let contenu;
	try {
		contenu = jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		throw new ErreurHttp(401, 'Session expirée ou invalide');
	}

	// Plus de rôle ici : il dépend du bénéficiaire, c'est exigerRoleSur qui le lit
	req.personne = { id: contenu.sub };
	next();
}

/**
 * Que peux-tu faire chez CE bénéficiaire ? À placer après `auth`, sur une route qui a :beneficiaireId.
 * Remplit req.acces = { beneficiaireId, role } (deux nombres) pour les contrôleurs.
 *
 * - la personne n'accompagne pas ce bénéficiaire (ou il n'existe pas) → 404
 * - elle l'accompagne, mais avec un rôle non autorisé                  → 403
 *
 * @param  {...number} rolesAutorises ROLES.ADMIN, ROLES.PROCHE, ROLES.INVITE, ROLES.INTERVENANT, ROLES.BENEFICIAIRE
 */
export function exigerRoleSur(...rolesAutorises) {
	// Vérifié une seule fois, au démarrage du serveur : une erreur de déclaration de route plante tout de suite
	if (rolesAutorises.length === 0 || !rolesAutorises.every(Number.isInteger)) {
		throw new TypeError(
			'exigerRoleSur : fournir au moins un rôle, et uniquement des entiers (ex. exigerRoleSur(ROLES.ADMIN, ROLES.PROCHE)).',
		);
	}

	// async : Express 5 transmet tout seul une promesse rejetée (ErreurHttp lancée) au gestionnaire d'erreurs
	return async function verifierAcces(req, res, next) {
		const beneficiaireId = parseInt(req.params.beneficiaireId, 10);
		if (!Number.isInteger(beneficiaireId)) {
			throw new ErreurHttp(404, 'Bénéficiaire introuvable');
		}

		const role = await Beneficiaire.trouverRoleDe(req.personne.id, beneficiaireId);

		if (role === null) {
			throw new ErreurHttp(404, 'Bénéficiaire introuvable');
		}

		if (!rolesAutorises.includes(role)) {
			throw new ErreurHttp(403, 'Droits insuffisants');
		}

		req.acces = { beneficiaireId, role };
		next();
	};
}
