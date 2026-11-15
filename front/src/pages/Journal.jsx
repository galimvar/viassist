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
		let isOutdated = false; // passera à true si une autre date est choisie entre-temps

		const loadMessages = async () => {
			setIsLoading(true); // un nouveau chargement commence
			setErrorMessage(null); // on efface une éventuelle erreur précédente

			try {
				const data = await getMessagesByDate(selectedDate);
				if (isOutdated === false) {
					setMessages(data.messages);
				}
			} catch (error) {
				if (isOutdated === false) {
					console.error(error);
					setMessages([]); // pas de données affichées en cas d'erreur
					setErrorMessage('Impossible de charger les messages. Réessayez plus tard.');
				}
			} finally {
				if (isOutdated === false) {
					setIsLoading(false); // chargement terminé (erreur ou pas)
				}
			}
		};
		loadMessages();

		// Nettoyage : exécuté avant le prochain effet (nouvelle date) ou quand on quitte la page
		return () => {
			isOutdated = true;
		};
	}, [selectedDate]);

	// Appelée à chaque changement dans le champ de date
	function handleChangeDate(event) {
		const newDate = event.target.value; // chaîne 'AAAA-MM-JJ' ou '' si le champ est vidé

		if (newDate !== '') {
			setSelectedDate(newDate); // le useEffect se relance et recharge les messages
		}
	}

	return (
		<>
			<h2 className="sr-only">Journal de bord</h2>

			<div className="flex justify-center items-center gap-4 mb-10">
				<label className="label" htmlFor="journal-date">
					Date
				</label>
				<input
					className="input"
					id="journal-date"
					type="date"
					value={selectedDate}
					onChange={handleChangeDate}
				/>
			</div>

			{isLoading === true && <p role="status">Chargement...</p>}

			{errorMessage !== null && <p role="alert">{errorMessage}</p>}

			{isLoading === false && errorMessage === null && messages.length === 0 && (
				<p>Aucun message</p>
			)}

			<section className="flex flex-col gap-4 max-w-2xl mx-auto">
				{messages.map((message) => {
					return <MessageCard key={message.id} message={message} />;
				})}
			</section>
		</>
	);
}
