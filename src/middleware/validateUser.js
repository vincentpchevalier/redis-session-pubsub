import { cacheClient } from '../services/cache';

export const validateUser = async (req, res, next) => {
	try {
		const { sessionKey, userKey } = req.keys || {};

		if (!sessionKey || !userKey) {
			return res.status(400).json({ error: 'Missing sessionKey or userKey.' });
		}

		const sessionCode = sessionKey?.split(process.env.SESSION_KEY)[1];
		const username = userKey?.split(process.env.USER_KEY)[1];

		const isMember = await cacheClient.sisMember(sessionKey, userKey);

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
