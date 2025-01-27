import * as sessionService from '../services/sessionService.js';

export const createSession = async (req, res) => {
	try {
		const { userId } = req.body;

		const code = await sessionService.startSession(userId);

		res.status(201).json({ status: 'success', data: { code } });
	} catch (err) {
		console.error(err);
	}
};

export const joinSession = async (req, res) => {
	try {
		const { userId, code } = req.body;

		await sessionService.joinSession(userId, code);

		res.status(200).json({ status: 'joined' });
	} catch (error) {
		console.error(err);
	}
};

export const message = async (req, res) => {
	try {
		const { code, message } = req.body;

		if (!code || !message) {
			throw new Error('Missing code or message.');
		}

		await sessionService.sendMessage(code, message);

		res.status(200).json({ status: 'sent' });
	} catch (err) {
		console.error(err);
	}
};

export const leaveSession = async (req, res) => {
	try {
		const { userId, code } = req.body;
		console.log(userId, code);
		await sessionService.leaveSession(userId, code);
		res.status(200).json({ status: `user ${userId} left session ${code}` });
	} catch (error) {
		console.error(error);
	}
};
