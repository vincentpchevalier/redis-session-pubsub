import * as sessionService from '../services/sessionService.js';
import { BadRequestError } from '../utils/errors.js';
import { parseKey } from '../utils/keys.js';

export const createSession = async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		throw new BadRequestError('Missing userId.');
	}

	const code = await sessionService.createSession(userId);

	res.status(201).json({ status: 'success', data: { code } });
};

export const joinSession = async (req, res) => {
	const { sessionKey, userKey } = req.keys;

	await sessionService.joinSession(sessionKey, userKey);

	res.status(200).json({ status: 'joined' });
};

export const sendMessage = async (req, res) => {
	const { sessionKey } = req.keys;
	const { message } = req.body;

	if (!message) {
		throw new BadRequestError('Request must contain message.');
	}

	await sessionService.sendMessage(sessionKey, message);

	res.status(200).json({ status: 'sent' });
};

export const leaveSession = async (req, res) => {
	const { sessionKey, userKey } = req.keys;

	await sessionService.leaveSession(sessionKey, userKey);
	res.status(200).json({
		status: `${parseKey(userKey)} left session ${parseKey(sessionKey)}`,
	});
};

export const closeSession = async (req, res) => {
	const { sessionKey } = req.keys;
	await sessionService.closeSession(sessionKey);

	res.status(200).json({
		status: `Session ${parseKey(
			sessionKey
		)} has been closed and is no longer valid.`,
	});
};
