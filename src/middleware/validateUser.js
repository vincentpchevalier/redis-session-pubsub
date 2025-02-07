import { cacheClient } from '../services/cache.js';
import { BadRequestError, ForbiddenError } from '../utils/errors.js';
import { parseKey } from '../utils/keys.js';

export const validateUser = async (req, res, next) => {
	try {
		const { sessionKey, userKey } = req.keys;

		if (!sessionKey || !userKey) {
			throw new BadRequestError('Missing session key or user key.');
		}

		const isMember = await cacheClient.sIsMember(sessionKey, userKey);

		if (!isMember) {
			throw new ForbiddenError('You do not have access to this session.');
		}

		next();
	} catch (error) {
		console.error('User validation error:', error);
		next(error);
	}
};
