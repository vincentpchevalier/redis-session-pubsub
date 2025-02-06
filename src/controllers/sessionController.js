import * as sessionService from '../services/sessionService.js';

export const createSession = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			res.status(400).json({ error: 'userId not provided' });
			return;
		}

		const code = await sessionService.createSession(userId);

		res.status(201).json({ status: 'success', data: { code } });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const joinSession = async (req, res) => {
	try {
		const { sessionKey, userKey } = req.keys;

		await sessionService.joinSession(sessionKey, userKey);

		res.status(200).json({ status: 'joined' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { sessionKey } = req.keys;
		const { message } = req.body;

		if (!message) {
			res.status(400).json({ error: 'Request must contain message.' });
			return;
		}

		await sessionService.sendMessage(sessionKey, message);

		res.status(200).json({ status: 'sent' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const leaveSession = async (req, res) => {
	try {
		// FIXME: replace with sessionKey and userKey from req.keys generated in middleware
		const { userId, code } = req.body;
		if (!userId || !code) {
			res.status(400).json({ error: 'Missing userId or code.' });
			return;
		}
		await sessionService.leaveSession(userId, code);
		res.status(200).json({ status: `user ${userId} left session ${code}` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
