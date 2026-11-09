import * as AgendaModels from '../models/AgendaModels.js';
//Checker les regles metiers

export const dayRequest = async (interval) => {
	const day = await AgendaModels.dayQuery(interval);

	return day;
};

export const dayRequestInterval = async (interval) => {
	const day = await AgendaModels.dayQueryInterval(interval);

	return day;
};

export const weekRequest = async (interval) => {
	const week = AgendaModels.weekQuery(interval);

	return week;
};

export const monthRequest = async (interval) => {
	const month = AgendaModels.monthQuery(interval);

	return month;
};
