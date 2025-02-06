import { publish, subscribe, unsubscribe } from './pubsub.js';
import * as cache from './cache.js';
import { generateKeys } from '../utils/keys.js';

export const createSession = async (userId) => {
	try {
		let isCached;
		const code = generateCode();
		const keys = generateKeys(code, userId);

		while (!isCached) {
			isCached = await cache.createSession(keys);
		}

		await subscribe(userId, keys.sessionKey);

		return code;
	} catch (error) {
		console.error(
			`Unable to start session for user ${userId} due to: ${error.message}.`
		);
		throw error;
	}
};

// FIXME: middleware generates keys based on request object; passed into service from controller
export const joinSession = async (userId, code) => {
	try {
		// FIXME: pass session and user keys into cache
		await cache.addUser(code, userId);

		// FIXME: parse userId from user key (user:userId) to pass into sub client; pass sessionKey to subscribe client (session:sessionId)
		await subscribe(userId, code);
	} catch (error) {
		console.error(
			`User ${userId} unable to join session ${code} due to: ${error.message}.`
		);
		throw error;
	}
};

// FIXME: middleware generates keys based on request object; passed into service from controller
export const sendMessage = async (userId, code, message) => {
	try {
		// FIXME: get rid of this because it is now done in the validateUser middleware
		const isUser = await cache.checkUser(code, userId);

		if (!isUser) {
			throw new Error('User must be in session to send message.');
		}

		// FIXME: sessionKey passed to pub client
		await publish(code, message);
	} catch (error) {
		console.error(`Unable to send message.`);
		throw error;
	}
};

// FIXME: middleware generates keys based on request object; passed into service from controller
export const leaveSession = async (userId, code) => {
	try {
		// FIXME: pass sessionKey and userKey into cache function
		await cache.removeUser(code, userId);

		await unsubscribe(code);
	} catch (error) {
		console.error(`User ${userId} could not leave session ${code}.`);
		throw error;
	}
};
