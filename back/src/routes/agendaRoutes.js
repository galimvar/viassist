import { Router } from 'express';
import { ROLES } from '../constantes/roles.js';
import { auth, exigerRoleSur } from '../middlewares/auth.js';
import * as AgendaController from '../controllers/agendaControllers.js';

// Monté sous /api/beneficiaires/:beneficiaireId/agenda
// mergeParams : sans lui, req.params.beneficiaireId (défini par le routeur parent) serait vide ici
export const agendaRoute = Router({ mergeParams: true });

const ROLES_AGENDA = [ROLES.ADMIN, ROLES.PROCHE, ROLES.BENEFICIAIRE];

agendaRoute.get('/jour', auth, exigerRoleSur(...ROLES_AGENDA), AgendaController.getDay);
agendaRoute.get('/semaine', auth, exigerRoleSur(...ROLES_AGENDA), AgendaController.getWeek);
agendaRoute.get('/mois', auth, exigerRoleSur(...ROLES_AGENDA), AgendaController.getMonth);
