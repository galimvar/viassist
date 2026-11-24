import { Router } from 'express';
import * as invitationController from '../controllers/invitationControllers.js';
import { auth } from '../middlewares/auth.js';

// Côté personne INVITÉE : pas d'exigerRoleSur, puisqu'elle n'a encore aucun rôle chez ce bénéficiaire.
// La sécurité vient des requêtes SQL, qui ne touchent que les invitations de req.personne.id.
// Monté sur /api/invitations (et non /api/beneficiaires/invitations, où « invitations »
// serait pris pour un :beneficiaireId).
export const invitationRouter = Router();

invitationRouter.get('/', auth, invitationController.lister);
invitationRouter.post('/:beneficiaireId/accepter', auth, invitationController.accepter);
invitationRouter.delete('/:beneficiaireId', auth, invitationController.refuser);
