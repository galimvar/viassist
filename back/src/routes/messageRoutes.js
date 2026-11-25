import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';
import { auth, exigerRoleSur } from '../middlewares/auth.js';
import { ROLES } from '../constantes/roles.js';

// Monté sous /api/beneficiaires/:beneficiaireId/messages (mergeParams : voir agendaRoutes.js)
export const messageRouter = Router({ mergeParams: true });

// Mêmes rôles que JOURNAL_ROLES côté front
const ROLES_JOURNAL = [ROLES.ADMIN, ROLES.PROCHE, ROLES.INTERVENANT, ROLES.BENEFICIAIRE];

messageRouter.get('/', auth, exigerRoleSur(...ROLES_JOURNAL), messageController.listMessages);
