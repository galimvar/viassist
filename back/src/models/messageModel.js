import { db } from '../db.js';

export async function findMessagesByDate(date) {
	// TO_CHAR sur la date du message permet de renvoyer la date sous forme de texte
	const { rows } = await db.query(
		`
		SELECT message.id, message.description, TO_CHAR(message.date, 'YYYY-MM-DD') AS date_message, personne.prenom AS prenom_auteur, personne.nom AS nom_auteur, categorie.intitule AS categorie, message.importance
		FROM message
		JOIN personne ON message.personne_id = personne.id
		LEFT JOIN categorie ON message.categorie_id = categorie.id
		WHERE message.date = $1
		ORDER BY message.importance DESC, message.id ASC;`,
		// importance est un ENUM, donc trié par ordre de déclaration. cf. 001-migration : 'faible', 'moyenne', 'élevée'
		// Départage par id (ASC) : à importance égale, les messages s'affichent dans l'ordre où ils ont été enregistrés, pour une lecture chronologique de la journée (message.date n'a pas d'heure)
		[date],
	);

	return rows;
}
