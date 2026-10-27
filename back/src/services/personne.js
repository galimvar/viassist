import * as Personne from '../models/Personne.js';
import { ErreurHttp } from '../erreurs.js';


export async function getAll() {
  const utilisateurs = await Personne.listerAll();
/*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
  return utilisateurs;
}
