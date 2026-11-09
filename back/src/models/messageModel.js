import { db } from "../db.js";

export async function findMessagesByDate(date) {
	const { rows } = await db.query(`
		SELECT message.id, message.description, message.date AS date_message, personne.prenom AS prenom_auteur, personne.nom AS nom_auteur, categorie.intitule AS categorie, message.importance
		FROM message
		JOIN personne ON message.personne_id = personne.id
		LEFT JOIN categorie ON message.categorie_id = categorie.id
		WHERE message.date = $1
		ORDER BY message.importance DESC;`,	// importance est un ENUM, donc trié par ordre de déclaration. cf. 001-migration : 'faible', 'moyenne', 'élevée'
		[date]);

	return rows;
}