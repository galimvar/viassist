import { Router } from 'express';
import * as AgendaController from '../controllers/agendaControllers.js';

export const agendaRoute = Router();

agendaRoute.get('/jour', AgendaController.getDay);
