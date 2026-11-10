import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { recupererPersonnes } from '../api/auth.js';
import { UserRoundPen, Trash } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

function Settings() {
	const [personnes, setPersonnes] = useState([]);
	const navigate = useNavigate();

	const deleteUser = (id) => {};

	const openConfirmModal = (modalId) => {
		const dialog = document.getElementById(modalId);
		dialog.showModal(); // Ouvre en mode bloquant

		return new Promise((resolve) => {
			const handleClose = () => {
				dialog.removeEventListener('close', handleClose);
				// dialog.returnValue contient la valeur du bouton cliqué (si méthode="dialog" et value="..." sur les boutons)
				resolve(dialog.returnValue === 'yes');
			};

			dialog.addEventListener('close', handleClose);
		});
	};
	useEffect(() => {
		const chargerDonnees = async () => {
			const donnees = await recupererPersonnes();

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
							<button
								className="btn btn-square btn-ghost"
								onClick={() => {
									navigate('personne/update', {
										state: p,
									});
								}}
							>
								<UserRoundPen
									size={20}
									className="text-current"
									strokeWidth={1.75}
								/>
							</button>
							{p.intitule != 'bénéficiaire' ? (
								<>
									<button
										className="btn btn-square btn-ghost"
										onClick={() => {
											document.getElementById('my_modal_' + p.id).showModal();
											const rep = openConfirmModal('my_modal_' + p.id);
											if (rep === true) deleteUser(p.id);
										}}
									>
										<Trash
											size={20}
											className="text-error"
											strokeWidth={1.75}
										/>
									</button>
									<dialog id={'my_modal_' + p.id} className="modal">
										<div className="modal-box">
											<h3 className="font-bold text-lg">Hello!</h3>
											<p className="py-4">
												Êtes-vous sûr de vouloir supprimer{' '}
												{p.nom + ' ' + p.prenom}
											</p>
											<div className="modal-action">
												<form method="dialog">
													{/* if there is a button in form, it will close the modal */}
													<button className="btn" value={'oui'}>
														Oui
													</button>
													<button className="btn" value={'non'}>
														Non
													</button>
												</form>
											</div>
										</div>
									</dialog>
								</>
							) : (
								''
							)}
						</li>
					);
				})}
			</ul>
		</>
	);
}
export default Settings;
