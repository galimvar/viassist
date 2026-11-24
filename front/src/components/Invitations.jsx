import { useState } from 'react';
import { Check, CircleX, X } from 'lucide-react';
import { useBeneficiaire } from '../context/BeneficiaireContext.jsx';
import { accepterInvitation, refuserInvitation } from '../api/beneficiaires.js';
import { enTantQue } from '../constantes/roles.js';

// Invitations en attente de la personne connectée (écran de choix du bénéficiaire).
// Accepter donne l'accès ; refuser supprime l'invitation. Dans les deux cas, on recharge le contexte.
export default function Invitations() {
	const { invitations, recharger } = useBeneficiaire();
	const [erreur, setErreur] = useState(null);
	const [enCours, setEnCours] = useState(null); // id du bénéficiaire en cours de traitement

	if (invitations.length === 0) return null;

	async function traiter(beneficiaireId, action) {
		setErreur(null);
		setEnCours(beneficiaireId);
		try {
			await action(beneficiaireId);
			await recharger();
		} catch (err) {
			setErreur(err.message);
		} finally {
			setEnCours(null);
		}
	}

	return (
		<section aria-labelledby="titre-invitations" className="flex flex-col gap-2">
			<h2 id="titre-invitations" className="text-lg font-semibold">
				{invitations.length === 1 ? 'Une invitation' : `${invitations.length} invitations`}{' '}
				en attente
			</h2>

			{erreur && (
				<div role="alert" className="alert alert-error">
					<CircleX size={20} aria-hidden="true" />
					<span>{erreur}</span>
				</div>
			)}

			<ul className="list bg-base-100 rounded-box shadow-md">
				{invitations.map((invitation) => {
					const nomComplet = `${invitation.prenom} ${invitation.nom}`;
					const occupe = enCours === invitation.id;
					return (
						<li
							key={invitation.id}
							className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4"
						>
							<div className="grow min-w-48">
								<div className="font-medium">Accompagner {nomComplet}</div>
								<div className="text-sm text-base-content/70">
									{enTantQue(invitation.role)}
								</div>
							</div>
							<button
								type="button"
								className="btn btn-sm btn-ghost"
								disabled={occupe}
								aria-label={`Refuser l'invitation pour ${nomComplet}`}
								onClick={() => traiter(invitation.id, refuserInvitation)}
							>
								<X size={18} aria-hidden="true" />
								Refuser
							</button>
							<button
								type="button"
								className="btn btn-sm btn-primary"
								disabled={occupe}
								aria-label={`Accepter l'invitation pour ${nomComplet}`}
								onClick={() => traiter(invitation.id, accepterInvitation)}
							>
								<Check size={18} aria-hidden="true" />
								Accepter
							</button>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
