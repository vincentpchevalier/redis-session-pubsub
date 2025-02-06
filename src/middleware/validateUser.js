import { cacheClient } from '../services/cache.js';
import { parseKey } from '../utils/keys.js';

export const validateUser = async (req, res, next) => {
	try {
		const { sessionKey, userKey } = req.keys;

		if (!sessionKey || !userKey) {
			return res.status(400).json({ error: 'Missing sessionKey or userKey.' });
		}

		const sessionCode = parseKey(sessionKey);
		const username = parseKey(userKey);

		const isMember = await cacheClient.sIsMember(sessionKey, userKey);

		if (!isMember) {
			return res.status(400).json({
				error: `${username} is not a member of session ${sessionCode}.`,
			});
		}

		next();
	} catch (error) {
		console.error('User validation error:', error);
		next(error);
	}
};
