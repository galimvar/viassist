import { useAuth } from '../context/AuthContext.jsx';

export default function TableauDeBord() {
	const { utilisatrice, deconnexion } = useAuth();
	return (
		<main className="carte-form">
			<h1>Bonjour {utilisatrice.prenom}</h1>
			<p>Tu es connectée en tant que {utilisatrice.role}.</p>
			<button className="btn btn-primary mt-4" type="button" onClick={deconnexion}>
				Se déconnecter
			</button>
		</main>
	);
}
