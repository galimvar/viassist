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

export async function creer({ nom, prenom, date_naissance, mail, mot_de_passe_hash, role_id }) {
  const { rows } = await db.query(
    `INSERT INTO personne (nom, prenom, date_naissance, mail, mot_de_passe_hash, role_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${COLONNES_PUBLIQUES}`,
    [nom, prenom, date_naissance, mail, mot_de_passe_hash, role_id]
  );
  return rows[0];
}

export async function trouverRole(role){
  const {rows} = await db.query(
    `SELECT id FROM role WHERE intitule = $1`,
    [role]
  );
  return rows[0];
}