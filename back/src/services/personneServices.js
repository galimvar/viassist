import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as Personne from "../models/PersonneModels.js";
import { ErreurHttp } from "../erreurs.js";

const COUT_HASH = 10;
const DUREE_SESSION = "2h";

export async function getUserProfile(id) {
    const utilisateurs = await Personne.trouverParId(id);
    /*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
    return utilisateurs;
}

export async function getUserProfileByMail(mail) {
    const utilisateurs = await Personne.trouverParMail(mail);
    /*   if (!utilisateurs) {
    throw new ErreurHttp(401, 'Session invalide');
  } */
    return utilisateurs;
}

export async function createUser(personne) {
    const existante = await Personne.trouverParMail(personne.mail);
    if (existante) {
        throw new ErreurHttp(409, "Un compte existe déjà avec cet email");
    }

    const mot_de_passe_hash = await bcrypt.hash(personne.mot_de_passe, COUT_HASH);
    try {
        return await Personne.insertUser(
            personne.nom,
            personne.prenom,
            personne.date_naissance,
            personne.mail,
            personne.role,
            mot_de_passe_hash,
        );
    } catch (erreur) {
        // 23505 = violation de UNIQUE : deux inscriptions au même instant
        if (erreur.code === "23505") {
            throw new ErreurHttp(409, "Un compte existe déjà avec cet email");
        }
        throw erreur;
    }
}
