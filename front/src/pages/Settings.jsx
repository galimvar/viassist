import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { recupererPersonnes } from '../api/auth.js';
import { UserRoundPen, Trash } from 'lucide-react';

function Settings() {
	const [personnes, setPersonnes] = useState([]);

	useEffect(() => {
		const chargerDonnees = async () => {
			const donnees = await recupererPersonnes();
			console.log(donnees.personnes);
			if (donnees) {
				setPersonnes(donnees.personnes);
			}
		};

		chargerDonnees();
	}, []);

	return (
		<>
			<h1>Settings</h1>
			<ul className="list bg-base-100 rounded-box shadow-md">
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Utilisateurs</li>
				{personnes.map((p) => {
					return (
						<li className="list-row grid grid-cols-7" key={p.id}>
							<div className="text-4xl font-thin opacity-30 tabular-nums">{p.id}</div>

							<div className="list-col-grow">
								<div>{p.prenom}</div>
								<div className="text-xs uppercase font-semibold opacity-60">
									{p.nom}
								</div>
							</div>
							<div className="list-col-grow">
								<div>{p.date_naissance}</div>
							</div>
							<div className="list-col-grow">
								<div>{p.mail}</div>
							</div>
							<div className="list-col-grow">
								<div>Rôle</div>
								<div className="text-xs uppercase font-semibold opacity-60">
									{p.intitule}
								</div>
							</div>
							<button className="btn btn-square btn-ghost">
								<UserRoundPen
									size={20}
									className="text-current"
									strokeWidth={1.75}
								/>
							</button>
							<button className="btn btn-square btn-ghost">
								<Trash size={20} className="text-error" strokeWidth={1.75} />
							</button>
						</li>
					);
				})}
			</ul>
		</>
	);
}
export default Settings;
