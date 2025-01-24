import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App listening on port:${port}`);
});
