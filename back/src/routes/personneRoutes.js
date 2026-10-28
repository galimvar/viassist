import { Router } from 'express';
import * as personneController from '../controllers/personneControllers.js';
//import { auth } from '../middlewares/auth.js';

export const personneRoute = Router();

personneRoute.get('/:id', personneController.getPersonneById);
/* personneRoute.post('/connexion', authController.connexion);
personneRoute.post('/deconnexion', authController.deconnexion);
personneRoute.get('/moi', auth, authController.moi); */
