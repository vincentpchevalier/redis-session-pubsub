export const generateKeys = (code, userId) => {
	if (!code || !userId) {
		throw new Error('Missing userId or code.');
	}

	const sessionKey = process.env.SESSION_KEY + code;
	const userKey = process.env.USER_KEY + userId;

	return {
		sessionKey,
		userKey,
	};
};

export const parseKey = (key) => {
	if (!key) {
		throw new Error('Missing key.');
	}

	if (key.startsWith(process.env.SESSION_KEY)) {
		return key.split(process.env.SESSION_KEY)[1];
	} else if (key.startsWith(process.env.USER_KEY)) {
		return key.split(process.env.USER_KEY)[1];
	} else {
		throw new Error('Invalid key.');
	}
};
