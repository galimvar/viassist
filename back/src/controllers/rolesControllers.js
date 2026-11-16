import * as rolesServices from '../services/rolesServices.js';

export async function getRoles(req, res) {
	const roles = await rolesServices.getRoles();
	res.json({ roles });
}
