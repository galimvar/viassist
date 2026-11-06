import { Outlet } from 'react-router';
import Nav from './Nav.jsx';

export default function Layout() {
	return (
		<>
			<Nav />
			<main className="p-4 pb-20 lg:pb-4">
				<Outlet />
			</main>
		</>
	);
}
