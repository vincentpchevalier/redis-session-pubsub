import { publish, subscribe, unsubscribe } from './pubsub.js';
import * as cache from './cache.js';

const sessions = new Set();

const generateCode = () => {
	const code = Math.floor(1000 + Math.random() * 9000).toString();
	return code;
};

export const startSession = async (userId) => {
	try {
		let isCached;
		const code = generateCode();

		while (!isCached) {
			isCached = await cache.createSession(code, userId);
		}

		await subscribe(userId, code);

		// code sent to user in response
		return code;
	} catch (error) {
		console.error(
			`Unable to start session for user ${userId} due to: ${error.message}.`
		);
		throw error;
	}
};

export const joinSession = async (userId, code) => {
	try {
		await cache.addUser(code, userId);

		await subscribe(userId, code);
	} catch (error) {
		console.error(
			`User ${userId} unable to join session ${code} due to: ${error.message}.`
		);
		throw error;
	}
};

export const sendMessage = async (userId, code, message) => {
	try {
		const isUser = await cache.checkUser(code, userId);

		if (!isUser) {
			throw new Error('User must be in session to send message.');
		}

		await publish(code, message);
	} catch (error) {
		console.error(`Unable to send message.`);
		throw error;
	}
};

export const leaveSession = async (userId, code) => {
	try {
		await cache.removeUser(code, userId);

		await unsubscribe(code);
	} catch (error) {
		console.error(`User ${userId} could not leave session ${code}.`);
		throw error;
	}
};
