import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import * as AgendaController from '../controllers/agendaControllers.js';


export const agendaRoute = Router();

agendaRoute.get('/jour', auth, AgendaController.getDay);
agendaRoute.get('/semaine', auth, AgendaController.getWeek);
agendaRoute.get('/mois', auth, AgendaController.getMonth);
