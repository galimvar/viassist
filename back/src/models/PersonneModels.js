import { db } from '../db.js';

// Les colonnes qu'on peut renvoyer au front : jamais le hash
const COLONNES_PUBLIQUES = 'id, nom, prenom, date_naissance, mail';

export async function trouverParMail(mail) {
  const { rows } = await db.query(
    `SELECT ${COLONNES_PUBLIQUES}, mot_de_passe_hash FROM personne WHERE mail = $1`,
    [mail]
  );
  return rows[0] ?? null;
}

export async function trouverParId(id) {
  const { rows } = await db.query(
    `SELECT ${COLONNES_PUBLIQUES} FROM personne WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function creer({ nom, prenom, date_naissance, mail, mot_de_passe_hash }) {
  const { rows } = await db.query(
    `INSERT INTO personne (nom, prenom, date_naissance, mail, mot_de_passe_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLONNES_PUBLIQUES}`,
    [nom, prenom, date_naissance, mail, mot_de_passe_hash]
  );
  return rows[0];
}