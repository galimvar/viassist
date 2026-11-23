import * as Beneficiaire from '../models/BeneficiaireModels.js';
import { ROLES } from '../constantes/roles.js';
import { ErreurHttp } from '../erreurs.js';

export async function listerPourPersonne(personneId) {
	return Beneficiaire.trouverParPersonne(personneId);
}

// Règle métier (ADR 006) : la personne qui crée un bénéficiaire en devient admin
export async function creer(infos, personneId) {
	return Beneficiaire.creerAvecAdmin(infos, personneId, ROLES.ADMIN);
}

export async function fiche(beneficiaireId) {
	const beneficiaire = await Beneficiaire.trouverParId(beneficiaireId);
	if (!beneficiaire) {
		throw new ErreurHttp(404, 'Bénéficiaire introuvable');
	}
	return beneficiaire;
}
