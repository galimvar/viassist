import { Router } from 'express';
import { pool } from './..services/db.js';

export const agendaRoute = Router();

agendaRoute.get('/jour', async (req, res) => {
	const { rows } = await pool.query(`
        SELECT * 
        FROM evenement
        WHERE date_debut = "2026-11-08"
        `);

	res.status(200).json(rows);
});
