const Concept = require('../models/concept');

module.exports = {

	get(req, res, next) {
		console.log('Request received!');
		Concept.find({})
			.then((concepts) => res.send(concepts))
			.catch((next));
	},

	create(req, res, next) {

	}
};