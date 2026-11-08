import { useState, useEffect } from 'react';

const Agenda = () => {
	const API = 'http://localhost:5173/api';

	const chargeeData = async () => {
		try {
			const response = await fetch(API + '/jour');

			if (!response.ok) {
				throw new Error(`Erreur ${response.status}: Impossible de charger les evenements`);
			}
			const data = response.json();
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<>
			<h1>C'est ICI que ca commence</h1>
		</>
	);
};

export default Agenda;
