import express from 'express';
import { pool } from '../db.js';

export const testRouter = express.Router();

testRouter.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT 1');
    res.status(200).json(rows);
})