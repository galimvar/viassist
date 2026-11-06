import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
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
		<form
			onSubmit={soumettre}
			className="card bg-base-100 w-full max-w-xs mx-auto mt-12 shadow-lg"
		>
			<div className="card-body items-center text-center">
				<h2 className="card-title">Connexion à votre compte</h2>
				<p className="text-xs text-base-content/60">Bienvenu sur Vi'Assist !</p>

				<fieldset className="fieldset w-full text-left">
					<label className="label" htmlFor="username">
						Identifiant
					</label>
					<input
						id="username"
						type="email"
						className="input w-full"
						placeholder="example@example.com"
						onChange={(e) => {
							setMail(e.target.value);
						}}
					/>

					<label className="label" htmlFor="password">
						Mot de passe
					</label>
					<input
						id="password"
						type="password"
						className="input w-full"
						placeholder="••••••••"
						onChange={(e) => {
							setMotDePasse(e.target.value);
						}}
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
		</form>
	);
}
