import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import ChampModifier from '../components/ChampModifier.jsx';
import { CircleX } from 'lucide-react';

export default function Connexion() {
	const { connexion } = useAuth();
	const navigate = useNavigate();
	const [mail, setMail] = useState('');
	const [motDePasse, setMotDePasse] = useState('');
	const [erreur, setErreur] = useState(null);

	async function soumettre(e) {
		e.preventDefault();
		try {
			await connexion({ mail: mail, mot_de_passe: motDePasse });
			navigate('/');
		} catch (err) {
			setErreur(err.message);
		}
	}
	return (
		<>
			<form
				onSubmit={soumettre}
				className="card bg-base-100 w-full max-w-xs mx-auto mt-12 shadow-lg"
			>
				<div className="card-body items-center text-center">
					<h2 className="card-title">Connexion à votre compte</h2>
					<p className="text-xs text-base-content/60">Bienvenu sur Vi'Assist !</p>

					<fieldset className="fieldset w-full text-left">
						<ChampModifier
							id="mail"
							label="Identifiant"
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
				<div className="flex justify-center">
					<a
						className="link link-primary"
						onClick={() => {
							navigate('/inscription');
						}}
					>
						S'inscrire
					</a>
				</div>
			</form>
		</>
	);
}
