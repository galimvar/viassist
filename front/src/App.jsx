import { Routes, Route } from 'react-router';
import Inscription from './pages/Inscription.jsx';
import Connexion from './pages/Connexion.jsx';
import TableauDeBord from './pages/TableauDeBord.jsx';
import RouteProtegee from './components/RouteProtegee.jsx';
import Layout from './components/Layout.jsx';
import Nav from './components/Nav.jsx';
import Compte from './pages/Compte.jsx';
import ModifierUtilisateur from './pages//ModifierUtilisateur.jsx';
import Settings from './pages/Settings.jsx';
import { ROLES } from './constantes/roles.js';

function App() {
	return (
		<Routes>
			<Route path="/inscription" element={<Inscription />} />
			<Route path="/connexion" element={<Connexion />} />
			<Route
				element={
					<RouteProtegee>
						<Layout />
					</RouteProtegee>
				}
			>
				<Route path="/" element={<TableauDeBord />} />
				{/*!!! TODO AJOUTER JOURNAL ET AGENDA */}
				<Route path="/compte" element={<Compte />} />

				<Route element={<RouteProtegee roles={[ROLES.ADMIN]} />}>
					<Route path="/settings" element={<Settings />} />
					<Route path="/settings/personne/update" element={<ModifierUtilisateur />} />
				</Route>
			</Route>
		</Routes>
	);
}
export default App;
