import * as AgendaModels from '../models/AgendaModels.js';
//Checker les regles metiers

export const dayRequest = async (decalage, beneficiaireId) => {
	const day = await AgendaModels.dayQuery(decalage, beneficiaireId);

	return day;
};

export const weekRequest = async (decalage, beneficiaireId) => {
	const week = AgendaModels.weekQuery(decalage, beneficiaireId);

	return week;
};

export const monthRequest = async (decalage, beneficiaireId) => {
	const month = AgendaModels.monthQuery(decalage, beneficiaireId);

	return month;
};
