import { useState } from 'react';
import { useNavigate } from 'react-router';
import { inscrire } from '../api/auth.js';
import { CircleX } from 'lucide-react';
import ChampModifier from '../components/ChampModifier.jsx';

export default function Inscription() {
	const navigate = useNavigate();
	const [nom, setNom] = useState('');
	const [prenom, setPrenom] = useState('');
	const [dateNaissance, setDateNaissance] = useState('');
	const [mail, setMail] = useState('');
	const [motDePasse, setMotDePasse] = useState('');
	const [motDePasseValidation, setMotDePasseValidation] = useState('');
	const [erreur, setErreur] = useState(null);

	async function soumettre(e) {
		e.preventDefault();
		const newDate = formateDate(dateNaissance);
		if (motDePasse != motDePasseValidation) {
			setErreur('Les mots de passes doivent être identiques');
			return;
		}
		try {
			await inscrire({
				nom: nom,
				prenom: prenom,
				date_naissance: newDate,
				mail: mail,
				mot_de_passe: motDePasse,
				role: 'admin',
			});
			navigate('/connexion');
		} catch (err) {
			setErreur(err.message);
		}
	}

	const formateDate = (date) => {
		const dateTab = date.split('-');
		return dateTab.join('/');
	};
	return (
		<>
			<form
				onSubmit={soumettre}
				className="card bg-base-100 w-full max-w-md mx-auto mt-12 shadow-lg"
			>
				<div className="card-body items-center text-center">
					<h2 className="card-title">Inscription</h2>

					<fieldset className="fieldset w-full text-left">
						<ChampModifier
							id="nom"
							label="Nom"
							value={nom}
							onChange={setNom}
							error={'Le nom est requis.'}
							className="input w-full validator"
							required
						/>
						<ChampModifier
							id="prenom"
							label="Prénom"
							value={prenom}
							onChange={setPrenom}
							error={'Le prénom est requis.'}
							className="input w-full validator"
							required
						/>

						<ChampModifier
							id="dateNaissance"
							label="Date de naissance"
							type="date"
							value={dateNaissance}
							onChange={setDateNaissance}
							error={'La date de naissance doit être au bon format !'}
							className="input w-full validator"
						/>

						<ChampModifier
							id="mail"
							label="Adresse mail"
							type="email"
							value={mail}
							onChange={setMail}
							error={'Le mail est requis, au bon format'}
							className="input w-full validator"
							pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
							required
						/>
						<ChampModifier
							id="password"
							label="Mot de passe"
							type="password"
							value={motDePasse}
							onChange={setMotDePasse}
							error={
								"Entrez un mot de passe valide, d'au moins 8 caractères, comprenant au moins 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial"
							}
							className="input w-full validator"
							pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
							placeholder="••••••••"
							required
						/>
						<ChampModifier
							id="passwordValid"
							label="Confirmer mot de passe"
							type="password"
							value={motDePasseValidation}
							onChange={setMotDePasseValidation}
							error={
								"Entrez un mot de passe valide, d'au moins 8 caractères, comprenant au moins 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1 caractère spécial"
							}
							className="input w-full validator"
							pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
							placeholder="••••••••"
							required
						/>

						{erreur && (
							<div role="alert" className="alert alert-error">
								<CircleX size={20} color="red" strokeWidth={1.75} />
								<span>{erreur}</span>
							</div>
						)}
					</fieldset>

					<button className="btn btn-primary w-full mt-4">Créer mon compte</button>
				</div>
				<div class="flex justify-center">
					<a
						class="link link-primary"
						onClick={() => {
							navigate('/connexion');
						}}
					>
						J'ai déjà un compte ? Se connecter
					</a>
				</div>
			</form>
		</>
	);
}
