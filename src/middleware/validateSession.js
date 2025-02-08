import { cacheClient } from '../services/cache.service.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { generateKeys } from '../utils/keys.js';

export const validateSession = async (req, res, next) => {
	try {
		const { code, userId } = req.body;

		if (!userId || !code) {
			throw new BadRequestError('Missing userId or code.');
		}

		const { sessionKey, userKey } = generateKeys(code, userId);

		const inCache = await cacheClient.exists(sessionKey);

		if (!inCache) {
			throw new NotFoundError('Session not found.');
		}

		req.keys = { sessionKey, userKey };

		next();
	} catch (error) {
		console.error('Session validation error:', error);
		next(error);
	}
};
