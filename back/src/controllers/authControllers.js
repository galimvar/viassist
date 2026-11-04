import * as authService from '../services/authServices.js';
import { ErreurHttp } from '../erreurs.js';

const FORMAT_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMAT_DATE_NAISSANCE = /^\d{4}\/\d{2}\/\d{2}$/m;
const LONGUEUR_MIN_MOT_DE_PASSE = 8;
const DUREE_COOKIE_MS = 2 * 60 * 60 * 1000;   // 2 h, comme le token

// ---------- Validation : la forme des données, avant toute règle métier ----------
function validerInscription({ nom, prenom, mail,date_naissance, mot_de_passe }) {
  const erreurs = {};
  if (typeof nom !== 'string' || nom.trim() === '') {
    erreurs.nom = 'Le nom est obligatoire';
  } else if (nom.trim().length > 50) {
    erreurs.nom = 'Le nom fait au maximum 50 caractères';
  }

  if (typeof prenom !== 'string' || prenom.trim() === '') {
    erreurs.prenom = 'Le prénom est obligatoire';
  } else if (prenom.trim().length > 50) {
    erreurs.prenom = 'Le prénom fait au maximum 50 caractères';
  }
  if (typeof mail !== 'string' || !FORMAT_MAIL.test(mail.trim())) {
    erreurs.mail = "Le mail n'a pas un format valide";
  }

  if (typeof date_naissance !== 'string' || date_naissance.trim() === '') {
    erreurs.date_naissance = "La date de naissance est obligatoire";
  } else if (!FORMAT_DATE_NAISSANCE.test(date_naissance.trim())){
    erreurs.date_naissance = "La date de naissance n'est pas au format YYYY/MM/DD"
  }

  if (typeof mot_de_passe !== 'string' || mot_de_passe.length < LONGUEUR_MIN_MOT_DE_PASSE) {
    erreurs.mot_de_passe = `Le mot de passe fait au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères`;
  }
  return erreurs;
}

// Toujours le même format de mail en base : sans espaces, en minuscules
const normalisermail = (mail) => mail.trim().toLowerCase();

// ---------- Les handlers : reçoivent la requête, appellent le service, répondent ----------
export async function inscription(req, res) {
  const body = req.body ?? {};
  const erreurs = validerInscription(body);
  if (Object.keys(erreurs).length > 0) {
    throw new ErreurHttp(422, 'Données invalides', erreurs);
  }

  const personne = await authService.inscrire({
    nom: body.nom.trim(),
    prenom: body.prenom.trim(),
    date_naissance: body.date_naissance.trim(),
    mail: normalisermail(body.mail),
    mot_de_passe: body.mot_de_passe,
    role: body.role
  });
  res.status(201).json({ personne });
}

function validerConnexion({ mail, mot_de_passe }) {
  const erreurs = {};
  if (typeof mail !== 'string' || mail.trim() === '') erreurs.mail = "L'mail est obligatoire";
  if (typeof mot_de_passe !== 'string' || mot_de_passe === '') erreurs.mot_de_passe = 'Le mot de passe est obligatoire';
  return erreurs;
}

export async function connexion(req, res) {
  const body = req.body ?? {};
  const erreurs = validerConnexion(body);
  if (Object.keys(erreurs).length > 0) {
    throw new ErreurHttp(422, 'Données invalides', erreurs);
  }

  const { personne, token } = await authService.connecter({
    mail: normalisermail(body.mail),
    mot_de_passe: body.mot_de_passe,
  });

  // Le token voyage dans un cookie httpOnly : le JavaScript du navigateur ne peut pas le lire
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DUREE_COOKIE_MS,
  });
  res.json({ personne });
}

export async function deconnexion(req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.status(204).end();
}

export async function moi(req, res) {
  const personne = await authService.profil(req.personne.id);
  res.json({ personne });
}