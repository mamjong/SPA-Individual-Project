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
	}
};