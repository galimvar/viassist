import AgendaDay from '../components/AgendaDay';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Agenda = () => {
	const [displayChoice, setDisplayChoice] = useState('Jour');
	const [decalage, setDecalage] = useState(0);
	const [date, setDate] = useState('');

	return (
		<>
			<h2 className="flex justify-self-center mb-10">Agenda</h2>

			<section className="grid grid-col-2 gap-10">
				<div className="grid grid-cols-3" id="enTete">
					<div className="col-start-2 flex justify-center">
						<ChevronLeft color="blue" onClick={() => setDecalage(decalage - 1)} />
						<h3 className="mx-30 justify-center bg-color-red">{date}</h3>
						<ChevronRight color="blue" onClick={() => setDecalage(decalage + 1)} />
					</div>

					<div className="col-start-3 dropdown dropdown-hover">
						<button tabIndex={0} role="button" className="btn m-1">
							{displayChoice}
						</button>
						<ul
							tabIndex={-1}
							className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
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
				</div>

				<section className="justify-items-center align-start ">
					{displayChoice == 'Jour' && (
						<AgendaDay decalage={decalage} dateFormat={setDate} />
					)}
					{displayChoice == 'Semaine' && (
						<AgendaWeek decalage={decalage} dateFormat={setDate} />
					)}
					{displayChoice == 'Mois' && (
						<AgendaMonth decalage={decalage} dateFormat={setDate} />
					)}
				</section>
			</section>
		</>
	);
};
export default Agenda;
