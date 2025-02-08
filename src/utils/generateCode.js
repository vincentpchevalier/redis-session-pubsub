import { cacheClient } from '../services/cache.service.js';

export const generateCode = async () => {
	let code;
	let exists;

	do {
		code = Math.floor(1000 + Math.random() * 9000).toString();
		exists = await cacheClient.exists(`${process.env.SESSION_KEY}${code}`);
	} while (exists);

	return code;
};
