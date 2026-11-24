import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

// Il suffit d'être connecté. Les rôles dépendent du bénéficiaire actif : voir BeneficiaireRequis.
export default function RouteProtegee({ children }) {
	const { utilisatrice, chargement } = useAuth();
	const location = useLocation();

	if (chargement) return <p role="status">Chargement…</p>;

	if (!utilisatrice) {
		return <Navigate to="/connexion" replace state={{ depuis: location.pathname }} />;
	}

	// Utilisable avec des children, ou comme layout route (avec <Outlet />)
	return children ?? <Outlet />;
}
