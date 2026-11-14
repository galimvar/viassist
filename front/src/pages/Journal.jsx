import { useState, useEffect } from 'react';
import { getMessagesByDate } from '../api/auth.js';

//==================== FONCTIONS UTILES ====================//
function getTodayDate() {
	const today = new Date();

	const year = today.getFullYear();
	const month = String(today.getMonth() + 1) // index du mois ! donc "+1" pour num du mois (janvier index 0 => +1 pour "01")
		.padStart(2, '0'); // maxLength = 2 ; fillString "0" => complète le num de mois d'un "0" à gauche => 1 devient 01
	const day = String(today.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

//==================== COMPOSANT ====================//
export default function Journal() {
	const [selectedDate, setSelectedDate] = useState(getTodayDate());
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const loadMessages = async () => {
			const data = await getMessagesByDate(selectedDate);
			setMessages(data.messages);
		};
		loadMessages();
	}, [selectedDate]);

	return (
		<>
			<h2>Journal</h2>

			{messages.length === 0 && <p>Aucun message</p>}

			{/* TEMPORAIRE : affichage brut pour vérifier les données */}
			<p>{messages.length} message(s)</p>
			<pre>{JSON.stringify(messages, null, 2)}</pre>
		</>
	);
}
