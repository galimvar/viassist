import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, CircleX, UserRound, UserRoundPlus } from 'lucide-react';
import { useBeneficiaire } from '../context/BeneficiaireContext.jsx';
import { creerBeneficiaire } from '../api/beneficiaires.js';
import ChampModifier from '../components/ChampModifier.jsx';
import { enTantQue } from '../constantes/roles.js';

export default function ChoixBeneficiaire() {
	const { beneficiaires, actif, chargement, choisir, recharger } = useBeneficiaire();
	const navigate = useNavigate();

	const [formulaireOuvert, setFormulaireOuvert] = useState(false);
	const [nom, setNom] = useState('');
	const [prenom, setPrenom] = useState('');
	const [dateNaissance, setDateNaissance] = useState('');
	const [erreur, setErreur] = useState(null);
	const [erreurs, setErreurs] = useState({});
	const [envoiEnCours, setEnvoiEnCours] = useState(false);

	if (chargement) return <p role="status">Chargement…</p>;

	const aucun = beneficiaires.length === 0;

	function selectionner(id) {
		choisir(id);
		navigate('/');
	}

	async function creer(event) {
		event.preventDefault();
		setErreur(null);
		setErreurs({});
		setEnvoiEnCours(true);
		try {
			const { beneficiaire } = await creerBeneficiaire({
				nom,
				prenom,
				date_naissance: dateNaissance || undefined, // facultative
			});
			await recharger(); // je suis maintenant admin de ce bénéficiaire
			selectionner(beneficiaire.id);
		} catch (err) {
			setErreur(err.message);
			setErreurs(err.erreurs ?? {});
		} finally {
			setEnvoiEnCours(false);
		}
	}

	return (
		<section className="max-w-md mx-auto flex flex-col gap-6" aria-labelledby="titre-choix">
			<h1 id="titre-choix" className="text-2xl font-semibold">
				{aucun ? 'Bienvenue' : 'Qui accompagnez-vous ?'}
			</h1>

			{aucun ? (
				<p>
					Vous n'accompagnez encore personne. Ajoutez la personne que vous aidez pour
					commencer : vous en serez l'administrateur ou l'administratrice.
				</p>
			) : (
				<ul className="list bg-base-100 rounded-box shadow-md">
					{beneficiaires.map((b) => {
						const estActif = actif?.id === b.id;
						return (
							<li key={b.id}>
								<button
									type="button"
									onClick={() => selectionner(b.id)}
									aria-current={estActif ? 'true' : undefined}
									className={`flex w-full items-center gap-4 p-4 text-left rounded-box hover:bg-base-200 ${estActif ? 'bg-base-200' : ''}`}
								>
									<UserRound size={28} strokeWidth={1.75} aria-hidden="true" />
									<span className="grow">
										<span className="block font-medium">
											{b.prenom} {b.nom}
										</span>
										<span className="block text-sm text-base-content/70 first-letter:uppercase">
											{enTantQue(b.role)}
											{estActif && ' · sélectionné'}
										</span>
									</span>
									<ChevronRight size={20} aria-hidden="true" />
								</button>
							</li>
						);
					})}
				</ul>
			)}

			{aucun || formulaireOuvert ? (
				<form
					onSubmit={creer}
					className="card bg-base-100 shadow-md"
					aria-labelledby="titre-creation"
				>
					<fieldset className="card-body fieldset">
						<legend id="titre-creation" className="card-title">
							Ajouter un bénéficiaire
						</legend>

						<ChampModifier
							id="beneficiaire-prenom"
							label="Prénom"
							value={prenom}
							onChange={setPrenom}
							error={erreurs.prenom}
							maxLength={50}
							required
						/>
						<ChampModifier
							id="beneficiaire-nom"
							label="Nom"
							value={nom}
							onChange={setNom}
							error={erreurs.nom}
							maxLength={50}
							required
						/>
						<ChampModifier
							id="beneficiaire-date-naissance"
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

						<div className="card-actions justify-end mt-2">
							{!aucun && (
								<button
									type="button"
									className="btn btn-ghost"
									onClick={() => setFormulaireOuvert(false)}
								>
									Annuler
								</button>
							)}
							<button className="btn btn-primary" disabled={envoiEnCours}>
								Ajouter
							</button>
						</div>
					</fieldset>
				</form>
			) : (
				<button
					type="button"
					className="btn btn-outline btn-primary"
					onClick={() => setFormulaireOuvert(true)}
				>
					<UserRoundPlus size={20} aria-hidden="true" />
					Ajouter un bénéficiaire
				</button>
			)}
		</section>
	);
}
