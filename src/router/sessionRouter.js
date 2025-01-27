import { Router } from 'express';
import {
	createSession,
	joinSession,
	leaveSession,
	message,
} from '../controllers/sessionController.js';

const sessionRouter = Router();

sessionRouter.post('/', createSession);
sessionRouter.get('/join', joinSession);
sessionRouter.post('/message', message);
sessionRouter.put('/leave', leaveSession);

export default sessionRouter;
