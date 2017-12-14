const Concept = require('../models/concept');
const Feedback = require('../models/feedback');

module.exports = {

	get(req, res, next) {
		Concept.find({})
			.then((concepts) => res.send(concepts))
			.catch((next));
	},

	getOne(req, res, next) {
		const id = req.params.id;

		Concept.findById(id).populate('user')
			.then((concept) => res.send(concept))
			.catch((next));
	},

	post(req, res, next) {
		const newEntry = req.body;

		Concept.create(newEntry)
			.then((createdEntry) => res.status(201).send(createdEntry))
			.catch((next));
	},

	put(req, res, next) {
		const id = req.params.id;
		const update = req.body;
		const receivedUser = req.body.user;

		if (receivedUser !== undefined) {
			const updateUser = receivedUser.toLowerCase();
			update.user = updateUser;
		}

		Concept.findByIdAndUpdate(id, update, {runValidators: true})
			.then((response) => {
				if (response === null) {
					res.status(404).send({error: 'The given concept does not exist'})
				} else {
					return Concept.findById(id)
				}
			})
			.then((updatedEntry) => res.send(updatedEntry))
			.catch((next));
	},

	delete(req, res, next) {
		const id = req.params.id;

		Concept.findByIdAndRemove(id)
			.then((dbResponse) => {
				if (dbResponse === null) {
					res.status(404).send({error: 'The given concept does not exist'});
				} else {
					Feedback.remove({concept: id})
						.then(() => {
							res.send(dbResponse);
						})
						.catch((next))
				}
			})
			.catch((next));
	}
};