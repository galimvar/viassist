import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Volet (panneau) : monte depuis le bas sur mobile, glisse depuis la droite sur grand écran.
 * Basé sur <dialog> : focus piégé dans le volet, fermeture par Échap, focus rendu au bouton d'ouverture.
 *
 * @param {string}   titre
 * @param {boolean}  ouvert   contrôlé par le parent
 * @param {Function} onFermer appelé à chaque fermeture (Échap, croix, clic sur le fond)
 */
export default function Volet({ titre, ouvert, onFermer, children }) {
	const dialogue = useRef(null);
	const idTitre = useId();

	// Synchronise l'état React (ouvert) avec le <dialog> du navigateur
	useEffect(() => {
		const d = dialogue.current;
		if (ouvert && !d.open) d.showModal();
		if (!ouvert && d.open) d.close();
	}, [ouvert]);

	return (
		<dialog
			ref={dialogue}
			className="modal modal-bottom sm:modal-end"
			aria-labelledby={idTitre}
			onClose={onFermer}
		>
			<div className="modal-box flex flex-col gap-4 sm:h-full sm:max-h-full sm:w-full sm:max-w-md sm:rounded-none">
				<div className="flex items-center justify-between gap-4">
					<h2 id={idTitre} className="text-lg font-semibold">
						{titre}
					</h2>
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost" aria-label="Fermer">
							<X size={18} aria-hidden="true" />
						</button>
					</form>
				</div>

				{/* Rendu seulement quand le volet est ouvert : formulaire neuf à chaque ouverture */}
				{ouvert && children}
			</div>

			{/* Clic en dehors du volet = fermeture */}
			<form method="dialog" className="modal-backdrop">
				<button tabIndex={-1}>Fermer</button>
			</form>
		</dialog>
	);
}
