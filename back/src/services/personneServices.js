import bcrypt from 'bcryptjs';

import * as Personne from '../models/PersonneModels.js';
import { ErreurHttp } from '../erreurs.js';

const COUT_HASH = 10;

export async function getUserProfile(id) {
	const utilisateurs = await Personne.trouverParId(id);
	/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
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

export async function archiveUserProfile(id) {
	const utilisateurs = await Personne.archiverParId(id);
	/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
	return utilisateurs;
}
