import { Router } from 'express';
import * as authController from '../controllers/authControllers.js';
import { auth } from '../middlewares/auth.js';

export const authRouter = Router();

authRouter.post('/inscription', authController.inscription);
authRouter.get('/connexion', authController.connexion);
authRouter.get('/deconnexion', authController.deconnexion);
authRouter.get('/moi', auth, authController.moi);