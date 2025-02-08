import redis from 'redis';

let cacheClient;
let pubClient;
let subClient;

export const initializeRedis = async () => {
	console.log('Connecting to Redis...');
	console.log('Creating clients...');

	cacheClient = await redis
		.createClient({
			url: process.env.REDIS_URL,
		})
		.on('error', (error) => {
			throw new ServiceError('Unable to connect to Redis.', {
				cause: error,
			});
		})
		.connect();

	pubClient = await redis
		.createClient({
			url: process.env.REDIS_URL,
		})
		.on('error', (err) => console.error('Redis Publisher Error', err))
		.connect();

	subClient = await redis
		.createClient({
			url: process.env.REDIS_URL,
		})
		.on('error', (err) => console.error('Redis Subscriber Error', err))
		.connect();
};

export { cacheClient, pubClient, subClient };
