import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { useBeneficiaire } from '../context/BeneficiaireContext.jsx';
import {
	House,
	UsersRound,
	ArrowLeftRight,
	LogOut,
	UserRound,
	CalendarRange,
	BookOpenText,
	Menu,
} from 'lucide-react';
import { ROLES, AGENDA_ROLES, JOURNAL_ROLES } from '../constantes/roles.js';

const MENU_ID = 'menu-plus';

export default function Nav() {
	const navigate = useNavigate();
	const location = useLocation();
	const { deconnexion } = useAuth();
	const { actif, role } = useBeneficiaire(); // role : mon rôle chez le bénéficiaire actif

	const liens = [
		{ chemin: '/', label: 'Home', Icone: House },
		{
			chemin: '/agenda',
			label: 'Agenda',
			Icone: CalendarRange,
			roles: AGENDA_ROLES,
		},
		{
			chemin: '/journal',
			label: 'Journal',
			Icone: BookOpenText,
			roles: JOURNAL_ROLES,
		},
		// secondaire: true -> dans le menu « Plus » sur mobile, dans la navbar sur desktop
		{ chemin: '/compte', label: 'Mon compte', Icone: UserRound, secondaire: true },
		{
			chemin: '/membres',
			label: 'Membres',
			Icone: UsersRound,
			roles: [ROLES.ADMIN],
			secondaire: true,
		},
		{
			chemin: '/beneficiaires',
			label: actif ? 'Changer de bénéficiaire' : 'Bénéficiaires',
			Icone: ArrowLeftRight,
			secondaire: true,
		},
	].filter((l) => !l.roles || l.roles.includes(role));

	const liensPrincipaux = liens.filter((l) => !l.secondaire);
	const liensSecondaires = liens.filter((l) => l.secondaire);

	// « Plus » est actif quand on est sur une page qu'il contient
	const plusActif = liensSecondaires.some((l) => l.chemin === location.pathname);

	const fermerMenu = () => document.getElementById(MENU_ID)?.hidePopover();

	return (
		<>
			{/* Version Mobile (Dock) */}
			<div className="dock dock-md lg:hidden">
				{liensPrincipaux.map(({ chemin, label, Icone }) => {
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

				{/* Dernier élément du dock : ouvre le menu « Plus » */}
				<button
					type="button"
					popoverTarget={MENU_ID}
					style={{ anchorName: '--anchor-plus' }}
					className={plusActif ? 'dock-active text-primary' : ''}
				>
					<Menu
						size={20}
						className={plusActif ? 'text-primary' : 'text-base-content/70'}
						strokeWidth={1.75}
					/>
					<span className="dock-label">Plus</span>
				</button>
			</div>

			{/* Menu « Plus » */}
			<ul
				id={MENU_ID}
				popover="auto"
				style={{ positionAnchor: '--anchor-plus' }}
				className="dropdown dropdown-top dropdown-end menu bg-base-100 rounded-box w-56 p-2 shadow-md mb-2 lg:hidden"
			>
				{liensSecondaires.map(({ chemin, label, Icone }) => (
					<li key={chemin}>
						<button
							type="button"
							className={location.pathname === chemin ? 'menu-active' : ''}
							onClick={() => {
								fermerMenu();
								navigate(chemin);
							}}
						>
							<Icone size={20} strokeWidth={1.75} aria-hidden="true" />
							{label}
						</button>
					</li>
				))}
				<li>
					<button
						type="button"
						className="text-error"
						onClick={() => {
							fermerMenu();
							deconnexion();
						}}
					>
						<LogOut size={20} strokeWidth={1.75} aria-hidden="true" />
						Se déconnecter
					</button>
				</li>
			</ul>

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
				<div className="navbar-end gap-2">
					{actif && (
						<span className="badge badge-soft badge-primary">
							{actif.prenom} {actif.nom}
						</span>
					)}
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
