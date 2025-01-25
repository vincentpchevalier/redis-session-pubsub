import { Router } from 'express';

const sessionRouter = Router();

sessionRouter.post('/session', (_, res) => {
	res.send('start session');
});
sessionRouter.get('/session/:id', (_, res) => {
	res.send('join session');
});
sessionRouter.post('/session/:id', (_, res) => {
	res.send('message');
});
sessionRouter.delete('/session/:id', (_, res) => {
	res.send('close session');
});

export default sessionRouter;
