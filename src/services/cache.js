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
	const sessionKey = `${process.env.CACHE_KEY}${sessionId}`;
	const users = await cacheClient.sMembers(sessionKey);

	return users.length > 0 ? users : null;
};

// set members to cache based on sessionId
export const addToSet = async (sessionId, userId) => {
	const sessionKey = `${process.env.CACHE_KEY}${sessionId}`;
	const session = await cacheClient.sAdd(sessionKey, userId);

	await cacheClient.expire(sessionKey, process.env.SESSION_EXPIRATION); // exp in 1 hour

	console.log(
		`User ${userId} added to ${sessionKey}. Expiration in ${process.env.SESSION_EXPIRATION} seconds.`
	);

	return session;
};

export const isValid = async (id) => {
	// use this when going to create new code, before you can use it, make sure there are no other sessions with that code number (redo if true)
	// if sismember then true else not valid
};
