import { useState } from 'react';
import { CircleX, UserRoundPlus } from 'lucide-react';
import { ajouterMembre } from '../api/beneficiaires.js';
import { ROLES } from '../constantes/roles.js';
import ChampModifier from './ChampModifier.jsx';

// Formulaire d'ajout d'un membre (affiché dans un Volet sur la page Membres)
// roles : ceux qu'on peut attribuer ; onAjoute(mail) : appelé après un ajout réussi
export default function AjoutMembre({ beneficiaireId, roles, onAjoute, onAnnuler }) {
	const [mail, setMail] = useState('');
	const [roleId, setRoleId] = useState(ROLES.PROCHE);
	const [erreur, setErreur] = useState(null);
	const [erreurs, setErreurs] = useState({});
	const [envoiEnCours, setEnvoiEnCours] = useState(false);

	async function ajouter(event) {
		event.preventDefault();
		setErreur(null);
		setErreurs({});
		setEnvoiEnCours(true);
		try {
			await ajouterMembre(beneficiaireId, { mail, role_id: roleId });
			await onAjoute(mail);
		} catch (err) {
			setErreur(err.message); // ex. 404 : pas de compte ; 409 : déjà membre
			setErreurs(err.erreurs ?? {});
		} finally {
			setEnvoiEnCours(false);
		}
	}

	return (
		<form onSubmit={ajouter} className="flex flex-col gap-2">
			<p className="text-sm text-base-content/70">
				La personne doit déjà avoir un compte Vi'Assist.
			</p>

			<ChampModifier
				id="membre-mail"
				label="Adresse mail"
				type="email"
				value={mail}
				onChange={setMail}
				error={erreurs.mail}
				autoComplete="off"
				required
			/>

			<label htmlFor="membre-role" className="label">
				Rôle
			</label>
			<select
				id="membre-role"
				className="select w-full"
				value={roleId}
				onChange={(e) => setRoleId(Number(e.target.value))}
			>
				{roles.map((r) => (
					<option key={r.id} value={r.id}>
						{r.intitule}
					</option>
				))}
			</select>

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
					<UserRoundPlus size={20} aria-hidden="true" />
					Ajouter
				</button>
			</div>
		</form>
	);
}
