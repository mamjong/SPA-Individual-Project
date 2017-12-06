const Concept = require('../models/concept');

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

		Concept.findByIdAndUpdate(id, update, { runValidators: true })
			.then((response) => {
				if (response === null) {
					res.status(404).send({ error: 'The given concept does not exist' })
				} else {
					Concept.findById(id)
						.then((updatedEntry) => res.send(updatedEntry))
						.catch((next));
				}
			})
			.catch((next));
	},

	delete(req, res, next) {
		const id = req.params.id;

		Concept.findByIdAndRemove(id)
			.then((response) => {
				if (response === null) {
					res.status(404).send({ error: 'The given concept does not exist' })
				} else {
					res.send(response);
				}
			})
			.catch((next))
	}
};