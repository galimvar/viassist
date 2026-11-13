import * as AgendaService from '../services/agendaServices.js';

export const getDay = async (req, res) => {
	const interval = Number(req.query.decalage ?? 0);
	if (!Number.isInteger(decalage)) {
		return res.status(400).json({ error: 'decalage doit être un entier' });
	}
	const day = await AgendaService.dayRequest(decalage);
	res.json(day);
};

export const getWeek = async (req, res) => {
	const decalage = Number(req.query.decalage ?? 0);
	if (!Number.isInteger(decalage)) {
		return res.status(400).json({ error: 'decalage doit être un entier' });
	}
	const week = await AgendaService.weekRequest(decalage);
	res.json(week);
};

export const getMonth = async (req, res) => {
	const decalage = Number(req.query.decalage ?? 0);
	if (!Number.isInteger(decalage)) {
		return res.status(400).json({ error: 'decalage doit être un entier' });
	}
	const month = await AgendaService.monthRequest(decalage);
	res.json(month);
};
