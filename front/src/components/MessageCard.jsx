// Reçoit UNE entrée du journal de bord
// Reçoit le message complet en prop, tel qu'envoyé par GET /api/message :
// { id, description, date_message, prenom_auteur, nom_auteur, categorie, importance }

export default function MessageCard({ message }) {
	return <p>{message.description}</p>;
}
