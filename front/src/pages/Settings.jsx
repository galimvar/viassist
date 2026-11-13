import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { recupererPersonnes, supprimerPersonne } from '../api/auth.js';
import { UserRoundPen, Trash, CircleX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

function Settings() {
	const [personnes, setPersonnes] = useState([]);
	const navigate = useNavigate();
	const [erreur, setErreur] = useState(null);

	const deleteUser = async (id) => {
		try {
			await supprimerPersonne(id);
			chargerDonnees();
		} catch (err) {
			setErreur(err.message);
		}
	};

	const formateDateReverse = (date) => {
		let dateTab = date.split('T');
		dateTab = dateTab[0].split('-');
		return dateTab[2] + '/' + dateTab[1] + '/' + dateTab[0];
	};

	const formateDate = (date) => {
		const dateTab = date.split('-');
		return dateTab.join('/');
	};

	const openConfirmModal = (modalId) => {
		const dialog = document.getElementById(modalId);
		dialog.showModal(); // Ouvre en mode bloquant

		return new Promise((resolve) => {
			const handleClose = () => {
				dialog.removeEventListener('close', handleClose);

				resolve(dialog.returnValue === 'oui');
			};

			dialog.addEventListener('close', handleClose);
		});
	};

	const chargerDonnees = async () => {
		const donnees = await recupererPersonnes();

		if (donnees) {
			setPersonnes(donnees.personnes);
		}
	};

	useEffect(() => {
		chargerDonnees();
	}, []);

	return (
		<>
			<h1>Settings</h1>

			<ul className="list bg-base-100 rounded-box shadow-md">
				{erreur && (
					<div role="alert" className="alert alert-error absolute right w-full">
						<CircleX size={20} color="red" strokeWidth={1.75} />
						<span>{erreur}</span>
					</div>
				)}
				<li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Utilisateurs</li>
				{personnes.map((p) => {
					return (
						<li className="list-row grid grid-cols-6" key={p.id}>
							<div className="text-4xl font-thin opacity-30 tabular-nums">{p.id}</div>

							<div className="list-col-grow">
								<div>{p.prenom}</div>
								<div className="text-xs uppercase font-semibold opacity-60">
									{p.nom}
								</div>
							</div>
							<div className="list-col-grow">
								<div>{formateDate(formateDateReverse(p.date_naissance))}</div>
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
							<div>
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
											onClick={async () => {
												document
													.getElementById('my_modal_' + p.id)
													.showModal();
												const rep = await openConfirmModal(
													'my_modal_' + p.id,
												);

												if (rep === true)
													try {
														deleteUser(p.id);
													} catch {
														setErreur(err.message);
													}
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
							</div>
						</li>
					);
				})}
			</ul>
		</>
	);
}
export default Settings;
