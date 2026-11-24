import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { beneficiaireParDefaut } from './beneficiaireParDefaut.js';
import * as api from '../api/beneficiaires.js';

// Bénéficiaire actif : seul son id est mémorisé dans le navigateur (préférence de confort).
// Les droits, eux, sont toujours vérifiés par le back (exigerRoleSur).
const CLE_STOCKAGE = 'viassist.beneficiaireActif';

// localStorage peut être indisponible (navigation privée, stockage bloqué) : on ne plante jamais
function lireIdMemorise() {
	try {
		const valeur = localStorage.getItem(CLE_STOCKAGE);
		return valeur === null ? null : Number(valeur);
	} catch {
		return null;
	}
}

function memoriserId(id) {
	try {
		localStorage.setItem(CLE_STOCKAGE, String(id));
	} catch {
		// tant pis : le choix ne sera simplement pas retenu au prochain chargement
	}
}

const BeneficiaireContext = createContext(null);

export function BeneficiaireProvider({ children }) {
	const { utilisatrice } = useAuth();
	const idUtilisatrice = utilisatrice?.id ?? null;

	// « pour » = id de la personne à qui appartient cette liste. On ne remet jamais l'état à zéro
	// à la déconnexion : une liste qui n'est pas celle de la personne connectée est simplement ignorée.
	const [chargee, setChargee] = useState({ pour: null, liste: null, erreur: null });
	const [idMemorise, setIdMemorise] = useState(lireIdMemorise);

	// Chargée à chaque connexion (changement de personne)
	useEffect(() => {
		if (idUtilisatrice === null) return;
		let obsolete = false; // la personne a changé avant la réponse : on ignore celle-ci
		api.recupererBeneficiaires()
			.then((donnees) => {
				if (!obsolete) {
					setChargee({
						pour: idUtilisatrice,
						liste: donnees.beneficiaires,
						erreur: null,
					});
				}
			})
			.catch((err) => {
				if (!obsolete) setChargee({ pour: idUtilisatrice, liste: [], erreur: err.message });
			});
		return () => {
			obsolete = true;
		};
	}, [idUtilisatrice]);

	// Après une création ou un changement de rôle
	const recharger = useCallback(async () => {
		const donnees = await api.recupererBeneficiaires();
		setChargee({ pour: idUtilisatrice, liste: donnees.beneficiaires, erreur: null });
	}, [idUtilisatrice]);

	function choisir(id) {
		setIdMemorise(id);
		memoriserId(id);
	}

	// Valeurs dérivées : recalculées à chaque rendu, jamais stockées en double
	const aJour = idUtilisatrice !== null && chargee.pour === idUtilisatrice;
	const beneficiaires = aJour ? chargee.liste : null;
	const idActif = beneficiaires ? beneficiaireParDefaut(beneficiaires, idMemorise) : null;
	const actif = beneficiaires?.find((b) => b.id === idActif) ?? null;

	const valeur = {
		beneficiaires: beneficiaires ?? [],
		actif, // { id, nom, prenom, role_id, role, … } ou null
		role: actif?.role_id ?? null, // mon rôle chez le bénéficiaire actif
		chargement: idUtilisatrice !== null && !aJour,
		erreur: aJour ? chargee.erreur : null,
		choisir,
		recharger,
	};

	return <BeneficiaireContext.Provider value={valeur}>{children}</BeneficiaireContext.Provider>;
}

export function useBeneficiaire() {
	return useContext(BeneficiaireContext);
}
