import { sendMessage, startSession } from '../services/sessionService.js';

export const createSession = async (req, res) => {
	try {
		const newSession = await startSession(req.body.userId);
		res.status(201).json({ status: 'success', data: { session: newSession } });
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: 'Invalid data sent.',
		});
	}
};

export const joinSession = async (req, res) => {
	res.status(200).json({ message: `Joined session at ${req.params.id}` });
};

export const message = async (req, res) => {
	try {
		const { message } = req.body;
		const token = req.params.id;

		if (!token || !message) {
			throw new Error('Missing token or message.');
		}

		const response = await sendMessage(token, message);

		res.status(200).json({ status: 'success', data: { message: response } });
	} catch (err) {
		console.log(err);
		res.status(400).json({
			status: 'fail',
			message: 'Invalid data sent.',
		});
	}
};

export const closeSession = async (req, res) => {
	res.status(200).json({ status: 'closed', message: 'Ended session.' });
};
