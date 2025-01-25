import { subscribe } from './pubsub';

export const startSession = async (userId) => {
	// generate token
	// call subscribe using token as session id
};

export const sendMessage = async (sessionId, message) => {
	// get session code/id and message from request
	// call publish to session
};
