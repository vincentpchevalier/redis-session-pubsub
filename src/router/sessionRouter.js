import { Router } from 'express';
import { validateSession } from '../middleware/validateSession.js';
import { validateUser } from '../middleware/validateUser.js';
import {
	createSession,
	joinSession,
	leaveSession,
	sendMessage,
	closeSession,
} from '../controllers/sessionController.js';

const sessionRouter = Router();

sessionRouter.post('/', createSession);
sessionRouter.get('/join', validateSession, joinSession);
sessionRouter.post('/message', validateSession, validateUser, sendMessage);
sessionRouter.put('/leave', validateSession, validateUser, leaveSession);
sessionRouter.delete('/close', validateSession, validateUser, closeSession);

export default sessionRouter;
