import { useState, useEffect } from 'react';
import { getAgendaDay } from '../api/auth';

const formaterDateLong = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});

const formaterDateShort = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'short',
	});

const HEURES = Array.from({ length: 24 }, (_, i) => i);
const HAUTEUR_HEURES = 3;

const AgendaDay = ({ decalage, dateFormat }) => {
	const API = '/api/agenda';

	const [data, setData] = useState();
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const chargerData = async () => {
			const json = await getAgendaDay(decalage);
			setData(json);
			dateFormat({
				long: formaterDateLong(Object.keys(json)[0]),
				short: formaterDateShort(Object.keys(json)[0]),
			});

			setEvents(Object.values(json)[0]);
		};
		chargerData();
	}, [decalage]);

	if (!data) return <p>Chargement…</p>;

	const [date, evenements] = Object.entries(data)[0];

	return (
		<section
			id="displayWindow"
			className="border rounded-box w-[66dvw] h-[66dvh] grid grid-cols-[1fr_9fr] overflow-y-auto"
		>
			<div
				aria-hidden="true"
				className="grid grid-rows-[repeat(24,3rem)] justify-self-center"
			>
				{HEURES.map((h) => (
					<p key={h} className="self-start -translate-y-1/2 text-xs first:invisible">
						{String(h).padStart(2, '0')}:00
					</p>
				))}
			</div>

			{/* Colonne 2 : lignes + futurs events */}
			<div className="relative">
				<div aria-hidden="true" className="grid grid-rows-[repeat(24,3rem)] ">
					{HEURES.map((h) => (
						<div key={h} className="border-t border-black first:border-t-0" />
					))}
				</div>
				<div id="events">
					{events.map((element) => {
						const [h, m] = element.heure_debut.split(':').map(Number);
						const y = ((h * 60 + m) * HAUTEUR_HEURES) / 60;

						return (
							<details
								className="absolute top-0 inset-x-1 collapse bg-base-100 border border-base-300 w-[55dvw] open:z-10"
								name="my-accordion-det-1"
								open
								key={element.id}
								style={{ transform: `translateY(${y}rem)` }}
							>
								<summary className="collapse-title font-semibold text-base">
									<time>{element.heure_debut} </time>
									<span>{element.intitule}</span>
								</summary>
								<section className="collapse-content text-sm">
									<dl>
										<dt>Description :</dt>
										<dd>{element.description}</dd>
									</dl>
								</section>
							</details>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default AgendaDay;
