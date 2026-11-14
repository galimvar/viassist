import { useState, useEffect } from 'react';
import { getMessagesByDate } from '../api/auth.js';
import MessageCard from '../components/MessageCard.jsx';

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
	const [isLoading, setIsLoading] = useState(true); // true : au 1er affichage, l'appel va partir
	const [errorMessage, setErrorMessage] = useState(null); // null : pas d'erreur

	useEffect(() => {
		const loadMessages = async () => {
			setIsLoading(true); // un nouveau chargement commence
			setErrorMessage(null); // on efface une éventuelle erreur précédente

			try {
				const data = await getMessagesByDate(selectedDate);
				setMessages(data.messages);
			} catch (error) {
				console.error(error);
				setMessages([]); // pas de données affichées en cas d'erreur
				setErrorMessage('Impossible de charger les messages. Réessayez plus tard.');
			} finally {
				setIsLoading(false); // chargement terminé (erreur ou pas)
			}
		};
		loadMessages();
	}, [selectedDate]);

	return (
		<>
			<h2>Journal</h2>

			{isLoading === true && <p role="status">Chargement...</p>}

			{errorMessage !== null && <p role="alert">{errorMessage}</p>}

			{isLoading === false && errorMessage === null && messages.length === 0 && <p>Aucun message</p>}

			{/* TEMPORAIRE : test de MessageCard avec le premier message */}
			{messages.length > 0 && <MessageCard message={messages[0]} />}

			{/* TEMPORAIRE : affichage brut pour vérifier les données */}
			<p>{messages.length} message(s)</p>
			<pre>{JSON.stringify(messages, null, 2)}</pre>
		</>
	);
}
