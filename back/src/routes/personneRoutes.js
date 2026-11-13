import { Router } from 'express';
import * as personneController from '../controllers/personneControllers.js';
import { auth, exigerRole } from '../middlewares/auth.js';
import { ROLES } from '../constantes/roles.js';

export const personneRoute = Router();

personneRoute.get('/:id', personneController.getPersonneById);
personneRoute.get('/', auth, personneController.getAllPersonnes);
personneRoute.post('/inscription', personneController.postPersonne);
personneRoute.patch(
	'/delete',
	auth,
	exigerRole(ROLES.ADMIN),
	personneController.deletePersonneById,
);

personneRoute.put('/modifierMoi', auth, personneController.modifierMoi);
personneRoute.patch('/:id', auth, exigerRole(ROLES.ADMIN), personneController.modifierPersonne);
