import { subscribe } from './pubsub';

export const startSession = async (userId) => {
	// generate token
	// call subscribe using token as session id
};

export const sendMessage = async (sessionId, message) => {
	// get session code/id and message from request
	// call publish to session
};

export const joinSession = async (sessionId) => {
	// call subscribe using session id
};

export const endSession = async () => {
	// call unsubscribe
	// send end session message to user
};

export const endAllSessions = async () => {
	// call disconnect
};
