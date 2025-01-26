import { Router } from 'express';
import {
	closeSession,
	joinSession,
	message,
	createSession,
} from '../controllers/sessionController.js';

const sessionRouter = Router();

sessionRouter.post('/session', createSession);
sessionRouter.get('/session/:id', joinSession);
sessionRouter.post('/session/:id', message);
sessionRouter.delete('/session/:id', closeSession);

export default sessionRouter;
