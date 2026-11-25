import { Router } from 'express';
import * as personneController from '../controllers/personneControllers.js';
import { auth } from '../middlewares/auth.js';

export const personneRoute = Router();

// Les anciennes routes admin (lister, lire, modifier, archiver n'importe quelle personne) sont
// supprimées : un admin ne gère plus que les membres de SES bénéficiaires (ADR 006).
personneRoute.post('/inscription', personneController.postPersonne);
personneRoute.patch('/modifierMoi', auth, personneController.modifierMoi);
