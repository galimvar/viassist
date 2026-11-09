import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const formaterDate = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});

const AgendaDay = () => {
	const API = 'http://localhost:5173/api/agenda';

	const [data, setData] = useState();
	const [interval, setInterval] = useState(0);

	const chargerData = async () => {
		try {
			const response = await fetch(API + `/jour?interval=${interval}`);

			if (!response.ok) {
				throw new Error(`Erreur ${response.status}: Impossible de charger les evenements`);
			}
			setData(await response.json());
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		const chargerData = async () => {
			try {
				const response = await fetch(`${API}/jour?interval=${interval}`);
				if (!response.ok) {
					throw new Error(
						`Erreur ${response.status}: Impossible de charger les evenements`,
					);
				}
				setData(await response.json());
			} catch (error) {
				console.error(error.message);
			}
		};
		chargerData();
	}, [interval]);

	if (!data) return <p>Chargement…</p>;

	const [date, evenements] = Object.entries(data)[0];

	return (
		<>
			<ChevronLeft color="blue" />
			<h1>{formaterDate(date)}</h1>
			<ChevronRight color="blue" />
			<pre>{JSON.stringify(evenements, null, 2)}</pre>
		</>
	);
};

export default AgendaDay;
