import { Router } from 'express';
import {
	createSession,
	joinSession,
	leaveSession,
	message,
} from '../controllers/sessionController.js';
import { validateSession } from '../middleware/validateSession.js';
import { validateUser } from '../middleware/validateUser.js';

const sessionRouter = Router();

sessionRouter.post('/', createSession);
sessionRouter.get('/join', validateSession, joinSession);
sessionRouter.post('/message', validateSession, validateUser, message);
sessionRouter.put('/leave', validateSession, validateUser, leaveSession);

export default sessionRouter;
