import redis from 'redis';

let pubClient;
let subClient;

const init = async () => {
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
