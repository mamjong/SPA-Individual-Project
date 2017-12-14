const Feedback = require('../models/feedback');

module.exports = {

	get(req, res, next) {
		const conceptId = req.params.id;

		Feedback.find({concept: conceptId})
			.then((response) => {
				res.send(response)
			})
			.catch((next));
	},

	post(req, res, next) {
		const newEntry = req.body;
		Feedback.create(newEntry)
			.then((createdEntry) => res.status(201).send(createdEntry))
			.catch((next));
	},

	put(req, res, next) {
		const id = req.params.id;
		const update = req.body;
		const receivedAuthor = req.body.author;

		if (receivedAuthor !== undefined) {
			const updateAuthor = receivedAuthor.toLowerCase();
			update.author = updateAuthor;
		}

		Feedback.findByIdAndUpdate(id, update, {runValidators: true})
			.then((response) => {
				if (response === null) {
					res.status(404).send({error: 'The given feedback does not exist'})
				} else {
					return Feedback.findById(id)
				}
			}).then((response) => res.send(response))
			.catch((next));
	},

	delete(req, res, next) {
		const id = req.params.id;

		Feedback.findByIdAndRemove(id)
			.then((response) => {
				if (response === null) {
					res.status(404).send({error: 'The given feedback does not exist'})
				} else {
					res.send(response);
				}
			})
			.catch((next))
	}
};