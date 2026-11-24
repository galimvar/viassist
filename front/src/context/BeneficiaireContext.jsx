import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { beneficiaireParDefaut } from './beneficiaireParDefaut.js';
import { lireIdMemorise, memoriserId } from './memoireBeneficiaire.js';
import * as api from '../api/beneficiaires.js';

const BeneficiaireContext = createContext(null);

// Mes bénéficiaires (liens acceptés) ET mes invitations en attente, chargés ensemble
async function chargerTout() {
	const [donneesBeneficiaires, donneesInvitations] = await Promise.all([
		api.recupererBeneficiaires(),
		api.recupererInvitations(),
	]);
	return {
		liste: donneesBeneficiaires.beneficiaires,
		invitations: donneesInvitations.invitations,
	};
}

export function BeneficiaireProvider({ children }) {
	const { utilisatrice } = useAuth();
	const idUtilisatrice = utilisatrice?.id ?? null;

	// « pour » = id de la personne à qui appartiennent ces données. On ne remet jamais l'état à zéro
	// à la déconnexion : des données qui ne sont pas celles de la personne connectée sont ignorées.
	const [chargee, setChargee] = useState({
		pour: null,
		liste: null,
		invitations: [],
		erreur: null,
	});
	const [idMemorise, setIdMemorise] = useState(lireIdMemorise);

	// Chargées à chaque connexion (changement de personne)
	useEffect(() => {
		if (idUtilisatrice === null) return;
		let obsolete = false; // la personne a changé avant la réponse : on ignore celle-ci
		chargerTout()
			.then((donnees) => {
				if (!obsolete) setChargee({ pour: idUtilisatrice, ...donnees, erreur: null });
			})
			.catch((err) => {
				if (!obsolete) {
					setChargee({
						pour: idUtilisatrice,
						liste: [],
						invitations: [],
						erreur: err.message,
					});
				}
			});
		return () => {
			obsolete = true;
		};
	}, [idUtilisatrice]);

	// Après une création, un changement de rôle, une invitation acceptée ou refusée
	const recharger = useCallback(async () => {
		const donnees = await chargerTout();
		setChargee({ pour: idUtilisatrice, ...donnees, erreur: null });
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
		invitations: aJour ? chargee.invitations : [], // [{ id, nom, prenom, role_id, role }]
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
