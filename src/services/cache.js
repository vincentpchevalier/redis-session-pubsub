import redis from 'redis';
import { parseKey } from '../utils/keys.js';

let cacheClient;

export const init = async () => {
	cacheClient = await redis
		.createClient({
			url: process.env.REDIS_URL,
		})
		.on('error', (error) => {
			console.error('Redis Cache Client Error', error);
		})
		.connect();
	console.log('Redis cache set up.');
};

export const createSession = async ({ sessionKey, userKey }) => {
	try {
		await cacheClient.sAdd(sessionKey, userKey);
		await cacheClient.expire(sessionKey, process.env.SESSION_EXPIRATION);

		return true;
	} catch (error) {
		console.error(`Unable to create session: ${error.message}`);
		throw error;
	}
};

// set user members to cache based on sessionId
export const addUser = async ({ sessionKey, userKey }) => {
	try {
		const userCount = await cacheClient.sCard(sessionKey);

		if (userCount >= 2)
			throw new Error(`Session ${sessionId} is already full with 2 members.`);

		await cacheClient.sAdd(sessionKey, userKey);
		await cacheClient.expire(sessionKey, process.env.SESSION_EXPIRATION);

		console.log(
			`${userKey} added to ${sessionKey}. Expiration in ${process.env.SESSION_EXPIRATION} seconds.`
		);

		return true;
	} catch (error) {
		console.error(`Unable to add user ${userId}: ${error.message}`);
		throw error;
	}
};

export const removeUser = async ({ sessionKey, userKey }) => {
	try {
		await cacheClient.sRem(sessionKey, userKey);
	} catch (error) {
		console.error(`Unable to find user ${parseKey(userKey)}: ${error.message}`);
		throw error;
	}
};

export { cacheClient };
