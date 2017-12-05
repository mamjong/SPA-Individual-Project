const User = require('../models/user');

module.exports = {

	getOne(req, res, next) {
		const username = req.params.username;

		User.findOne({ username: username })
			.then((user) => res.send(user))
			.catch((next));
	},

	post(req, res, next) {
		const newEntry = req.body;
		const newEntryUsername = req.body.username;

		User.findOne({username: newEntryUsername})
			.then((response) => {
				if (response !== null) {
					res.status(422).send({ error: 'The given username already exists' })
				} else {
					User.create(newEntry)
						.then((createdEntry) => res.status(201).send(createdEntry))
						.catch((next));
				}
			})
			.catch((next));
	},

	put(req, res, next) {
		const username = req.params.username;
		const update = req.body;

		delete update.username;

		User.findOneAndUpdate({ username: username }, update)
			.then((response) => {
				if (response === null) {
					res.status(404).send({ error: 'The given user does not exist' })
				} else {
					User.findOne({ username: username })
						.then((updatedEntry) => res.send(updatedEntry))
						.catch((next))
				}
			})
			.catch((next));
	},

	delete(req, res, next) {
		const username = req.params.username;

		console.log('Request received!');

		User.findOneAndRemove({ username: username })
			.then((response) => {
				if (response === null) {
					res.status(404).send({ error: 'The given user does not exist' })
				} else {
					res.send(response);
				}
			})
			.catch((next))
	}
};