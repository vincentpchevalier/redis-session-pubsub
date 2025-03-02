import { cacheClient } from './index.js';

import { ForbiddenError, ServiceError } from '../utils/errors.js';

export const createSession = async ({ sessionKey, userKey }) => {
	try {
		await cacheClient.sAdd(sessionKey, userKey);
		await cacheClient.expire(sessionKey, process.env.TTL_EXPIRATION);

		return true;
	} catch (error) {
		throw new ServiceError('Unable to create session.', {
			cause: error,
		});
	}
};

// set user members to cache based on sessionId
export const addUser = async ({ sessionKey, userKey }) => {
	try {
		const userCount = await cacheClient.sCard(sessionKey);

		if (userCount >= 2)
			throw new ForbiddenError(`Session is already full with 2 members.`);

		await cacheClient.sAdd(sessionKey, userKey);
		await cacheClient.expire(sessionKey, process.env.TTL_EXPIRATION);

		console.log(
			`${userKey} added to ${sessionKey}. Expiration in ${process.env.TTL_EXPIRATION} seconds.`
		);

		return true;
	} catch (error) {
		if (error instanceof ForbiddenError) throw error;

		throw new ServiceError('Unable to add user to session.', {
			cause: error,
		});
	}
};

export const removeUser = async ({ sessionKey, userKey }) => {
	try {
		await cacheClient.sRem(sessionKey, userKey);
	} catch (error) {
		throw new ServiceError(
			'There was a problem removing user from the session.',
			{
				cause: error,
			}
		);
	}
};

export const deleteSession = async (sessionKey) => {
	try {
		await cacheClient.del(sessionKey);
	} catch (error) {
		throw new ServiceError('Unable to close session.', {
			cause: error,
		});
	}
};
