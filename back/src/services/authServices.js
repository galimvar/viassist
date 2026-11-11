import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as Personne from '../models/PersonneModels.js';
import { ErreurHttp } from '../erreurs.js';

const COUT_HASH = 10; // plus c'est haut, plus c'est lent (et sûr)
const DUREE_SESSION = '2h';
const LONGUEUR_MIN_MOT_DE_PASSE = 8;

const validerInscription = (mot_de_passe) => {
	const erreurs = {};

	if (typeof mot_de_passe !== 'string' || mot_de_passe.length < LONGUEUR_MIN_MOT_DE_PASSE) {
		erreurs.mot_de_passe = `Le mot de passe fait au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères`;
	}

	return erreurs;
};

export async function inscrire({ nom, prenom, date_naissance, mail, mot_de_passe, role }) {
	// Règle métier : un mail ne sert qu'à un seul compte
	const existante = await Personne.trouverParMail(mail);
	if (existante) {
		throw new ErreurHttp(409, 'Un compte existe déjà avec cet mail');
	}
	const erreurs = validerInscription(mot_de_passe);
	if (Object.keys(erreurs).length > 0) {
		throw new ErreurHttp(422, 'Données invalides', erreurs);
	}

	const role_id = await Personne.trouverRole(role);

	const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, COUT_HASH);

	try {
		return await Personne.creer({
			nom: nom,
			prenom: prenom,
			date_naissance: date_naissance,
			mail: mail,
			mot_de_passe_hash: mot_de_passe_hash,
			role_id: role_id.id,
		});
	} catch (erreur) {
		// 23505 = violation de UNIQUE : deux inscriptions au même instant
		if (erreur.code === '23505') {
			throw new ErreurHttp(409, 'Un compte existe déjà avec cet email');
		}
		throw erreur;
	}
}

export async function connecter({ mail, mot_de_passe }) {
	const personne = await Personne.trouverParMail(mail);
	if (!personne) {
		throw new ErreurHttp(404, 'mail ou mot de passe incorrect');
	}
	// Même message que le mail existe ou non : on ne dit pas quels mails sont inscrits
	const correct =
		personne?.mot_de_passe_hash &&
		(await bcrypt.compare(mot_de_passe, personne.mot_de_passe_hash));
	if (!correct) {
		throw new ErreurHttp(401, 'mail ou mot de passe incorrect');
	}

	const token = jwt.sign({ sub: personne.id, role: personne.role_id }, process.env.JWT_SECRET, {
		expiresIn: DUREE_SESSION,
	});

	const { mot_de_passe_hash, ...personnePublic } = personne;
	return { personne: personnePublic, token };
}

export async function profil(id) {
	const personne = await Personne.trouverParId(id);
	if (!personne) {
		throw new ErreurHttp(401, 'Session invalide');
	}
	return personne;
}
