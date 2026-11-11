import { useState } from 'react';
import { useNavigate } from 'react-router';
import { inscrire } from '../api/auth.js';
import { CircleX } from 'lucide-react';

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
						<div>
							<label className="label" htmlFor="name">
								Nom
							</label>
							<input
								id="name"
								type="text"
								className="input w-full validator"
								placeholder="Nom"
								onChange={(e) => {
									setNom(e.target.value);
								}}
								required
							/>
							<div className="validator-hint">Le nom est obligatoire</div>
						</div>
						<div>
							<label className="label" htmlFor="firstname">
								Prénom
							</label>
							<input
								id="firstname"
								type="text"
								className="input w-full validator"
								placeholder="Prénom"
								onChange={(e) => {
									setPrenom(e.target.value);
								}}
								required
							/>
							<p className="validator-hint">Le prénom est obligatoire</p>
						</div>

						<div>
							<label className="label" htmlFor="birthday">
								Date de naissance
							</label>
							<input
								id="birthday"
								type="date"
								className="input w-full validator"
								placeholder="Date de naissance"
								onChange={(e) => {
									setDateNaissance(e.target.value);
								}}
							/>
						</div>

						<div>
							<label className="label" htmlFor="mail">
								Adresse mail
							</label>
							<input
								id="mail"
								type="email"
								className="input w-full validator"
								placeholder="Adresse mail"
								onChange={(e) => {
									setMail(e.target.value);
								}}
								pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
								required
							/>
							<p className="validator-hint">
								Le mail doit être dans un format valide
							</p>
						</div>
						<div>
							<label className="label" htmlFor="password">
								Mot de passe
							</label>
							<input
								id="password"
								type="password"
								className="input w-full validator"
								pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
								placeholder="••••••••"
								onChange={(e) => {
									setMotDePasse(e.target.value);
								}}
								required
							/>
							<p className="validator-hint">
								Entrez un mot de passe valide, d'au moins 8 caractères, comprenant
								au moins 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1
								caractère spécial
							</p>
						</div>
						<div>
							<label className="label" htmlFor="passwordValid">
								Confirmation du mot de passe
							</label>
							<input
								id="passwordValid"
								type="password"
								className="input w-full validator"
								pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
								placeholder="••••••••"
								onChange={(e) => {
									setMotDePasseValidation(e.target.value);
								}}
								required
							/>
							<p className="validator-hint">
								Entrez un mot de passe valide, d'au moins 8 caractères, comprenant
								au moins 1 lettre minuscule, 1 lettre majuscule, 1 chiffre et 1
								caractère spécial.
							</p>
						</div>

						{erreur && (
							<div role="alert" className="alert alert-error">
								<CircleX size={20} color="red" strokeWidth={1.75} />
								<span>{erreur}</span>
							</div>
						)}
					</fieldset>

					<button
						className="btn btn-primary w-full mt-4"
						onClick={(e) => {
							soumettre(e);
						}}
					>
						Se connecter
					</button>
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
