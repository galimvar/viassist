import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { recupererPersonnes, recupererRoles } from '../api/auth.js';

function ModifierUtilisateur() {
	const location = useLocation();
	const personne = location.state;

	const formateDateReverse = (date) => {
		const dateTab = date.split('T');
		return dateTab[0];
	};

	const [nom, setNom] = useState(personne.nom);
	const [prenom, setPrenom] = useState(personne.prenom);
	const [dateNaissance, setDateNaissance] = useState(formateDateReverse(personne.date_naissance));
	const [mail, setMail] = useState(personne.mail);
	const [role, setRole] = useState(personne.intitule);
	const [erreur, setErreur] = useState(null);
	const [listeRoles, setListeRoles] = useState([]);

	const formateDate = (date) => {
		const dateTab = date.split('-');
		return dateTab.join('/');
	};

	async function soumettre(e) {
		e.preventDefault();
		const newDate = formateDate(dateNaissance);
		try {
			await inscrire({
				nom: nom,
				prenom: prenom,
				date_naissance: newDate,
				mail: mail,
				mot_de_passe: motDePasse,
			});
			//navigate('/connexion');
		} catch (err) {
			setErreur(err.message);
		}
	}

	useEffect(() => {
		const chargerRole = async () => {
			const roles = await recupererRoles();

			setListeRoles(roles.roles);
		};
		chargerRole();
	}, []);

	return (
		<>
			<form
				onSubmit={soumettre}
				className="card bg-base-100 w-full max-w-md mx-auto mt-12 shadow-lg"
			>
				<div className="card-body items-center text-center">
					<h2 className="card-title">Modifier</h2>

					<fieldset className="fieldset w-full text-left">
						<div>
							<label className="label" htmlFor="name">
								Nom
							</label>
							<input
								id="name"
								type="text"
								className="input w-full validator"
								value={nom}
								onChange={(e) => {
									setNom(e.target.value);
								}}
								required
							/>
							<div className="validator-hint">Le nom est obligatoire</div>
						</div>
						<div>
							<label className="label" htmlFor="firstname">
								Prénom
							</label>
							<input
								id="firstname"
								type="text"
								className="input w-full validator"
								value={prenom}
								onChange={(e) => {
									setPrenom(e.target.value);
								}}
								required
							/>
							<p className="validator-hint">Le prénom est obligatoire</p>
						</div>

						<div>
							<label className="label" htmlFor="birthday">
								Date de naissance
							</label>
							<input
								id="birthday"
								type="date"
								className="input w-full validator"
								value={dateNaissance}
								onChange={(e) => {
									setDateNaissance(e.target.value);
								}}
							/>
						</div>

						<div>
							<label className="label" htmlFor="mail">
								Adresse mail
							</label>
							<input
								id="mail"
								type="email"
								className="input w-full validator"
								value={mail}
								onChange={(e) => {
									setMail(e.target.value);
								}}
								required
							/>
							<p className="validator-hint">
								Le mail doit être dans un format valide
							</p>
						</div>
						<select
							className="select [&::picker(select)]:max-h-26"
							value={role}
							onChange={(e) => {
								setRole(this.value);
							}}
						>
							{listeRoles.map((l) => {
								return <option key={l.id}>{l.intitule}</option>;
							})}
						</select>

						{erreur && (
							<div role="alert" className="alert alert-error">
								<CircleX size={20} color="red" strokeWidth={1.75} />
								<span>{erreur}</span>
							</div>
						)}
					</fieldset>

					<button
						className="btn btn-primary w-full mt-4"
						onClick={(e) => {
							soumettre(e);
						}}
					>
						Modifier
					</button>
				</div>
			</form>
		</>
	);
}
export default ModifierUtilisateur;
