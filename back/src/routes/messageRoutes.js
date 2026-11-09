import { Router } from "express";
import * as messageController from "../controllers/messageController.js";

export const messageRoute = Router();

messageRoute.get("/message", messageController.listMessages);