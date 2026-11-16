import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';
import { auth } from '../middlewares/auth.js';

export const messageRouter = Router();

messageRouter.get('/', auth, messageController.listMessages);
