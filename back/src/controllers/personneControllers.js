import * as personneService from '../services/personneServices.js';
import { ErreurHttp } from '../erreurs.js';


// ---------- Validation : la forme des données, avant toute règle métier ----------

// ---------- Les handlers : reçoivent la requête, appellent le service, répondent ----------
export async function getPersonneById(req, res) {
  const id = req.params.id;
  const personnes = await personneService.getUserProfile(id);
  res.json({ personnes });
}
