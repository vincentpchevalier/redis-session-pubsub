export const startSession = async (_req, res) => {
	res.status(200).json({ message: 'Started a new session.' });
};

export const joinSession = async (req, res) => {
	res.status(200).json({ message: `Joined session at ${req.params.id}` });
};

export const message = async (req, res) => {
	res.status(200).json({ message: req.body.message });
};

export const closeSession = async (req, res) => {
	res.status(200).json({ status: 'closed', message: 'Ended session.' });
};
