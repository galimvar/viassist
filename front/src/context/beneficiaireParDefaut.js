/**
 * Quel bénéficiaire ouvrir sans demander à la personne connectée ?
 * Fonction pure (pas d'appel réseau, pas de state) : même entrée → même sortie.
 *
 * @param {Array<{id: number}>} beneficiaires ceux qu'elle accompagne (renvoyés par l'API)
 * @param {number|null} idMemorise          le dernier choisi dans ce navigateur, s'il y en a un
 * @returns {number|null} l'id à ouvrir, ou null pour l'envoyer sur l'écran de choix /beneficiaires
 *                        (qui affiche le formulaire de création quand la liste est vide)
 */
export function beneficiaireParDefaut(beneficiaires, idMemorise) {
	if (beneficiaires.length <= 0) {
		return null;
	}
	if (beneficiaires.length === 1) {
		return beneficiaires[0].id;
	}
	if (beneficiaires.some((beneficiaire) => beneficiaire.id === idMemorise)) {
		return idMemorise;
	}
	return null;
}
