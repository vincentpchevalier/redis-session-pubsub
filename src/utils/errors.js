export class APIError extends Error {
	constructor(message, status = 500, cause = null) {
		super(message);
		this.status = status;
		this.cause = cause;

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
	constructor(message, cause = null) {
		super(message, 500, cause);
	}
}

export const errorHandler = (error, _req, res, _next) => {
	if (error instanceof APIError) {
		res.status(error.status).json({ error: error.message });
		return;
	}
	res.status(500).json({ error: 'Something went wrong.' });
};
