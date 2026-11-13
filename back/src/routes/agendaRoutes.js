import { Router } from 'express';
import { ROLES } from '../constantes/roles.js';
import { auth, exigerRole } from '../middlewares/auth.js';
import * as AgendaController from '../controllers/agendaControllers.js';

export const agendaRoute = Router();

agendaRoute.get(
	'/jour',
	auth,
	exigerRole(ROLES.ADMIN, ROLES.PROCHE, ROLES.BENEFICIAIRE),
	AgendaController.getDay,
);
agendaRoute.get('/semaine', auth, AgendaController.getWeek);
agendaRoute.get('/mois', auth, AgendaController.getMonth);
