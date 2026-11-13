import { Router } from 'express';
import * as rolesController from '../controllers/rolesControllers.js';
import { auth } from '../middlewares/auth.js';

export const rolesRoute = Router();

rolesRoute.get('/', auth, rolesController.getRoles);
