import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const formaterDate = (iso) =>
	new Date(`${iso}T00:00`).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});

const AgendaDay = () => {
	const API = '/api/agenda';

	const [data, setData] = useState();
	const [decalage, setDecalage] = useState(0);

	useEffect(() => {
		const chargerData = async () => {
			try {
				const response = await fetch(`${API}/jour?decalage=${decalage}`);
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
	}, [decalage]);

	if (!data) return <p>Chargement…</p>;

	const [date, evenements] = Object.entries(data)[0];

	return (
		<>
			<ChevronLeft color="blue" onClick={() => setDecalage(decalage - 1)} />
			<h2>{formaterDate(date)}</h2>
			<ChevronRight color="blue" onClick={() => setDecalage(decalage + 1)} />
			<pre>{JSON.stringify(evenements, null, 2)}</pre>
		</>
	);
};

export default AgendaDay;
