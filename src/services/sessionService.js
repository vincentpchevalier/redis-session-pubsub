import crypto from 'crypto';

import { publish, subscribe } from './pubsub.js';

// generate token
// add token to list (new Set) of current tokens (save as list in redis cache)
// clear tokens after expiry or when server closes
// prefix token with "sid_"  for session id

const sessions = new Set();

const generateSessionId = () => {
	// const random = Math.floor(1000 + Math.random() * 9000);
	const random = crypto.randomUUID();
	console.log(random);
	const sessionId = `sid_${random}`;
	sessions.add(sessionId);

	const token = random.slice(-4);
	console.log(sessions);
	console.log(token);

	return { sessionId, token };
};

export const startSession = async (userId) => {
	// generate token
	const { sessionId, token } = generateSessionId();
	// call subscribe using token as session id
	await subscribe(userId, token);
	// return userId, sessionId, code (token) in response
	return { user: userId, sessionId, token };
};

export const sendMessage = async (token, message) => {
	// call publish to session
	await publish(token, message);

	return message;
};

export const joinSession = async (token) => {
	// call subscribe using token
};

export const leaveSession = async (sessionId) => {
	// unsubscribe from session (maybe create a PUT route or keep this for ws)
};

export const endSession = async () => {
	// call disconnect
	// send end session message to user
};
