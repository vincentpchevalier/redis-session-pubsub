import * as sessionService from '../services/sessionService.js';
import { parseKey } from '../utils/keys.js';

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
		const { sessionKey, userKey } = req.keys;

		await sessionService.leaveSession(sessionKey, userKey);
		res.status(200).json({
			status: `${parseKey(userKey)} left session ${parseKey(sessionKey)}`,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const closeSession = async (req, res) => {
	try {
		const { sessionKey } = req.keys;
		await sessionService.closeSession(sessionKey);

		res.status(200).json({
			status: `Session ${parseKey(
				sessionKey
			)} has been closed and is no longer valid.`,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
