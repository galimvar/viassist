import { Router } from 'express';
import * as beneficiaireController from '../controllers/beneficiaireControllers.js';
import { auth, exigerRoleSur } from '../middlewares/auth.js';
import { ROLES } from '../constantes/roles.js';
import { agendaRoute } from './agendaRoutes.js';
import { messageRouter } from './messageRoutes.js';

export const beneficiaireRouter = Router();

// Tous les rôles : il suffit d'accompagner le bénéficiaire
const TOUS_LES_ROLES = Object.values(ROLES);

beneficiaireRouter.get('/', auth, beneficiaireController.lister);
beneficiaireRouter.post('/', auth, beneficiaireController.creer);
beneficiaireRouter.get(
	'/:beneficiaireId',
	auth,
	exigerRoleSur(...TOUS_LES_ROLES),
	beneficiaireController.fiche,
);

// Membres : gestion réservée à l'admin DE CE bénéficiaire
const MEMBRES = '/:beneficiaireId/membres';
const UN_MEMBRE = `${MEMBRES}/:personneId`;
const ADMIN = exigerRoleSur(ROLES.ADMIN);

beneficiaireRouter.get(MEMBRES, auth, ADMIN, beneficiaireController.listerMembres);
beneficiaireRouter.post(MEMBRES, auth, ADMIN, beneficiaireController.ajouterMembre);
beneficiaireRouter.patch(UN_MEMBRE, auth, ADMIN, beneficiaireController.modifierRoleMembre);
beneficiaireRouter.delete(UN_MEMBRE, auth, ADMIN, beneficiaireController.retirerMembre);

// Ressources d'un bénéficiaire : /api/beneficiaires/:beneficiaireId/agenda/... et /messages
// Les sous-routeurs sont créés avec { mergeParams: true } pour voir :beneficiaireId
beneficiaireRouter.use('/:beneficiaireId/agenda', agendaRoute);
beneficiaireRouter.use('/:beneficiaireId/messages', messageRouter);
