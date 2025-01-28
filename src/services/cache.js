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
export const addUsers = async (sessionId, userId) => {
	const sessionKey = `${process.env.CACHE_KEY}${sessionId}`;

	const userCount = await cacheClient.sCard(sessionKey);

	if (userCount >= 2) {
		console.log(`Session ${sessionId} is already full with 2 members.`);
		return null;
	}

	const added = await cacheClient.sAdd(sessionKey, userId);

	await cacheClient.expire(sessionKey, process.env.SESSION_EXPIRATION); // set expiry to 1 hour

	console.log(
		added
			? `User ${userId} added to ${sessionKey}. Expiration in ${process.env.SESSION_EXPIRATION} seconds.`
			: `User ${userId} could not be added to ${sessionKey}.`
	);

	return added;
};

export const isValid = async (id) => {
	// use this when going to create new code, before you can use it, make sure there are no other sessions with that code number (redo if true)
	// if sismember then true else not valid
};
