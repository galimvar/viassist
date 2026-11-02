import { db } from '../db.js';

// Les colonnes qu'on peut renvoyer au front : jamais le hash
const COLONNES_PUBLIQUES = 'id, nom, prenom, date_naissance, mail, role';

export async function findUserById(id) {
  const { rows } = await db.query(
    `SELECT ${COLONNES_PUBLIQUES} FROM personne WHERE id=$1`, [id]
  );

  return rows ?? null;
}


export async function findUserByMail(mail) {
  const { rows } = await db.query(
    `SELECT ${COLONNES_PUBLIQUES} FROM personne WHERE mail=$1`, [mail]
  );

  return rows[0] ?? null;
}

export async function insertUser(nom, prenom, date_naissance, mail, role, mot_de_passe){
  const {rows} = await db.query(
    `INSERT INTO personne (nom, prenom, date_naissance, mail, role, mot_de_passe_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${COLONNES_PUBLIQUES}`, [nom, prenom, date_naissance, mail, role, mot_de_passe]
  )

  return rows;
}