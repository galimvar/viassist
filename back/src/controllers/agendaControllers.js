import * as AgendaService from '../services/agendaServices.js';

export const getDay = async (req, res) => {
	const interval = Number(req.query.interval ?? 0);
	if (!Number.isInteger(interval)) {
		return res.status(400).json({ error: 'interval doit être un entier' });
	}
	const day = await AgendaService.dayRequest(interval);
	res.json(day);
};

export const getWeek = async (req, res) => {
	const interval = Number(req.query.interval ?? 0);
	if (!Number.isInteger(interval)) {
		return res.status(400).json({ error: 'interval doit être un entier' });
	}
	const week = await AgendaService.weekRequest(interval);
	res.json(week);
};

export const getMonth = async (req, res) => {
	const interval = Number(req.query.interval ?? 0);
	if (!Number.isInteger(interval)) {
		return res.status(400).json({ error: 'interval doit être un entier' });
	}
	const month = await AgendaService.monthRequest(interval);
	res.json(month);
};
