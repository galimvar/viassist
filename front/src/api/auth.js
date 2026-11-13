// Tous les appels à l'API d'authentification, au même endroit.
// Chaque fonction renvoie les données, ou lance une erreur qui porte le status et les erreurs par champ.

export async function appeler(chemin, options = {}) {
	const res = await fetch(`/api${chemin}`, {
		headers: { 'Content-Type': 'application/json' },
		...options,
	});
	if (res.status === 204) return null;
	const donnees = await res.json().catch(() => ({}));
	if (!res.ok) {
		const erreur = new Error(donnees.message ?? 'Erreur inattendue');
		erreur.status = res.status;
		erreur.erreurs = donnees.erreurs ?? {};
		throw erreur;
	}
	return donnees;
}

export const inscrire = (infos) =>
	appeler('/auth/inscription', { method: 'POST', body: JSON.stringify(infos) });

export const connecter = (identifiants) =>
	appeler('/auth/connexion', { method: 'POST', body: JSON.stringify(identifiants) });

export const deconnecter = () => appeler('/auth/deconnexion', { method: 'POST' });

export const recupererMoi = () => appeler('/auth/moi');

export const recupererPersonnes = () => appeler('/personne/');

export const recupererRoles = () => appeler('/roles');

export const supprimerPersonne = (id) =>
	appeler('/personne/delete', { method: 'PATCH', body: JSON.stringify({ id: id }) });
// infos = { nom, prenom, mail, date_naissance, ancien_mot_de_passe, nouveau_mot_de_passe, confirmation_mot_de_passe }
export const modifierProfil = (infos) =>
	appeler('/personne/modifierMoi', { method: 'PUT', body: JSON.stringify(infos) });
export const modifierPersonne = (infos, id) =>
	appeler(`/personne/${id}`, { method: 'PATCH', body: JSON.stringify(infos) });
//! TODO AJOUTER AGENDA ET JOURNAL ///

export const getAgendaDay = () => appeler('/agenda/jour');
