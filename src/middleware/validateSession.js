import { cacheClient } from '../services/cache';

export const validateSession = async (req, res, next) => {
	try {
		const { code, userId } = req.body;

		if (!code || !userId) {
			return res.status(400).json({ error: 'Missing userId or code.' });
		}

		const sessionKey = process.env.SESSION_KEY + code;
		const userKey = process.env.USER_KEY + userId;

		const exists = await cacheClient.exists(sessionKey);
		if (!exists) {
			return res.status(400).json({ error: 'Invalid session code.' });
		}

		req.keys = {
			sessionKey,
			userKey,
		};

		next();
	} catch (error) {
		console.error('Session validation error:', error);
		next(error);
	}
};
