import { Router } from 'express';
import {
	createSession,
	closeSession,
	joinSession,
	leaveSession,
	message,
} from '../controllers/sessionController.js';

const sessionRouter = Router();

sessionRouter.post('/', createSession);
sessionRouter.get('/join', joinSession);
sessionRouter.post('/message', message);
sessionRouter.put('/leave', leaveSession);
sessionRouter.delete('/', closeSession);

export default sessionRouter;
