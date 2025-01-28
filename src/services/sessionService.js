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
			isCached = await cache.addToSet(code, userId);
		}

		await subscribe(userId, code);

		// code sent to user in response
		return code;
	} catch (error) {
		console.error(`Unable to start session for user ${userId}.`);
	}
};

export const joinSession = async (userId, code) => {
	try {
		const members = await cache.getUsers(code);

		if (!members) {
			console.log(`Invalid session code: ${code}.`);
			return { success: false, message: `Invalid session code: ${code}.` };
		}

		const newUser = await cache.addToSet(code, userId);

		if (!newUser) {
			console.log(`User ${userId} is already a member of session ${code}.`);
			return { success: false, message: 'User is already in session.' };
		}

		await subscribe(userId, code);
	} catch (error) {
		console.error(`User ${userId} unable to join session ${code}.`);
	}
};

export const sendMessage = async (code, message) => {
	try {
		await publish(code, message);
	} catch (error) {
		console.error(`Unable to send message.`);
	}
};

export const leaveSession = async (userId, code) => {
	try {
		await unsubscribe(code);
	} catch (error) {
		console.error(`User ${userId} could not leave session ${code}.`);
	}
};
