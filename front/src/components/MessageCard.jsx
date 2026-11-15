// Reçoit UNE entrée du journal de bord
// Reçoit le message complet en prop, tel qu'envoyé par GET /api/message :
// { id, description, date_message, prenom_auteur, nom_auteur, categorie, importance }

export default function MessageCard({ message }) {
	return (
		<article className="card bg-base-200 shadow-md">
			<div className="card-body">
				<h3 className="card-title">
					{message.categorie !== null ? message.categorie : 'Sans catégorie'}
				</h3>

				{/* TEMPORAIRE car deviendra une couleur uniquement */}
				<p className="text-sm">Importance : {message.importance}</p>

				<p>
					<span className="underline">Auteur :</span> {message.prenom_auteur}{' '}
					{message.nom_auteur}
				</p>

				<p>{message.description}</p>
			</div>
		</article>
	);
}
