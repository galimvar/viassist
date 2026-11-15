import { BookText, TrafficCone, TriangleAlert } from 'lucide-react';

//==================== CONSTANTES ====================//

const IMPORTANCE_STYLES = Object.freeze({
	faible: {
		label: 'Informatif',
		cardClassName: 'bg-success/20 border border-success',
		iconClassName: 'text-success',
		Icon: BookText,
	},
	moyenne: {
		label: 'Attention',
		cardClassName: 'bg-warning/20 border border-warning',
		iconClassName: 'text-warning',
		Icon: TrafficCone,
	},
	élevée: {
		label: 'Important',
		cardClassName: 'bg-error/20 border border-error',
		iconClassName: 'text-error',
		Icon: TriangleAlert,
	},
});

//==================== COMPOSANT ====================//
// Reçoit UNE entrée du journal de bord
// Reçoit le message complet en prop, tel qu'envoyé par GET /api/message :
// { id, description, date_message, prenom_auteur, nom_auteur, categorie, importance }

export default function MessageCard({ message }) {
	const style = IMPORTANCE_STYLES[message.importance];
	const Icon = style.Icon;

	return (
		<article className={`card shadow-md ${style.cardClassName}`}>
			<div className="card-body">
				<h3 className="card-title">
					<Icon size={28} className={style.iconClassName} aria-hidden="true" />
					<span className="sr-only">{style.label} :</span>
					{message.categorie !== null ? message.categorie : 'Sans catégorie'}
				</h3>

				<p>
					<span className="underline">Auteur :</span> {message.prenom_auteur}{' '}
					{message.nom_auteur}
				</p>

				<p>{message.description}</p>
			</div>
		</article>
	);
}
