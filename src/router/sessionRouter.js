import { Router } from 'express';
import {
	closeSession,
	joinSession,
	message,
	createSession,
} from '../controllers/sessionController.js';

const sessionRouter = Router();

sessionRouter.post('/', createSession);
sessionRouter.get('/join', joinSession);
sessionRouter.post('/message', message);
sessionRouter.delete('/', closeSession);

export default sessionRouter;
