import { Routes, Route } from 'react-router';
import Inscription from './pages/Inscription.jsx';
import Connexion from './pages/Connexion.jsx';
import TableauDeBord from './pages/TableauDeBord.jsx';
import RouteProtegee from './components/RouteProtegee.jsx';
import Layout from './components/Layout.jsx';
import Nav from './components/Nav.jsx';
import Settings from './pages/Settings.jsx';
import ModifierUtilisateur from './pages//ModifierUtilisateur.jsx';

function App() {
	return (
		<Routes>
			<Route path="/inscription" element={<Inscription />} />
			<Route path="/connexion" element={<Connexion />} />
			<Route
				element={
					<RouteProtegee>
						{/* ajoute la nav barre sur les routes protégée*/}
						<Layout />
					</RouteProtegee>
				}
			>
				<Route path="/" element={<TableauDeBord />} />
				//! TODO AJOUTER JOURNAL ET AGENDA
				<Route path="/settings" element={<Settings />} />
				<Route path="/settings/personne/update" element={<ModifierUtilisateur />} />
			</Route>
		</Routes>
	);
}
export default App;
