import * as personneService from '../services/personneServices.js';
import { ErreurHttp } from '../erreurs.js';

const FORMAT_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONGUEUR_MIN_MOT_DE_PASSE = 8;
// ---------- Validation : la forme des données, avant toute règle métier ----------

function validerInscription({ nom, prenom, date_naissance, mail, mot_de_passe }) {
	const erreurs = {};
	if (typeof nom !== 'string' || nom.trim() === '') {
		erreurs.nom = 'Le nom est obligatoire';
	} else if (nom.trim().length > 100) {
		erreurs.nom = 'Le nom fait au maximum 100 caractères';
	}
	if (typeof prenom !== 'string' || prenom.trim() === '') {
		erreurs.prenom = 'Le prénom est obligatoire';
	} else if (prenom.trim().length > 100) {
		erreurs.prenom = 'Le prénom fait au maximum 100 caractères';
	}
	if (typeof date_naissance !== 'string' || date_naissance.trim() === '') {
		erreurs.date_naissance = 'La date de naissance est obligatoire';
	} else if (date_naissance.trim().length > 10) {
		erreurs.date_naissance = 'La date de naissance fait au maximum 10 caractères';
	}

	if (typeof mail !== 'string' || !FORMAT_MAIL.test(mail.trim())) {
		erreurs.mail = "L'mail n'a pas un format valide";
	}
	if (typeof mot_de_passe !== 'string' || mot_de_passe.length < LONGUEUR_MIN_MOT_DE_PASSE) {
		erreurs.mot_de_passe = `Le mot de passe fait au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères`;
	}
	return erreurs;
}

const normaliserMail = (mail) => mail.trim().toLowerCase();

// ---------- Les handlers : reçoivent la requête, appellent le service, répondent ----------

//-----------------------GET-------------------------//
export async function getPersonneById(req, res) {
	const id = req.params.id;
	const personnes = await personneService.getUserProfile(id);
	res.json({ personnes });
}

export async function getPersonneByMail(req, res) {
	const mail = req.params.mail;
	const personnes = await personneService.getUserProfileByMail(mail);
	res.json({ personnes });
}

export async function getAllPersonnes(req, res) {
	const personnes = await personneService.getAllUsers();
	res.json({ personnes });
}

//-----------------------POST-------------------------//
export async function postPersonne(req, res) {
	const body = req.body ?? {};
	const erreurs = validerInscription(body);
	if (Object.keys(erreurs).length > 0) {
		throw new ErreurHttp(422, 'Données invalides', erreurs);
	}

	const personne = await personneService.createUser({
		nom: body.nom.trim(),
		prenom: body.prenom.trim(),
		mail: normaliserMail(body.mail),
		date_naissance: body.date_naissance,
		mot_de_passe: body.mot_de_passe,
	});
	res.status(201).json({ personne });
}
