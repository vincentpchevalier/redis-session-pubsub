import { publish, subscribe, unsubscribe } from './pubsub.js';

const sessions = new Set();

const generateCode = () => {
	const code = Math.floor(1000 + Math.random() * 9000).toString();
	return code;
};

export const startSession = async (userId) => {
	// generate token code
	const code = generateCode();
	// call subscribe using token code as session id
	await subscribe(userId, code);
	// return code (token) in response
	return code;
};

export const joinSession = async (userId, code) => {
	console.log(userId, code);
	// call subscribe using code
	await subscribe(userId, code);
};

export const sendMessage = async (code, message) => {
	// call publish to session
	await publish(code, message);
};

export const leaveSession = async (userId, code) => {
	// unsubscribe from session (maybe create a PUT route or keep this for ws)
	await unsubscribe(code);
};

export const endSession = async () => {
	// call disconnect
	// send end session message to user
};
