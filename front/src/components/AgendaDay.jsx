import { useState, useEffect } from 'react';

const formaterDate = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});

const AgendaDay = ({ decalage, dateFormat }) => {
	const API = '/api/agenda';

	const [data, setData] = useState();
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const chargerData = async () => {
			try {
				const response = await fetch(`${API}/jour?decalage=${decalage}`);
				if (!response.ok) {
					throw new Error(
						`Erreur ${response.status}: Impossible de charger les evenements`,
					);
				}
				const json = await response.json();
				setData(json);
				dateFormat(formaterDate(Object.keys(json)[0]));
				setEvents(Object.values(json)[0]);
			} catch (error) {
				console.error(error.message);
			}
		};
		chargerData();
	}, [decalage]);

	if (!data) return <p>Chargement…</p>;

	const [date, evenements] = Object.entries(data)[0];

	return (
		<section
			id="displayWindow"
			className="bg-base-100 border border-base-500 h-200 bg-secondary  w-2xl mx-auto overflow-y-auto"
		>
			<div id="BackgroundDailies"></div>
			{events.map((element) => (
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
			))}
		</section>
	);
};

export default AgendaDay;
