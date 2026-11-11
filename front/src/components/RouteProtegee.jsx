import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

// roles (optionnel) : liste des rôles autorisés. Sans roles, il suffit d'être connecté.
export default function RouteProtegee({ children, roles }) {
	const { utilisatrice, chargement } = useAuth();
	const location = useLocation();

	if (chargement) return <p role="status">Chargement…</p>;

	if (!utilisatrice) {
		return <Navigate to="/connexion" replace state={{ depuis: location.pathname }} />;
	}
	console.log(utilisatrice);
	if (roles && !roles.includes(utilisatrice.role_id)) {
		return <Navigate to="/" replace />;
	}

	// Utilisable avec des children, ou comme layout route (avec <Outlet />)
	return children ?? <Outlet />;
}
