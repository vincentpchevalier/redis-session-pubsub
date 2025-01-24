import { Router } from 'express';

const sessionRouter = Router();

sessionRouter.post('/session', (_, res) => {
	res.send('/POST session');
});

export default sessionRouter;
