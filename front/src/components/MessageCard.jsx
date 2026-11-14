// Reçoit UNE entrée du journal de bord
// Reçoit le message complet en prop, tel qu'envoyé par GET /api/message :
// { id, description, date_message, prenom_auteur, nom_auteur, categorie, importance }

export default function MessageCard({ message }) {
	return (
		<article>
			<p>
				Par {message.prenom_auteur} {message.nom_auteur}
			</p>
			<p>
				Importance : {message.importance}
				{' - '}
				{message.categorie !== null ? message.categorie : 'Sans catégorie'}
			</p>
			<p>{message.description}</p>
		</article>
	);
}
