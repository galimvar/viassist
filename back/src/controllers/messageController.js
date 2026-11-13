import * as messageService from '../services/messageService.js';
import { ErreurHttp } from '../erreurs.js';

//==================== CONSTANTES GLOBALES ====================//

const DATE_FORMAT = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

//==================== FONCTIONS UTILES ====================//

// Vérification du format de date reçu
function validateDate(date) {
	const errors = {};
	if (typeof date !== 'string' || DATE_FORMAT.test(date) === false) {
		errors.date = 'Le format de date doit être AAAA-MM-JJ';
	} else {
		const parsed = new Date(date);
		if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
			errors.date = 'Date inexistante';
		}
	}
	return errors;
}

// Date du jour si pas de date dans l'URL
function getTodayDate() {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date()); // 'en-CA' (anglais du Canada) en format YYYY-MM-DD
}

//==================== HANDLER(S) ====================//

export async function listMessages(req, res) {
	// 1. Lecture de la date dans l'URL (undefined si absente)
	let date = req.query.date;

	// 2. Si pas de date : getTodayDate
	if (date === undefined) {
		date = getTodayDate();
	}

	// 3. Si mauvais format de date
	const errors = validateDate(date);
	if (Object.keys(errors).length > 0) {
		throw new ErreurHttp(422, 'Données invalides', errors);
	}

	// 4. Transmission de la date au service
	const messages = await messageService.getMessagesByDate(date);
	return res.status(200).json({ messages });
}
