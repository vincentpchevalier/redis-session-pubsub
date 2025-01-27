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

export const getItem = async (sessionId) => {
	// get session info from redis (if it exists)
};

export const setItem = async (sessionId) => {};
