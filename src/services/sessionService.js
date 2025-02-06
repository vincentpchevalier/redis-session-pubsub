import { publish, subscribe, unsubscribe, disconnect } from './pubsub.js';
import * as cache from './cache.js';
import { generateKeys, parseKey } from '../utils/keys.js';
import { generateCode } from '../utils/generateCode.js';

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

export const joinSession = async (sessionKey, userKey) => {
	try {
		await cache.addUser({ sessionKey, userKey });

		const username = parseKey(userKey);

		await subscribe(username, sessionKey);
	} catch (error) {
		console.error(
			`User ${username} unable to join session ${parseKey(
				sessionKey
			)} due to: ${error.message}.`
		);
		throw error;
	}
};

export const sendMessage = async (sessionKey, message) => {
	try {
		await publish(sessionKey, message);
	} catch (error) {
		console.error(`Unable to send message.`);
		throw error;
	}
};

export const leaveSession = async (sessionKey, userKey) => {
	try {
		await cache.removeUser({ sessionKey, userKey });

		await unsubscribe(sessionKey);
	} catch (error) {
		console.error(`User ${userId} could not leave session ${sessionKey}.`);
		throw error;
	}
};

export const closeSession = async (sessionKey) => {
	try {
		await sendMessage(
			sessionKey,
			`Session ${parseKey(sessionKey)} has been closed and is no longer valid.`
		);
		await cache.deleteSession(sessionKey);
		await disconnect();
	} catch (error) {
		console.error(`Unable to close session.`);
		throw error;
	}
};
