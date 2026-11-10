import React from 'react';
import { useNavigate, useLocation } from 'react-router'; // Ajout de useLocation pour l'état actif
import { useAuth } from '../context/AuthContext.jsx';
import { House, Settings, LogOut } from 'lucide-react';

export default function Nav() {
	const navigate = useNavigate();
	const location = useLocation(); // Permet de savoir sur quelle page on se trouve
	const { utilisatrice, deconnexion } = useAuth();

	const liens = [
		{ chemin: '/', label: 'Home', Icone: House },

		//! TODO AJOUTER AGENDA ET JOURNAL ///

		{ chemin: '/compte', label: 'Mon compte', Icone: Settings },
	];

	return (
		<>
			{/* Version Mobile (Dock) */}
			<div className="dock dock-md lg:hidden">
				{liens.map(({ chemin, label, Icone }) => {
					const estActif = location.pathname === chemin;
					return (
						<button
							key={chemin}
							onClick={() => navigate(chemin)}
							className={estActif ? 'dock-active text-primary' : ''}
						>
							<Icone
								size={20}
								className={estActif ? 'text-primary' : 'text-base-content/70'}
								strokeWidth={1.75}
							/>
							<span className="dock-label">{label}</span>
						</button>
					);
				})}
				<button onClick={deconnexion} className="text-error">
					<LogOut size={20} className="text-error" strokeWidth={1.75} />
					<span className="dock-label">Se déconnecter</span>
				</button>
			</div>

			{/* Version Bureau (Navbar) */}
			<nav className="navbar bg-base-100 shadow-md hidden lg:flex px-4">
				<div className="navbar-start gap-2">
					{liens.map(({ chemin, label, Icone }) => {
						const estActif = location.pathname === chemin;
						return (
							<button
								className={`btn btn-ghost gap-2 ${estActif ? 'btn-active text-primary' : 'text-base-content/80'}`}
								key={chemin}
								onClick={() => navigate(chemin)}
							>
								<Icone
									size={20}
									className={estActif ? 'text-primary' : 'text-current'}
									strokeWidth={1.75}
								/>
								<span>{label}</span>
							</button>
						);
					})}
				</div>
				<div className="navbar-end">
					<button
						className="btn btn-ghost gap-2 text-error hover:bg-error/10"
						onClick={deconnexion}
					>
						<LogOut size={20} className="text-error" strokeWidth={1.75} />
						<span>Se déconnecter</span>
					</button>
				</div>
			</nav>
		</>
	);
}
