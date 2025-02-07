import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import * as cache from './services/cache.js';
import redisPubSub from './services/pubsub.js';
import sessionRouter from './router/sessionRouter.js';
import { errorHandler } from './utils/errors.js';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

cache.init();
redisPubSub();

app.get('/', (_req, res) => res.send('Server is running 👋'));

app.use('/session', sessionRouter);

app.use(errorHandler);

// break into two server files for development
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
// 	console.log(`App listening on port:${port}`);
// });

export default app;
