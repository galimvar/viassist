import * as messageService from "../services/messageService.js";

//==================== Fonction(s) utile(s) ====================//

function getTodayDate() {
	const today = new Date();

	const year = today.getFullYear();
	const month = String(today.getMonth() + 1) // index du mois ! donc "+1" pour num du mois (janvier index 0 => +1 pour "01")
		.padStart(2, "0"); // maxLength = 2 ; fillString "0" => complète le num de mois d'un "0" à gauche => 1 devient 01
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

//==================== Handler(s) ====================//


export async function listMessages(req, res) {
	// 1. Lecture de la date dans l'URL (undefined si absente)
	let date = req.query.date;

	// 2. Si pas de date : getTodayDate
	if (date === undefined) {
		date = getTodayDate();
	}

	// 3. Transmission de la date au service
	const messages = await messageService.getMessagesByDate(date);
	return res.status(200).json(messages);
}