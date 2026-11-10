import { Router } from 'express';
import * as personneController from '../controllers/personneControllers.js';
import { auth } from '../middlewares/auth.js';

export const personneRoute = Router();

personneRoute.get('/:id', personneController.getPersonneById);
personneRoute.get('/', auth, personneController.getAllPersonnes);
personneRoute.post('/inscription', personneController.postPersonne);
