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

export const leaveSession = async (sessionId) => {
	// unsubscribe from session (maybe create a PUT route or keep this for ws)
};

export const endSession = async () => {
	// call disconnect
	// send end session message to user
};
