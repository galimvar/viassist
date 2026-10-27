import { db } from '../db.js';

// Les colonnes qu'on peut renvoyer au front : jamais le hash
const COLONNES_PUBLIQUES = 'id, nom, prenom, date_naissance, mail, role';

export async function listerAll() {
  const { rows } = await db.query(
    `SELECT ${COLONNES_PUBLIQUES} FROM personne WHERE id=1`
  );
  console.log(rows)
  return rows ?? null;
}
