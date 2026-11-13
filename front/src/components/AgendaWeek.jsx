import { useState, useEffect } from 'react';
import { getAgendaWeek } from '../api/auth';

// Pour le titre de la semaine : "lundi 9 novembre"
const formaterDate = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});

// Pour l'en-tête de chaque jour dans la semaine : "lundi 9"
const formaterJour = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
	});

const AgendaWeek = ({ decalage, dateFormat }) => {
	const [data, setData] = useState();
	const [jours, setJours] = useState([]);
	``;
	useEffect(() => {
		const chargerData = async () => {
			const json = await getAgendaWeek(decalage);
			setData(json);
			const jours = Object.keys(json);
			console.log(json);
			dateFormat(`
					Du ${formaterDate(jours[0])} au ${formaterDate(jours[jours.length - 1])},
				`);
		};
		chargerData();
	}, [decalage, dateFormat]);

	if (!data) return <p>Chargement…</p>;

	return (
		<section
			id="displayWindow"
			className="bg-base-100 border border-base-500 h-200 bg-secondary  w-2xl mx-auto overflow-y-auto"
		>
			<div id="BackgroundDailies"></div>
			{jours.map((jour) =>
				jour.map((element) => (
					<details
						className="collapse bg-base-100 border border-base-300"
						name="my-accordion-det-1"
						open
						key={element.id}
					>
						<summary className="collapse-title font-semibold">
							<p>{element.heure_debut}</p>
							<p>{element.intitule}</p>
						</summary>
						<section className="collapse-content text-sm">
							<dl>
								<dt>Description :</dt>
								<dd>{element.description}</dd>
							</dl>
						</section>
					</details>
				)),
			)}
		</section>
	);
};

export default AgendaWeek;
