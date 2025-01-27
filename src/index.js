import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import redisPubSub from './services/pubsub.js';
import sessionRouter from './router/sessionRouter.js';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

redisPubSub();

app.get('/', (_req, res) => res.send('Server is running 👋'));

app.use('/session', sessionRouter);

// break into two server files for development
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
// 	console.log(`App listening on port:${port}`);
// });

export default app;
