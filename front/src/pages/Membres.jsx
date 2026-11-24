import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleCheck, CircleX, PencilLine, Trash, UserRoundPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useBeneficiaire } from '../context/BeneficiaireContext.jsx';
import { recupererRoles } from '../api/auth.js';
import { modifierRoleMembre, recupererMembres, retirerMembre } from '../api/beneficiaires.js';
import { ROLES } from '../constantes/roles.js';
import Volet from '../components/Volet.jsx';
import FicheBeneficiaire from '../components/FicheBeneficiaire.jsx';
import AjoutMembre from '../components/AjoutMembre.jsx';

// Gestion des membres du bénéficiaire actif (route réservée à son admin, cf. App.jsx)
export default function Membres() {
	const { utilisatrice } = useAuth();
	const { actif, recharger } = useBeneficiaire();
	const beneficiaireId = actif.id;

	const [membres, setMembres] = useState(null);
	const [roles, setRoles] = useState([]);
	const [erreur, setErreur] = useState(null);
	const [confirmation, setConfirmation] = useState(null); // ex. « Fiche enregistrée. »

	// Volet ouvert : null, 'fiche' ou 'ajout'
	const [volet, setVolet] = useState(null);
	const fermerVolet = () => setVolet(null);

	const dialogue = useRef(null);
	const [aRetirer, setARetirer] = useState(null);

	const charger = useCallback(async () => {
		const donnees = await recupererMembres(beneficiaireId);
		setMembres(donnees.membres);
	}, [beneficiaireId]);

	// Premier chargement, et à chaque changement de bénéficiaire actif
	useEffect(() => {
		let obsolete = false; // on a changé de bénéficiaire avant la réponse : on l'ignore
		recupererMembres(beneficiaireId)
			.then((donnees) => {
				if (!obsolete) setMembres(donnees.membres);
			})
			.catch((err) => {
				if (!obsolete) setErreur(err.message);
			});
		recupererRoles()
			// Le rôle « bénéficiaire » est réservé au compte lié : on ne le propose pas
			.then((donnees) => {
				if (!obsolete) setRoles(donnees.roles.filter((r) => r.id !== ROLES.BENEFICIAIRE));
			})
			.catch((err) => {
				if (!obsolete) setErreur(err.message);
			});
		return () => {
			obsolete = true;
		};
	}, [beneficiaireId]);

	// Si je modifie MON rôle, mes droits changent : on recharge le contexte
	// (et si je ne suis plus admin, BeneficiaireRequis me renvoie à l'accueil)
	async function apresChangement(personneId) {
		if (personneId === utilisatrice.id) {
			await recharger();
		} else {
			await charger();
		}
	}

	async function changerRole(membre, roleId) {
		setErreur(null);
		setConfirmation(null);
		try {
			await modifierRoleMembre(beneficiaireId, membre.id, roleId);
			await apresChangement(membre.id);
		} catch (err) {
			setErreur(err.message); // ex. 409 : dernier admin
		}
	}

	function demanderRetrait(membre) {
		setARetirer(membre);
		dialogue.current.showModal();
	}

	async function confirmerRetrait() {
		const membre = aRetirer;
		dialogue.current.close();
		setErreur(null);
		setConfirmation(null);
		try {
			await retirerMembre(beneficiaireId, membre.id);
			await apresChangement(membre.id);
		} catch (err) {
			setErreur(err.message);
		}
	}

	function ouvrirVolet(nom) {
		setErreur(null);
		setConfirmation(null);
		setVolet(nom);
	}

	async function apresAjout(mail) {
		fermerVolet();
		setConfirmation(`${mail} a été ajouté·e.`);
		await charger();
	}

	function apresFiche() {
		fermerVolet();
		setConfirmation('Fiche enregistrée.');
	}

	return (
		<section className="max-w-2xl mx-auto flex flex-col gap-6" aria-labelledby="titre-membres">
			<h1 id="titre-membres" className="text-2xl font-semibold">
				Entourage de {actif.prenom} {actif.nom}
			</h1>

			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					className="btn btn-outline"
					onClick={() => ouvrirVolet('fiche')}
				>
					<PencilLine size={20} aria-hidden="true" />
					Modifier la fiche de {actif.prenom}
				</button>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => ouvrirVolet('ajout')}
				>
					<UserRoundPlus size={20} aria-hidden="true" />
					Ajouter une personne
				</button>
			</div>

			{erreur && (
				<div role="alert" className="alert alert-error">
					<CircleX size={20} aria-hidden="true" />
					<span>{erreur}</span>
				</div>
			)}
			{confirmation && (
				<div role="status" className="alert alert-success">
					<CircleCheck size={20} aria-hidden="true" />
					<span>{confirmation}</span>
				</div>
			)}

			<h2 className="text-xl font-semibold">Membres</h2>

			{membres === null ? (
				<p role="status">Chargement…</p>
			) : (
				<ul className="list bg-base-100 rounded-box shadow-md">
					{membres.map((m) => {
						const estCompteBeneficiaire = m.role_id === ROLES.BENEFICIAIRE;
						const nomComplet = `${m.prenom} ${m.nom}`;
						return (
							<li
								key={m.id}
								className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4"
							>
								<div className="grow min-w-48">
									<div className="font-medium">
										{nomComplet}
										{m.id === utilisatrice.id && ' (vous)'}
									</div>
									<div className="text-sm text-base-content/70 break-all">
										{m.mail}
									</div>
								</div>

								{estCompteBeneficiaire ? (
									<span className="badge badge-soft badge-primary">
										bénéficiaire
									</span>
								) : (
									<>
										<select
											className="select select-sm w-40"
											aria-label={`Rôle de ${nomComplet}`}
											value={m.role_id}
											onChange={(e) => changerRole(m, Number(e.target.value))}
										>
											{roles.map((r) => (
												<option key={r.id} value={r.id}>
													{r.intitule}
												</option>
											))}
										</select>
										<button
											type="button"
											className="btn btn-square btn-ghost btn-sm"
											aria-label={`Retirer ${nomComplet}`}
											onClick={() => demanderRetrait(m)}
										>
											<Trash
												size={18}
												className="text-error"
												aria-hidden="true"
											/>
										</button>
									</>
								)}
							</li>
						);
					})}
				</ul>
			)}

			<Volet
				titre={`Fiche de ${actif.prenom}`}
				ouvert={volet === 'fiche'}
				onFermer={fermerVolet}
			>
				<FicheBeneficiaire onEnregistre={apresFiche} onAnnuler={fermerVolet} />
			</Volet>

			<Volet titre="Ajouter une personne" ouvert={volet === 'ajout'} onFermer={fermerVolet}>
				<AjoutMembre
					beneficiaireId={beneficiaireId}
					roles={roles}
					onAjoute={apresAjout}
					onAnnuler={fermerVolet}
				/>
			</Volet>

			<dialog
				ref={dialogue}
				className="modal"
				aria-labelledby="titre-retrait"
				onClose={() => setARetirer(null)}
			>
				<div className="modal-box">
					<h2 id="titre-retrait" className="font-bold text-lg">
						Retirer {aRetirer?.prenom} {aRetirer?.nom} ?
					</h2>
					<p className="py-4">
						Cette personne n'aura plus accès à l'agenda ni au journal de {actif.prenom}.
						Son compte Vi'Assist n'est pas supprimé.
					</p>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn">Annuler</button>
						</form>
						<button type="button" className="btn btn-error" onClick={confirmerRetrait}>
							Retirer
						</button>
					</div>
				</div>
			</dialog>
		</section>
	);
}
