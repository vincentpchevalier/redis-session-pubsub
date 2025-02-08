import redis from 'redis';

import { ServiceError } from '../utils/errors.js';

let cacheClient;
let pubClient;
let subClient;

export const initializeRedis = async () => {
	console.log('Connecting to Redis...');
	console.log('Creating clients...');
	try {
		const url = process.env.REDIS_URL;

		cacheClient = redis.createClient({ url });
		await cacheClient.connect();
		console.log('Cache client connected.');

		pubClient = redis.createClient({ url });
		await pubClient.connect();
		console.log('Publisher client connected.');

		subClient = redis.createClient({ url });
		await subClient.connect();
		console.log('Subscriber client connected.');

		console.log('All Redis clients connected successfully.');
	} catch (error) {
		console.error('Redis initialization error:', error);
		throw new ServiceError('Unable to connect to Redis.', {
			cause: error,
		});
	} finally {
		console.log('Redis initialization process complete.');
	}
};

export { cacheClient, pubClient, subClient };
