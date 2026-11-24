import { useAuth } from '../context/AuthContext.jsx';
import { useBeneficiaire } from '../context/BeneficiaireContext.jsx';
import { enTantQue } from '../constantes/roles.js';
import logo from '../../../conception/visuals_references/logo/logo2.png';

export default function TableauDeBord() {
	const { utilisatrice, deconnexion } = useAuth();
	const { actif } = useBeneficiaire();
	return (
		<main className="grid h-svh place-items-center bg-base-200 p-4">
			<section className="card w-full bg-base-100 shadow-sm md:w-96">
				<figure className="px-6 pt-6">
					<img src={logo} alt="logo Vi'assist" width={160} className="h-16 w-auto" />
				</figure>

				<div className="card-body items-center text-center">
					<h1 className="card-title">Bonjour {utilisatrice.prenom}</h1>
					<p>
						Vous accompagnez{' '}
						<strong>
							{actif.prenom} {actif.nom}
						</strong>{' '}
						{enTantQue(actif.role)}.
					</p>

					<div role="alert" className="alert alert-success alert-soft">
						<span>Connexion réussie.</span>
					</div>

					<div className="card-actions mt-2">
						<button className="btn btn-primary" type="button" onClick={deconnexion}>
							Se déconnecter
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}
