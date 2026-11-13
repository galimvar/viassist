import jwt from 'jsonwebtoken';
import { ErreurHttp } from '../erreurs.js';

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

	req.personne = { id: contenu.sub, role: contenu.role };
	next();
}
/**
 * La fonction exigerRole reçoit en paramètre un ou plusieurs id de roles autorisés sur la route (séparés par une virgule), et compare le role de l'utilisateur actuel avec cette liste.
 * @param  {...int} rolesAutorises ROLE.ADMIN, ROLE.PROCHE, ROLE.INVITE, ROLE.INTERVENANT, ROLE.BENEFICIAIRE
 *
 * @returns autorisation ou erreur si le role n'est pas autorisé par la route
 */
export function exigerRole(...rolesAutorises) {
	if (rolesAutorises.length === 0 || !rolesAutorises.every(Number.isInteger)) {
		throw new TypeError(
			'exigerRole : fournir au moins un rôle, et uniquement des entiers (ex. exigerRole(ROLES.ADMIN, ROLES.INTERVENANT)).',
		);
	}
	return function authRole(req, res, next) {
		if (!rolesAutorises.includes(req.personne.role)) {
			throw new ErreurHttp(403, 'Droits insuffisants');
		}
		next();
	};
}
