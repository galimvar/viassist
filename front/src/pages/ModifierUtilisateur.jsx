import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router';
import { modifierPersonne, recupererPersonnes, recupererRoles } from '../api/auth.js';
import { CircleX } from 'lucide-react';
import ChampModifier from '../components/ChampModifier.jsx';
import SelectModifier from '../components/SelectModifier.jsx';

function ModifierUtilisateur() {
	const location = useLocation();
	const personne = location.state;
	const navigate = useNavigate();

	const formateDateReverse = (date) => {
		const dateTab = date.split('T');
		return dateTab[0];
	};

	const [nom, setNom] = useState(personne.nom);
	const [prenom, setPrenom] = useState(personne.prenom);
	const [dateNaissance, setDateNaissance] = useState(formateDateReverse(personne.date_naissance));
	const [mail, setMail] = useState(personne.mail);
	const [role, setRole] = useState(personne.role_id);
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
			await modifierPersonne(
				{
					nom: nom,
					prenom: prenom,
					date_naissance: newDate,
					mail: mail,
					role_id: role,
				},
				personne.id,
			);
			navigate('/settings');
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
						<ChampModifier
							id="nom"
							label="Nom"
							value={nom}
							onChange={setNom}
							error={'Le nom est requis.'}
							className="input w-full validator"
							required
						/>

						<ChampModifier
							id="prenom"
							label="Prénom"
							value={prenom}
							onChange={setPrenom}
							error={'Le prénom est requis.'}
							className="input w-full validator"
							required
						/>

						<ChampModifier
							id="dateNaissance"
							label="Date de naissance"
							type="date"
							value={dateNaissance}
							onChange={setDateNaissance}
							error={'La date de naissance doit être au bon format !'}
							className="input w-full validator"
						/>

						<ChampModifier
							id="mail"
							label="Adresse mail"
							type="email"
							value={mail}
							onChange={setMail}
							error={'Le mail est requis, au bon format'}
							className="input w-full validator"
							pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
							required
						/>

						<SelectModifier value={role} onChange={setRole} liste={listeRoles} />

						{erreur && (
							<div role="alert" className="alert alert-error">
								<CircleX size={20} color="red" strokeWidth={1.75} />
								<span>{erreur}</span>
							</div>
						)}
					</fieldset>

					<button className="btn btn-primary w-full mt-4">Modifier</button>
				</div>
			</form>
		</>
	);
}
export default ModifierUtilisateur;
