import { useState, useEffect } from 'react';
import { getAgendaWeek } from '../api/auth';
import { Stethoscope, HouseHeart, UserRoundGroup } from 'lucide-react';

// Function to adjust the display of the date. Long : vendredi 20 decembre, short : vendredi 20 dec. .
const formaterDateLong = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		day: 'numeric',
	});

const formaterDateShort = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'short',
	});

// Setup class color for the events regarding their type
const COULEURS = {
	Médical: 'bg-blue-100 text-blue-700 border-blue-300',
	Paramédical: 'bg-blue-100 text-blue-700 border-blue-300',
	Autres: 'bg-green-100 text-green-700 border-green-300',
	Proches: 'bg-green-100 text-green-700 border-green-300',
};
const COULEUR_DEFAUT = 'bg-orange-100 text-orange-700';

// Creating an empty array of 24 index from array-like {length: 24}. "_" means we do not use the orignal value which is undefined and we replace it by i.
// So for each with loop we return i as the value of each index.
const HEURES = Array.from({ length: 24 }, (_, i) => i);

//Setup of high for every bloc and separation between lines of agenda background
const HAUTEUR_HEURES = 3;

const AgendaWeek = ({ decalage, dateFormat }) => {
	const [data, setData] = useState();

	useEffect(() => {
		const chargerData = async () => {
			const json = await getAgendaWeek(decalage);
			setData(json);
			dateFormat({
				long: `du ${formaterDateLong(Object.keys(json)[0])} au ${formaterDateLong(
					Object.keys(json)[Object.keys(json).length - 1],
				)}`,
				short: `du ${formaterDateShort(Object.keys(json)[0])} au ${formaterDateShort(
					Object.keys(json)[Object.keys(json).length - 1],
				)}`,
			});
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
		<>
			<section>
				<ul className="grid grid-cols-[1fr_1fr_1fr] gap-10">
					<li className="col-start-1 grid grid-cols-[1fr_1fr]">
						<Stethoscope size={32} color="blue" className="justify-self-end" />
						<span className="lg:text-base text-xs text-blue-700">
							Médical/Paramédical
						</span>
					</li>
					<li className="col-start-2 grid grid-cols-[1fr_1fr]">
						<HouseHeart size={32} color="orange" className="justify-self-end" />
						<span className="lg:text-base text-xs text-orange-700">
							Aide à domicile
						</span>
					</li>
					<li className="col-start-3 grid grid-cols-[1fr_1fr]">
						<UserRoundGroup size={32} color="green" className="justify-self-end" />
						<span className="lg:text-base text-xs text-green-700">Proche/Autre</span>
					</li>
				</ul>
			</section>
			<section
				id="displayWindow"
				className="grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr_40fr] border rounded-box bg-gray-50 lg:w-[95dvw] lg:h-[66dvh] overflow-y-auto overflow-x-auto w-[95dvw] h-[66dvh]"
			>
				<div className="grid grid-cols-[repeat(7,12.5dvw)] row-start-1 col-start-2 lg:ml-2">
					<p key="L" className="justify-self-center text-xs lg:text-base">
						Lundi
					</p>
					<p key="Ma" className="justify-self-center text-xs lg:text-base">
						Mardi
					</p>
					<p key="Me" className="justify-self-center text-xs lg:text-base">
						Mercredi
					</p>
					<p key="J" className="justify-self-center text-xs lg:text-base">
						Jeudi
					</p>
					<p key="V" className="justify-self-center text-xs lg:text-base">
						Vendredi
					</p>
					<p key="S" className="justify-self-center text-xs lg:text-base">
						Samedi
					</p>
					<p key="D" className="justify-self-center text-xs lg:text-base">
						Dimanche
					</p>
				</div>
				{/* Colonne 1 : Time display */}
				<div
					aria-hidden="true"
					className="grid grid-rows-[repeat(24,3rem)] justify-self-center row-start-2 lg:ml-2 "
				>
					{/* Display of the time reference. padStart to avoid having one digit - from 9:00 to 09:00*/}
					{HEURES.map((hour) => (
						<p
							key={hour}
							className="self-start -translate-y-1/2 text-sm first:invisible lg:text-base text-xs"
						>
							{String(hour).padStart(2, '0')}:00
						</p>
					))}
				</div>

				{/* Colonne 2 : lines + futurs events */}
				<div
					id="weekDisplay"
					className="grid grid-cols-[repeat(7,12.5dvw)] ml-0 row-start-2 mb-2 lg:ml-2"
				>
					{Object.keys(data).map((jour) => (
						<div key={jour} className="relative">
							<div>
								{/* Lines display */}
								<div
									aria-hidden="true"
									className="grid grid-rows-[repeat(24,3rem)] "
								>
									{HEURES.map((hour) => (
										<div
											key={hour}
											className="border-t border-black first:border-t-0 border-l"
										/>
									))}
								</div>
								<div id="events">
									{data[jour].map((element) => {
										const [hour, minute] = element.heure_debut
											.split(':')
											.map(Number);
										// Calcul where the even have to be place in the agenda
										const y = ((hour * 60 + minute) * HAUTEUR_HEURES) / 60;
										console.log(element.type_evenement.intitule);

										return (
											// Each event will be displayed as follow
											<details
												className={`group absolute top-0 collapse border border-base-300 w-[12dvw] open:z-10 justify-self-center ${
													COULEURS[element.type_evenement.intitule] ??
													COULEUR_DEFAUT
												}`}
												name="my-accordion-det-1"
												key={element.id}
												style={{ transform: `translateY(${y}rem)` }}
											>
												{/* Event time and title. padStart adds a leading zero so hours and minutes always have 2 digits (9:5 → 09:05) */}{' '}
												<summary className="collapse-title font-semibold text-xs truncate group-open:whitespace-normal">
													<time>
														{`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`}
													</time>{' '}
													<span>{element.intitule}</span>
												</summary>
												{/* Here is the commentary section of each events */}
												<section className="collapse-content text-xs">
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
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export default AgendaWeek;
