import { cacheClient } from '../services/cache.js';
import { generateKeys } from '../utils/keys.js';

export const validateSession = async (req, res, next) => {
	try {
		const { code, userId } = req.body;

		const { sessionKey, userKey } = generateKeys(code, userId);

		const inCache = await cacheClient.exists(sessionKey);

		if (!inCache) {
			return res.status(400).json({ error: 'Invalid session code.' });
		}

		req.keys = { sessionKey, userKey };

		next();
	} catch (error) {
		console.error('Session validation error:', error);
		next(error);
	}
};
