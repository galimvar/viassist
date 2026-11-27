import { Routes, Route } from 'react-router';
import Inscription from './pages/Inscription.jsx';
import Connexion from './pages/Connexion.jsx';
import TableauDeBord from './pages/TableauDeBord.jsx';
import RouteProtegee from './components/RouteProtegee.jsx';
import BeneficiaireRequis from './components/BeneficiaireRequis.jsx';
import Layout from './components/Layout.jsx';
import Compte from './pages/Compte.jsx';
import ChoixBeneficiaire from './pages/ChoixBeneficiaire.jsx';
import Membres from './pages/Membres.jsx';
import Agenda from './pages/Agenda.jsx';
import Journal from './pages/Journal.jsx';
import { ROLES, AGENDA_ROLES, JOURNAL_ROLES } from './constantes/roles.js';

function App() {
	return (
		<Routes>
			<Route path="/inscription" element={<Inscription />} />
			<Route path="/connexion" element={<Connexion />} />

			{/* Connecté */}
			<Route
				element={
					<RouteProtegee>
						<Layout />
					</RouteProtegee>
				}
			>
				<Route path="/compte" element={<Compte />} />
				<Route path="/beneficiaires" element={<ChoixBeneficiaire />} />

				{/* Connecté + un bénéficiaire actif (sinon → /beneficiaires) */}
				<Route element={<BeneficiaireRequis />}>
					<Route path="/" element={<TableauDeBord />} />

					{/* + un rôle autorisé chez ce bénéficiaire (mêmes listes que le back) */}
					<Route element={<BeneficiaireRequis roles={AGENDA_ROLES} />}>
						<Route path="/agenda" element={<Agenda />} />
					</Route>

					<Route element={<BeneficiaireRequis roles={JOURNAL_ROLES} />}>
						<Route path="/journal" element={<Journal />} />
					</Route>

					<Route element={<BeneficiaireRequis roles={[ROLES.ADMIN]} />}>
						<Route path="/membres" element={<Membres />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}
export default App;
