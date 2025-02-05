import redis from 'redis';

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

// get members from cache based on sessionId
export const getUsers = async (sessionId) => {
	// get session members from redis (if it exists)
	const sessionKey = `${process.env.SESSION_KEY}${sessionId}`;
	const users = await cacheClient.sMembers(sessionKey);

	return users.length > 0 ? users : null;
};

export const createSession = async (sessionCode, userId) => {
	const sessionKey = process.env.SESSION_KEY + sessionCode;
	const userKey = process.env.USER_KEY + userId;

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
export const addUser = async (sessionCode, userId) => {
	const sessionKey = process.env.SESSION_KEY + sessionCode;
	const userKey = process.env.USER_KEY + userId;

	try {
		const exists = await cacheClient.exists(sessionKey);

		if (!exists) {
			throw new Error(`Invalid session ID.`);
		}

		const userCount = await cacheClient.sCard(sessionKey);

		if (userCount >= 2)
			throw new Error(`Session ${sessionId} is already full with 2 members.`);

		await cacheClient.sAdd(sessionKey, userKey);
		await cacheClient.expire(sessionKey, process.env.SESSION_EXPIRATION);

		console.log(
			`User ${userId} added to ${sessionKey}. Expiration in ${process.env.SESSION_EXPIRATION} seconds.`
		);

		return true;
	} catch (error) {
		console.error(`Unable to add user ${userId}: ${error.message}`);
		throw error;
	}
};

export const isValid = async (id) => {
	// use this when going to create new code, before you can use it, make sure there are no other sessions with that code number (redo if true)
	// if sismember then true else not valid
};
