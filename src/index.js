import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import * as cache from './services/cache.service.js';
import * as pubSub from './services/pubsub.service.js';
import sessionRouter from './routers/session.router.js';
import { errorHandler } from './utils/errors.js';

const app = express();

// middleware
app.use(morgan('tiny'));
app.use(express.json());

// redis setup
await cache.init();
await pubSub.init();

// routes
app.get('/', (_req, res) => res.send('Server is running 👋'));
app.use('/session', sessionRouter);

// error handler
app.use(errorHandler);

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
	console.log(`App listening on port:${port}`);
});

export default app;
