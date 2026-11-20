import { useState, useEffect } from 'react';
import { getAgendaWeek } from '../api/auth';

// Function to adjust the display of the date. Long : vendredi 20 decembre, short : vendredi 20 dec. .
const formaterDateLong = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
	});

const formaterDateShort = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
	});

// Creating an empty array of 24 index from array-like {length: 24}. "_" means we do not use the orignal value which is undefined and we replace it by i.
// So for each with loop we return i as the value of each index.
const HEURES = Array.from({ length: 24 }, (_, i) => i);
//Same here but for 7 days
const JOURS = Array.from({ length: 7 }, (_, i) => i);

//Setup of high for every bloc and separation between lines of agenda background
const HAUTEUR_HEURES = 3;

const AgendaWeek = ({ decalage, dateFormat }) => {
	const [data, setData] = useState();
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const chargerData = async () => {
			const json = await getAgendaWeek(decalage);
			setData(json);
			dateFormat({
				long: formaterDateLong(Object.keys(json)[0]),
				short: formaterDateShort(Object.keys(json)[0]),
			});

			setEvents(Object.values(json)[0]);
		};
		chargerData();
	}, [decalage]);

	if (!data)
		return (
			<div className="flex justify-self-center items-center h-[60dvh]">
				<span className="loading loading-spinner w-24 text-info "></span>
			</div>
		);

	return (
		// The section is about the display bloc of the agenda
		<section id="displayWindow" className="border rounded-box bg-base-200 w-[90dvw]">
			<div id="weekDisplay" className="grid grid-cols-[repeat(7,12.5dvw)] ml-4">
				{JOURS.map((jour) => (
					<div className="grid grid-cols-[1fr_3fr]">
						{/* Colonne 1 : Time display */}
						<div
							aria-hidden="true"
							className="grid grid-rows-[repeat(24,3rem)] justify-self-center"
						>
							{/* Display of the time reference. padStart to avoid having one digit - from 9:00 to 09:00*/}
							{HEURES.map((hour) => (
								<p
									key={hour}
									className="self-start -translate-y-1/2 text-sm first:invisible"
								>
									{String(hour).padStart(2, '0')}:00
								</p>
							))}
						</div>
						<div className="relative">
							{/* Lines display */}
							<div aria-hidden="true" className="grid grid-rows-[repeat(24,3rem)] ">
								{HEURES.map((hour) => (
									<div
										key={hour}
										className="border-t border-black first:border-t-0 mx-1 mr-3"
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
			{/* Event display */}
			{/* <div id="events">
				{events.map((element) => {
					const [hour, minute] = element.heure_debut.split(':').map(Number);
					// Calcul where the even have to be place in the agenda
					const y = ((hour * 60 + minute) * HAUTEUR_HEURES) / 60;

					return (
						// Each event will be displayed as follow
						<details
							className="absolute top-0 inset-x-1 collapse bg-base-100 border border-base-300 w-[55dvw] open:z-10 justify-self-center"
							name="my-accordion-det-1"
							open
							key={element.id}
							style={{ transform: `translateY(${y}rem)` }}
						> */}
			{/* Here is the name and time of the event. padEnd is to prevent the minutes to display incorrectly */}
			{/* <summary className="collapse-title font-semibold text-base">
								<time>{`${hour}:${String(minute).padEnd(2, '0')}`} </time>
								<span>{element.intitule}</span>
							</summary> */}

			{/* Here is the commentary section of each events */}
			{/* <section className="collapse-content text-sm">
								<dl>
									<dt>Description :</dt>
									<dd>{element.description}</dd>
								</dl>
							</section>
						</details>
					);
				})}
			</div> */}
		</section>
	);
};

export default AgendaWeek;
