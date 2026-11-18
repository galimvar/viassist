import AgendaDay from '../components/AgendaDay';
import AgendaWeek from '../components/AgendaWeek';
import { useState, useEffect } from 'react';
import {
	ChevronRight,
	ChevronLeft,
	CalendarPlus,
	TriangleAlert,
	OctagonAlert,
	SquareExclamationPoint,
} from 'lucide-react';

const Agenda = () => {
	const [displayChoice, setDisplayChoice] = useState('Jour');
	const [decalage, setDecalage] = useState(0);
	const [date, setDate] = useState('');

	return (
		<>
			<h2 className="flex justify-self-center mb-10">Agenda</h2>

			<section className="grid grid-rows[1fr_3fr]">
				<div id="enTete" className="grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[1fr_1fr]">
					<div className="col-start-2 flex justify-center pl-20">
						<button
							type="button"
							aria-label="Jour précédent"
							className="text-primary hover:text-secondary mr-5"
							onClick={() => setDecalage(decalage - 1)}
						>
							<ChevronLeft size={32} />
						</button>
						<h3 className="text-center lg:w-[30dvw] w-[20dvw] whitespace-nowrap translate-y-1/6">
							<span className="hidden lg:inline lg:mx-20 text-xl">{date.long}</span>
							<span className="lg:hidden my-5">{date.short}</span>
						</h3>

						<button
							type="button"
							aria-label="Jour suivant"
							className="text-primary hover:text-secondary ml-5"
							onClick={() => setDecalage(decalage + 1)}
						>
							<ChevronRight size={32} />
						</button>
					</div>
					<div className="col-start-2 row-start-2 flex justify-start">
						<TriangleAlert className="size-5 mr-1" color="red" />
						<span className="mr-10">Urgent</span>
						<OctagonAlert className="size-5 mr-1" color="orange" />
						<span className="mr-10">Important</span>
						<SquareExclamationPoint className="size-5 mr-1" color="green" />
						<span className="mr-10">Rendez-vous</span>
					</div>

					<div className="dropdown dropdown-hover dropdown-center justify-self-center">
						<button tabIndex={0} role="button" className="btn m-1">
							{displayChoice}
						</button>
						<ul
							tabIndex={-1}
							className="dropdown-content menu bg-base-200 rounded-box z-1 w-25 p-2 shadow-sm mx-auto"
						>
							<li>
								<a onClick={() => setDisplayChoice('Jour')}>Jour</a>
							</li>
							<li>
								<a onClick={() => setDisplayChoice('Semaine')}>Semaine</a>
							</li>
							<li>
								<a onClick={() => setDisplayChoice('Mois')}>Mois</a>
							</li>
						</ul>
					</div>
					<button className="col-start-4 justify-self-end text-primary hover:text-secondary bg-base-200 rounded-l-(--radius-box) -mr-4 pr-2 overflow-x-clip">
						<CalendarPlus className="lg:size-15 size-10" />
					</button>
				</div>

				<article
					id="agendaImport"
					className="justify-items-center align-start lg:h-[66dvh] lg:w-full w-[90dvw] mx-auto"
				>
					{displayChoice == 'Jour' && (
						<AgendaDay decalage={decalage} dateFormat={setDate} />
					)}
					{displayChoice == 'Semaine' && (
						<AgendaWeek decalage={decalage} dateFormat={setDate} />
					)}
					{displayChoice == 'Mois' && (
						<AgendaMonth decalage={decalage} dateFormat={setDate} />
					)}
				</article>
			</section>
		</>
	);
};
export default Agenda;
