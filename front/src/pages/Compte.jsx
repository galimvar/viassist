import { useEffect, useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { recupererMoi, modifierProfil } from '../api/auth.js';
import Champ from '../components/Champ.jsx';

// Réponse de l'API -> valeurs des champs. Les mots de passe démarrent toujours vides.
function versFormulaire(p) {
	return {
		nom: p.nom ?? '',
		prenom: p.prenom ?? '',
		mail: p.mail ?? '',
		date_naissance: p.date_naissance?.slice(0, 10) ?? '', // "AAAA-MM-JJ" exigé par type="date"
		role: p.role ?? '',
		ancien_mot_de_passe: '',
		nouveau_mot_de_passe: '',
		confirmation_mot_de_passe: '',
	};
}

function formaterDate(date) {
	if (!date) return '—';
	return date.slice(0, 10).split('-').reverse().join('/');
}

function Compte() {
	const { deconnexion } = useAuth();
	const [compte, setCompte] = useState(null);
	const [formulaire, setFormulaire] = useState(null);
	const [edition, setEdition] = useState(false);
	const [erreur, setErreur] = useState(null); // échec du chargement : remplace la page
	const [erreursChamps, setErreursChamps] = useState({}); // erreurs par champ, après l'envoi
	const [erreurEnvoi, setErreurEnvoi] = useState(null);
	const [succes, setSucces] = useState(false);
	const [envoi, setEnvoi] = useState(false);

	// ------------ GET : récupère les infos à l'affichage de la page
	useEffect(() => {
		let actif = true;

		recupererMoi()
			.then((donnees) => {
				if (actif) setCompte(donnees.personne);
			})
			.catch((e) => {
				if (!actif) return;
				if (e.status === 401) return deconnexion();
				setErreur(e.message);
			});

		return () => {
			actif = false;
		};
	}, []);

	function ouvrirEdition() {
		setFormulaire(versFormulaire(compte));
		setErreursChamps({});
		setErreurEnvoi(null);
		setSucces(false);
		setEdition(true);
	}

	function annuler() {
		setFormulaire(null); //à la poubelle le formulaire
		setErreursChamps({});
		setErreurEnvoi(null);
		setEdition(false);
	}

	function modifier(e) {
		const { name, value } = e.target;
		setCompte((precedent) => ({ ...precedent, [name]: value }));
	}

	async function soumettre(e) {
		e.preventDefault();
		setErreursChamps({});
		setErreurEnvoi(null);
		setSucces(false);

		if (formulaire.nouveau_mot_de_passe !== formulaire.confirmation_mot_de_passe) {
			setErreursChamps({
				confirmation_mot_de_passe: 'Les mots de passe ne correspondent pas',
			});
			return;
		}

		setEnvoi(true);
		try {
			const donnees = await modifierProfil({
				nom: compte.nom.trim(),
				prenom: compte.prenom.trim(),
				mail: compte.mail.trim(),
				// le back attend AAAA/MM/JJ (comme à l'inscription), le champ date donne AAAA-MM-JJ
				date_naissance: compte.date_naissance.replaceAll('-', '/'),
				ancien_mot_de_passe: compte.ancien_mot_de_passe,
				nouveau_mot_de_passe: compte.nouveau_mot_de_passe,
				confirmation_mot_de_passe: compte.confirmation_mot_de_passe,
			});
			setCompte(versFormulaire(donnees.personne)); // champs mis à jour, mots de passe vidés
			setEdition(false);
			setFormulaire(null);
			setSucces(true);
		} catch (err) {
			setErreursChamps(err.erreurs ?? {});
			setErreurEnvoi(err.message);
		} finally {
			setEnvoi(false);
		}
	}

	if (erreur) {
		return (
			<div role="alert" className="alert alert-error max-w-md mx-auto">
				<CircleX size={20} strokeWidth={1.75} />
				<span>{erreur}</span>
			</div>
		);
	}

	if (!compte) return <p role="status">Chargement…</p>;

	if (!edition) {
		return (
			<section className="card bg-base-100 shadow-md w-full max-w-md mx-auto">
				<div className="card-body">
					<h1 className="card-title">Mon compte</h1>

					{succes && (
						<div role="status" className="alert alert-success">
							<CircleCheck size={20} strokeWidth={1.75} />
							<span>Ton profil a bien été mis à jour.</span>
						</div>
					)}

					<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
						<dt className="font-semibold">Nom</dt>
						<dd>{compte.nom}</dd>

						<dt className="font-semibold">Prénom</dt>
						<dd>{compte.prenom}</dd>

						<dt className="font-semibold">Adresse mail</dt>
						<dd>{compte.mail}</dd>

						<dt className="font-semibold">Date de naissance</dt>
						<dd>{formaterDate(compte.date_naissance)}</dd>

						<dt className="font-semibold">Rôle</dt>
						<dd>{compte.role ?? '—'}</dd>
					</dl>

					<button
						type="button"
						className="btn btn-primary w-full mt-4"
						onClick={ouvrirEdition}
					>
						Modifier mes informations
					</button>
				</div>
			</section>
		);
	}
	return (
		<section className="card bg-base-100 shadow-md w-full max-w-md mx-auto">
			<form className="card-body" onSubmit={soumettre}>
				<h1 className="card-title">Mon Compte</h1>
				<Champ
					id="nom"
					label="Nom"
					className="input w-full"
					value={compte.nom}
					onChange={modifier}
					erreur={erreursChamps.nom}
				/>
				<Champ
					id="prenom"
					label="Prénom"
					className="input w-full"
					value={compte.prenom}
					onChange={modifier}
					erreur={erreursChamps.prenom}
				/>
				<Champ
					id="mail"
					label="Adresse mail"
					type="email"
					className="input w-full"
					value={compte.mail}
					onChange={modifier}
					erreur={erreursChamps.mail}
				/>
				<Champ
					id="date_naissance"
					label="Date de naissance"
					type="date"
					className="input w-full"
					value={compte.date_naissance}
					onChange={modifier}
					erreur={erreursChamps.date_naissance}
				/>
				<Champ
					id="role"
					label="Rôle"
					className="input w-full"
					value={compte.role}
					readOnly
				/>

				<h2 className="mt-4 font-semibold">Changer de mot de passe</h2>
				<p className="text-xs text-base-content/60">Laisse vide pour garder l'actuel.</p>
				<Champ
					id="ancien_mot_de_passe"
					label="Mot de passe actuel"
					type="password"
					autoComplete="current-password"
					className="input w-full"
					value={compte.ancien_mot_de_passe}
					onChange={modifier}
					erreur={erreursChamps.ancien_mot_de_passe}
				/>
				<Champ
					id="nouveau_mot_de_passe"
					label="Nouveau mot de passe"
					type="password"
					autoComplete="new-password"
					className="input w-full"
					value={compte.nouveau_mot_de_passe}
					onChange={modifier}
					erreur={erreursChamps.nouveau_mot_de_passe}
				/>
				<Champ
					id="confirmation_mot_de_passe"
					label="Confirmer le nouveau mot de passe"
					type="password"
					autoComplete="new-password"
					className="input w-full"
					value={compte.confirmation_mot_de_passe}
					onChange={modifier}
					erreur={erreursChamps.confirmation_mot_de_passe}
				/>

				{erreurEnvoi && (
					<div role="alert" className="alert alert-error">
						<CircleX size={20} strokeWidth={1.75} />
						<span>{erreurEnvoi}</span>
					</div>
				)}
				{succes && (
					<div role="status" className="alert alert-success">
						<CircleCheck size={20} strokeWidth={1.75} />
						<span>Ton profil a bien été mis à jour.</span>
					</div>
				)}

				<button type="submit" className="btn btn-primary w-full mt-4" disabled={envoi}>
					Enregistrer
				</button>
			</form>
		</section>
	);
}

export default Compte;
