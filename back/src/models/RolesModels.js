import { db } from '../db.js';

export async function trouverRoles() {
	const { rows } = await db.query(`SELECT * FROM role ORDER BY id ASC`);
	return rows ?? null;
}
