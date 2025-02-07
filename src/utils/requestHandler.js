const requestHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

export default requestHandler;
