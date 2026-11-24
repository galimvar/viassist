import { useState } from 'react';
import { CircleX, Send } from 'lucide-react';
import { inviterMembre } from '../api/beneficiaires.js';
import { ROLES } from '../constantes/roles.js';
import ChampModifier from './ChampModifier.jsx';

// Formulaire d'INVITATION d'un membre (affiché dans un Volet sur la page Membres).
// La personne invitée doit accepter avant d'avoir accès. L'API répond le même message que le mail
// existe ou non (pas d'énumération des comptes) : on se contente de l'afficher.
// roles : ceux qu'on peut attribuer ; onInvite(message) : appelé après l'envoi
export default function AjoutMembre({ beneficiaireId, roles, onInvite, onAnnuler }) {
	const [mail, setMail] = useState('');
	const [roleId, setRoleId] = useState(ROLES.PROCHE);
	const [erreur, setErreur] = useState(null);
	const [erreurs, setErreurs] = useState({});
	const [envoiEnCours, setEnvoiEnCours] = useState(false);

	async function inviter(event) {
		event.preventDefault();
		setErreur(null);
		setErreurs({});
		setEnvoiEnCours(true);
		try {
			const { message } = await inviterMembre(beneficiaireId, { mail, role_id: roleId });
			onInvite(message);
		} catch (err) {
			setErreur(err.message); // seulement 422 (format) ou une erreur technique
			setErreurs(err.erreurs ?? {});
		} finally {
			setEnvoiEnCours(false);
		}
	}

	return (
		<form onSubmit={inviter} className="flex flex-col gap-2">
			<p className="text-sm text-base-content/70">
				La personne doit déjà avoir un compte Vi'Assist. Elle recevra une invitation et
				n'aura accès à rien tant qu'elle ne l'aura pas acceptée.
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
					<Send size={20} aria-hidden="true" />
					Inviter
				</button>
			</div>
		</form>
	);
}
