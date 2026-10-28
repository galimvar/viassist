import * as Personne from '../models/PersonneModels.js';
import { ErreurHttp } from '../erreurs.js';


export async function getUserProfile(id) {
  const utilisateurs = await Personne.findUserById(id);
/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
  return utilisateurs;
}
