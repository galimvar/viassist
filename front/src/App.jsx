import { Routes, Route } from 'react-router';
import Inscription from './pages/Inscription.jsx';
import Connexion from './pages/Connexion.jsx';
import TableauDeBord from './pages/TableauDeBord.jsx';
import RouteProtegee from './components/RouteProtegee.jsx';
import Nav from './components/Nav.jsx';

function App() {
	return (
		<Routes>
			<Route path="/inscription" element={<Inscription />} />
			<Route path="/connexion" element={<Connexion />} />
			<Route
				path="/"
				element={
					<RouteProtegee>
						<Nav />
						<TableauDeBord />
					</RouteProtegee>
				}
			/>
		</Routes>
	);
}
export default App;
