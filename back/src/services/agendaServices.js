import * as AgendaModels from '../models/AgendaModels.js';
//Checker les regles metiers

export const dayRequest = async (decalage) => {
	const day = await AgendaModels.dayQuery(decalage);

	return day;
};

export const weekRequest = async (decalage) => {
	const week = AgendaModels.weekQuery(decalage);

	return week;
};

export const monthRequest = async (decalage) => {
	const month = AgendaModels.monthQuery(decalage);

	return month;
};
