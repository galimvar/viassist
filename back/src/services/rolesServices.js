import * as Roles from '../models/RolesModels.js';

export async function getRoles() {
	const roles = await Roles.trouverRoles();
	/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
	return roles;
}
