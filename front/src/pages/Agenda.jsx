import AgendaDay from '../components/AgendaDay';
import AgendaWeek from '../components/AgendaWeek';
import AgendaMonth from '../components/AgendaMonth';
import { useState, useEffect } from 'react';
import {
	ChevronRight,
	ChevronLeft,
	CalendarPlus,
	TriangleAlert,
	OctagonAlert,
	SquareExclamationPoint,
	Menu,
} from 'lucide-react';

const Agenda = () => {
	const [displayChoice, setDisplayChoice] = useState('Jour');
	const [decalage, setDecalage] = useState(0);
	const [date, setDate] = useState('');

	return (
		<>
			<section className="grid grid-rows[1fr_1fr_5fr]">
				<div
					id="enTete"
					className="grid row-start-1 grid-cols-[1fr_5fr_1fr] grid-rows-[1fr_1fr] lg:grid-rows-[1fr]"
				>
					{/* Filter Button */}
					<div className="dropdown dropdown-right justify-self-start self-center row-start-2">
						<button
							tabIndex={0}
							role="button"
							className="text-primary hover:text-secondary bg-base-200 rounded-r-(--radius-box) -ml-4 overflow-x-clip cursor-pointer"
						>
							<Menu className="lg:size-10 size-6 m-2 cursor-pointer" />
						</button>
						<form
							tabIndex={-1}
							className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
						></form>
					</div>
					<div className="col-start-2 flex justify-center row-start-1">
						<button
							type="button"
							aria-label="Jour précédent"
							className="text-primary hover:text-secondary mr-5 cursor-pointer lg:size-7 size-4 self-center"
							onClick={() => setDecalage(decalage - 1)}
						>
							<ChevronLeft />
						</button>
						<h3 className="text-center lg:w-[30dvw] w-[20dvw] whitespace-nowrap translate-y-1/6">
							<span className="hidden lg:inline lg:mx-20 text-xl">{date.long}</span>
							<span className="lg:hidden my-5 text-xs text-wrap">{date.short}</span>
						</h3>

						<button
							type="button"
							aria-label="Jour suivant"
							className="text-primary hover:text-secondary ml-5 cursor-pointer lg:size-7 size-4 self-center"
							onClick={() => setDecalage(decalage + 1)}
						>
							<ChevronRight />
						</button>
					</div>

					<div className="dropdown dropdown-hover dropdown-center justify-self-center self-center row-start-2">
						<button tabIndex={0} role="button" className="btn m-1 text-xs lg:text-base">
							{displayChoice}
						</button>
						<ul
							tabIndex={-1}
							className="dropdown-content menu bg-base-200 rounded-box z-1 w-25 p-2 shadow-sm mx-auto text-xs lg:text-base"
						>
							<li>
								<a
									className="text-xs lg:text-base"
									onClick={() => setDisplayChoice('Jour')}
								>
									Jour
								</a>
							</li>
							<li>
								<a
									className="text-xs lg:text-base"
									onClick={() => setDisplayChoice('Semaine')}
								>
									Semaine
								</a>
							</li>
							<li>
								<a
									className="text-xs lg:text-base"
									onClick={() => setDisplayChoice('Mois')}
								>
									Mois
								</a>
							</li>
						</ul>
					</div>
					<div className="dropdown dropdown-left justify-self-end self-center row-start-2 col-start-3">
						<button
							tabIndex={0}
							role="button"
							className="text-primary hover:text-secondary bg-base-200 rounded-l-(--radius-box) -mr-4 overflow-x-clip cursor-pointer"
						>
							<CalendarPlus className="lg:size-10 size-6 m-2 cursor-pointer" />
						</button>
						<form
							tabIndex={-1}
							className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
						></form>
					</div>
				</div>

				<article
					id="agendaImport"
					className="justify-items-center row-start-3 align-start lg:h-[66dvh] lg:w-full w-[90dvw] mx-auto"
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
