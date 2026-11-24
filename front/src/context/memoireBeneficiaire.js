// Bénéficiaire actif mémorisé dans le navigateur (préférence de confort, jamais une donnée de droits :
// le back vérifie toujours l'accès avec exigerRoleSur).
// localStorage peut être indisponible (navigation privée, stockage bloqué) : on ne plante jamais.
const CLE_STOCKAGE = 'viassist.beneficiaireActif';

export function lireIdMemorise() {
	try {
		const valeur = localStorage.getItem(CLE_STOCKAGE);
		return valeur === null ? null : Number(valeur);
	} catch {
		return null;
	}
}

export function memoriserId(id) {
	try {
		localStorage.setItem(CLE_STOCKAGE, String(id));
	} catch {
		// tant pis : le choix ne sera simplement pas retenu au prochain chargement
	}
}

// À la déconnexion : la personne suivante sur ce navigateur ne doit rien hériter
export function oublierIdMemorise() {
	try {
		localStorage.removeItem(CLE_STOCKAGE);
	} catch {
		// rien à faire
	}
}
