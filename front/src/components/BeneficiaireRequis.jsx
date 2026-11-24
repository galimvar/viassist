import { Navigate, Outlet } from 'react-router';
import { useBeneficiaire } from '../context/BeneficiaireContext.jsx';

// Layout route : il faut un bénéficiaire actif (sinon → écran de choix).
// roles (optionnel) : rôles autorisés CHEZ CE bénéficiaire. Ce n'est que de l'ergonomie :
// le back refuse de toute façon (exigerRoleSur), il faut garder les deux listes identiques.
export default function BeneficiaireRequis({ roles }) {
	const { actif, role, chargement, erreur } = useBeneficiaire();

	if (chargement) return <p role="status">Chargement…</p>;

	if (erreur) {
		return (
			<div role="alert" className="alert alert-error max-w-md mx-auto">
				<span>{erreur}</span>
			</div>
		);
	}

	if (!actif) return <Navigate to="/beneficiaires" replace />;

	if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

	return <Outlet />;
}
