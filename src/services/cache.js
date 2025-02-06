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

// get members from cache based on sessionId
export const checkUser = async (sessionCode, userId) => {
	console.log('checking user');
	// get session members from redis (if it exists)
	const sessionKey = `${process.env.SESSION_KEY}${sessionCode}`;
	const userKey = `${process.env.USER_KEY}${userId}`;
	try {
		const exists = await cacheClient.exists(sessionKey);
		if (!exists) {
			throw new Error(`Invalid session ID.`);
		}

		return await cacheClient.sIsMember(sessionKey, userKey);
	} catch (error) {
		console.error(`Unable to find user ${userId}: ${error.message}`);
		throw error;
	}
};

export const removeUser = async (sessionCode, userId) => {
	// get session members from redis (if it exists)
	// FIXME: sessionKey and userKey passed through request from middleware validation
	const sessionKey = `${process.env.SESSION_KEY}${sessionCode}`;
	const userKey = `${process.env.USER_KEY}${userId}`;
	try {
		// FIXME: get rid of these checks, middleware will take care of it
		const exists = await cacheClient.exists(sessionKey);
		if (!exists) {
			throw new Error(`Invalid session ID.`);
		}

		const isUser = await cacheClient.sIsMember(sessionKey, userKey);

		if (isUser) {
			await cacheClient.sRem(sessionKey, userKey);
			return true;
		} else {
			throw new Error(`Invalid user ID.`);
		}
	} catch (error) {
		console.error(`Unable to find user ${userId}: ${error.message}`);
		throw error;
	}
};

export { cacheClient };
