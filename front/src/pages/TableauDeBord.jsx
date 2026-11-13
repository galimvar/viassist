import { useAuth } from '../context/AuthContext.jsx';

export default function TableauDeBord() {
	const { utilisatrice, deconnexion } = useAuth();
	return (
		<main className="grid h-svh place-items-center bg-base-200 p-4">
			<section className="card w-96 bg-base-100 shadow-sm">
				<figure className="px-6 pt-6">
					{/* Remplace par ton logo */}
					<img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
				</figure>

				<div className="card-body items-center text-center">
					<h1 className="card-title">Bonjour {utilisatrice.prenom}</h1>

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
