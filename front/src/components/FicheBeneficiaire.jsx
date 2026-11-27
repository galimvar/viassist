import { useState } from 'react';
import { CircleX } from 'lucide-react';
import { useBeneficiaire } from '../context/BeneficiaireContext.jsx';
import { modifierBeneficiaire } from '../api/beneficiaires.js';
import ChampModifier from './ChampModifier.jsx';

// Fiche du bénéficiaire actif, modifiable par son admin (affichée dans un Volet sur la page Membres).
// L'état part des valeurs actuelles à chaque montage : le Volet ne rend ce formulaire que s'il est ouvert.
export default function FicheBeneficiaire({ onEnregistre, onAnnuler }) {
	const { actif, recharger } = useBeneficiaire();

	const [nom, setNom] = useState(actif.nom);
	const [prenom, setPrenom] = useState(actif.prenom);
	// L'API renvoie 'AAAA-MM-JJ' (ou null) : directement utilisable par <input type="date">
	const [dateNaissance, setDateNaissance] = useState(actif.date_naissance ?? '');
	const [erreur, setErreur] = useState(null);
	const [erreurs, setErreurs] = useState({});
	const [envoiEnCours, setEnvoiEnCours] = useState(false);

	async function enregistrer(event) {
		event.preventDefault();
		setErreur(null);
		setErreurs({});
		setEnvoiEnCours(true);
		try {
			await modifierBeneficiaire(actif.id, { nom, prenom, date_naissance: dateNaissance });
			await recharger(); // le nom affiché partout (nav, accueil…) vient du contexte
			onEnregistre();
		} catch (err) {
			setErreur(err.message);
			setErreurs(err.erreurs ?? {});
		} finally {
			setEnvoiEnCours(false);
		}
	}

	return (
		<form onSubmit={enregistrer} className="flex flex-col gap-2">
			<ChampModifier
				id="fiche-prenom"
				label="Prénom"
				value={prenom}
				onChange={setPrenom}
				error={erreurs.prenom}
				maxLength={50}
				required
			/>
			<ChampModifier
				id="fiche-nom"
				label="Nom"
				value={nom}
				onChange={setNom}
				error={erreurs.nom}
				maxLength={50}
				required
			/>
			<ChampModifier
				id="fiche-date-naissance"
				label="Date de naissance (facultative)"
				type="date"
				value={dateNaissance}
				onChange={setDateNaissance}
				error={erreurs.date_naissance}
			/>

			{erreur && (
				<div role="alert" className="alert alert-error">
					<CircleX size={20} aria-hidden="true" />
					<span>{erreur}</span>
				</div>
			)}

			<div className="flex justify-end gap-2 mt-4">
				<button type="button" className="btn btn-ghost" onClick={onAnnuler}>
					Annuler
				</button>
				<button className="btn btn-primary" disabled={envoiEnCours}>
					Enregistrer
				</button>
			</div>
		</form>
	);
}
