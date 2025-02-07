export class APIError extends Error {
	status = 500;
	constructor(message) {
		super(message);

		Error.captureStackTrace(this, this.constructor);
	}
}

export class BadRequestError extends APIError {
	status = 400;
}

export class UnauthenticatedError extends APIError {
	status = 401;
}

export class ForbiddenError extends APIError {
	status = 403;
}

export class NotFoundError extends APIError {
	status = 404;
}

export class ServiceError extends APIError {
	status = 500;
}

export const errorHandler = (error, _req, res, _next) => {
	if (error instanceof APIError) {
		res.status(error.status).json({ error: error.message });
		return;
	}
	res.status(500).json({ error: 'Something went wrong.' });
};
