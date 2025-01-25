import { Router } from 'express';
import {
	closeSession,
	joinSession,
	message,
	startSession,
} from '../controllers/sessionController.js';

const sessionRouter = Router();

sessionRouter.post('/session', startSession);
sessionRouter.get('/session/:id', joinSession);
sessionRouter.post('/session/:id', message);
sessionRouter.delete('/session/:id', closeSession);

export default sessionRouter;
