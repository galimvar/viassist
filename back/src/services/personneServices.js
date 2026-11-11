import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import * as Personne from '../models/PersonneModels.js';
import { ErreurHttp } from '../erreurs.js';
import * as Personne from '../models/PersonneModels.js';
import { ErreurHttp } from '../erreurs.js';

const COUT_HASH = 10;
const DUREE_SESSION = '2h';

export async function getUserProfile(id) {
	const utilisateurs = await Personne.trouverParId(id);
	/*   if (!utilisateurs) {
	const utilisateurs = await Personne.trouverParId(id);
	/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
	return utilisateurs;
	return utilisateurs;
}

export async function getAllUsers() {
	const utilisateurs = await Personne.trouverTous();
	/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
	return utilisateurs;
}

export async function getUserProfileByMail(mail) {
	const utilisateurs = await Personne.trouverParMail(mail);
	/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
	return utilisateurs;
}

export async function createUser(personne) {
	const existante = await Personne.trouverParMail(personne.mail);
	if (existante) {
		throw new ErreurHttp(409, 'Un compte existe déjà avec cet email');
	}

	const role_id = await Personne.trouverRole(personne.role).id;

	const mot_de_passe_hash = await bcrypt.hash(personne.mot_de_passe, COUT_HASH);
	try {
		return await Personne.creer(
			personne.nom,
			personne.prenom,
			personne.date_naissance,
			personne.mail,
			mot_de_passe_hash,
			role_id,
		);
	} catch (erreur) {
		// 23505 = violation de UNIQUE : deux inscriptions au même instant
		if (erreur.code === '23505') {
			throw new ErreurHttp(409, 'Un compte existe déjà avec cet email');
		}
		throw erreur;
	}
}

export async function modifierUser(personne) {
	const {
		id,
		nom,
		prenom,
		date_naissance,
		mail,
		ancien_mot_de_passe,
		nouveau_mot_de_passe,
		confirmation_mot_de_passe,
	} = personne;

	const donneesAEnvoyer = { nom, prenom, mail, date_naissance };

	if (nouveau_mot_de_passe) {
		if (!ancien_mot_de_passe) {
			throw new ErreurHttp(400, 'Ancien mot de passe requis');
		}
		if (nouveau_mot_de_passe !== confirmation_mot_de_passe) {
			throw new ErreurHttp(400, "Le mot de passe n'est pas identique");
		}

		const user = await Personne.trouverAvecHashParId(id);
		if (!user) {
			throw new ErreurHttp(404, 'utilisateur introuvable');
		}

		const ancienOk = await bcrypt.compare(ancien_mot_de_passe, user.mot_de_passe_hash);
		if (!ancienOk) {
			throw new ErreurHttp(400, 'Ancien mot de passe incorrect');
		}

		donneesAEnvoyer.mot_de_passe_hash = await bcrypt.hash(nouveau_mot_de_passe, COUT_HASH);
	}

	let userModifie;
	try {
		userModifie = await Personne.updateUser(id, donneesAEnvoyer);
	} catch (erreur) {
		if (erreur.code === '23505') {
			throw new ErreurHttp(409, 'Un compte existe déjà avec cet email');
		}
		throw erreur;
	}

	if (!userModifie) {
		throw new ErreurHttp(404, 'Utilisateur introuvable');
	}

	return userModifie;
}
