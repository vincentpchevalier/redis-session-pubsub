import { publish, subscribe, unsubscribe, disconnect } from './pubsub.js';
import * as cache from './cache.js';
import { generateKeys, parseKey } from '../utils/keys.js';
import { generateCode } from '../utils/generateCode.js';

export const createSession = async (userId) => {
	const code = await generateCode();
	const keys = generateKeys(code, userId);

	await cache.createSession(keys);
	await subscribe(userId, keys.sessionKey);

	return code;
};

export const joinSession = async (sessionKey, userKey) => {
	const username = parseKey(userKey);

	await cache.addUser({ sessionKey, userKey });
	await subscribe(username, sessionKey);
};

export const sendMessage = async (sessionKey, message) => {
	await publish(sessionKey, message);
};

export const leaveSession = async (sessionKey, userKey) => {
	await cache.removeUser({ sessionKey, userKey });
	await unsubscribe(sessionKey);
};

export const closeSession = async (sessionKey) => {
	await sendMessage(
		sessionKey,
		`Session ${parseKey(sessionKey)} has been closed and is no longer valid.`
	);
	await cache.deleteSession(sessionKey);
	await disconnect();
};
