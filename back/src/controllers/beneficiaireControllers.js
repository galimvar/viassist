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
