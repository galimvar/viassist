import * as beneficiaireService from '../services/beneficiaireServices.js';
import { ErreurHttp } from '../erreurs.js';

const FORMAT_DATE = /^\d{4}-\d{2}-\d{2}$/;

// ---------- Validation : la forme des données, avant toute règle métier ----------
function validerBeneficiaire({ nom, prenom, date_naissance }) {
	const erreurs = {};
	if (typeof nom !== 'string' || nom.trim() === '') {
		erreurs.nom = 'Le nom est obligatoire';
	} else if (nom.trim().length > 50) {
		erreurs.nom = 'Le nom fait au maximum 50 caractères';
	}
	if (typeof prenom !== 'string' || prenom.trim() === '') {
		erreurs.prenom = 'Le prénom est obligatoire';
	} else if (prenom.trim().length > 50) {
		erreurs.prenom = 'Le prénom fait au maximum 50 caractères';
	}
	// Facultative, mais au format AAAA-MM-JJ si elle est fournie
	if (
		date_naissance !== undefined &&
		date_naissance !== null &&
		date_naissance !== '' &&
		(typeof date_naissance !== 'string' || !FORMAT_DATE.test(date_naissance))
	) {
		erreurs.date_naissance = "La date de naissance n'est pas au format AAAA-MM-JJ";
	}
	return erreurs;
}

const FORMAT_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validerRole(role_id, erreurs) {
	if (!Number.isInteger(role_id)) {
		erreurs.role_id = 'Le rôle est obligatoire (identifiant entier)';
	}
	return erreurs;
}

function validerNouveauMembre({ mail, role_id }) {
	const erreurs = {};
	if (typeof mail !== 'string' || !FORMAT_MAIL.test(mail.trim())) {
		erreurs.mail = "Le mail n'a pas un format valide";
	}
	return validerRole(role_id, erreurs);
}

// :personneId vient de l'URL, donc c'est une chaîne : même traitement que dans exigerRoleSur
function lirePersonneId(req) {
	const personneId = parseInt(req.params.personneId, 10);
	if (!Number.isInteger(personneId)) {
		throw new ErreurHttp(404, 'Membre introuvable');
	}
	return personneId;
}

// ---------- Les handlers : reçoivent la requête, appellent le service, répondent ----------

// GET /api/beneficiaires : les bénéficiaires de la personne connectée, avec son rôle chez chacun
export async function lister(req, res) {
	const beneficiaires = await beneficiaireService.listerPourPersonne(req.personne.id);
	res.json({ beneficiaires });
}

// POST /api/beneficiaires
export async function creer(req, res) {
	const body = req.body ?? {};
	const erreurs = validerBeneficiaire(body);
	if (Object.keys(erreurs).length > 0) {
		throw new ErreurHttp(422, 'Données invalides', erreurs);
	}

	const beneficiaire = await beneficiaireService.creer(
		{
			nom: body.nom.trim(),
			prenom: body.prenom.trim(),
			date_naissance: body.date_naissance || null,
		},
		req.personne.id,
	);
	res.status(201).json({ beneficiaire });
}

// GET /api/beneficiaires/:beneficiaireId
export async function fiche(req, res) {
	const beneficiaire = await beneficiaireService.fiche(req.acces.beneficiaireId);
	res.json({ beneficiaire, role_id: req.acces.role });
}

// PATCH /api/beneficiaires/:beneficiaireId   { nom, prenom, date_naissance? } (admin)
// Le formulaire renvoie toute la fiche : une date absente ou vide veut dire « effacer la date »
export async function modifierFiche(req, res) {
	const body = req.body ?? {};
	const erreurs = validerBeneficiaire(body);
	if (Object.keys(erreurs).length > 0) {
		throw new ErreurHttp(422, 'Données invalides', erreurs);
	}

	const beneficiaire = await beneficiaireService.modifierFiche(req.acces.beneficiaireId, {
		nom: body.nom.trim(),
		prenom: body.prenom.trim(),
		date_naissance: body.date_naissance || null,
	});
	res.json({ beneficiaire });
}

// ---------- Membres (réservé à l'admin du bénéficiaire) ----------

// GET /api/beneficiaires/:beneficiaireId/membres
export async function listerMembres(req, res) {
	const membres = await beneficiaireService.listerMembres(req.acces.beneficiaireId);
	res.json({ membres });
}

// POST /api/beneficiaires/:beneficiaireId/membres   { mail, role_id }
export async function ajouterMembre(req, res) {
	const body = req.body ?? {};
	const erreurs = validerNouveauMembre(body);
	if (Object.keys(erreurs).length > 0) {
		throw new ErreurHttp(422, 'Données invalides', erreurs);
	}

	const membre = await beneficiaireService.ajouterMembre(req.acces.beneficiaireId, {
		mail: body.mail.trim().toLowerCase(), // même format qu'en base (cf. authControllers)
		role_id: body.role_id,
	});
	res.status(201).json({ membre });
}

// PATCH /api/beneficiaires/:beneficiaireId/membres/:personneId   { role_id }
export async function modifierRoleMembre(req, res) {
	const personneId = lirePersonneId(req);
	const body = req.body ?? {};
	const erreurs = validerRole(body.role_id, {});
	if (Object.keys(erreurs).length > 0) {
		throw new ErreurHttp(422, 'Données invalides', erreurs);
	}

	const membre = await beneficiaireService.modifierRoleMembre(
		req.acces.beneficiaireId,
		personneId,
		body.role_id,
	);
	res.json({ membre });
}

// DELETE /api/beneficiaires/:beneficiaireId/membres/:personneId
export async function retirerMembre(req, res) {
	const personneId = lirePersonneId(req);
	await beneficiaireService.retirerMembre(req.acces.beneficiaireId, personneId);
	res.status(204).end();
}
