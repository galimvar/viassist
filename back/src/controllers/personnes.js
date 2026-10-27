import * as personneService from '../services/personne.js';
import { ErreurHttp } from '../erreurs.js';


// ---------- Validation : la forme des données, avant toute règle métier ----------

// ---------- Les handlers : reçoivent la requête, appellent le service, répondent ----------
export async function lister(req, res) {
  const personnes = await personneService.getAll();
  res.json({ personnes });
}
