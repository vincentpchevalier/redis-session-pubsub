import redis from 'redis';
import { parseKey } from '../utils/keys.js';
import { ForbiddenError, ServiceError } from '../utils/errors.js';

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
		await cacheClient.expire(sessionKey, process.env.TTL_EXPIRATION);

		return true;
	} catch (error) {
		throw new ServiceError('Unable to create session.');
	}
};

// set user members to cache based on sessionId
export const addUser = async ({ sessionKey, userKey }) => {
	try {
		const userCount = await cacheClient.sCard(sessionKey);

		if (userCount >= 2)
			throw new ForbiddenError(
				`Session ${sessionId} is already full with 2 members.`
			);

		await cacheClient.sAdd(sessionKey, userKey);
		await cacheClient.expire(sessionKey, process.env.TTL_EXPIRATION);

		console.log(
			`${userKey} added to ${sessionKey}. Expiration in ${process.env.TTL_EXPIRATION} seconds.`
		);

		return true;
	} catch (error) {
		throw new ServiceError('Unable to add user to session.');
	}
};

export const removeUser = async ({ sessionKey, userKey }) => {
	try {
		await cacheClient.sRem(sessionKey, userKey);
	} catch (error) {
		throw new ServiceError(
			'There was a problem removing user from the session.'
		);
	}
};

export const deleteSession = async (sessionKey) => {
	try {
		await cacheClient.del(sessionKey);
	} catch (error) {
		console.error(
			`Unable to delete session ${parseKey(sessionKey)}: ${error.message}`
		);
	}
};

export { cacheClient };
