const User = require('../models/user');
const Concept = require('../models/concept');
const Feedback = require('../models/feedback');
var driver = require('../neo4j');


module.exports = {

	getOne(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		User.findById(username)
			.then((user) => res.send(user))
			.catch((next));
	},

	getRelated(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		const session = driver.session();

		User.findById(username)
			.then((user) => {
				return session.run('MATCH (user:User), ' +
					'(user)-[:BORN_IN]->(dob:DoB{DoB: {birthdate}})' +
					'RETURN user', {birthdate: user.DoB.toDateString()})
			})
			.then((response) => {
				res.send(response);
			})
			.catch((next));
	},

	post(req, res, next) {
		const newEntry = req.body;

		const session = driver.session();
		let entry = {};

		User.create(newEntry)
			.then((createdEntry) => {
				entry = createdEntry;
				return session
					.run('CREATE (user:User{username: {username}}) RETURN user', {username: createdEntry.username})
			})
			.then((response) => {
				res.status(201).send({mongoDB: entry, neo4J: response});
				session.close();
			})
			.catch((next));

	},

	postConnect(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		const session = driver.session();
		let user = {};

		User.findById(username)
			.then((dbUser) => {
				user = dbUser;
				return session
					.run('MATCH (user:User{username: {username}})-[:BORN_IN]->(dob) ' +
						'RETURN user', {username: user.username})
			})
			.then((response) => {
				if (response.records.length !== 0) {
					res.status(400).send({error: 'User is already connected or doesn\'t exist'});
					session.close();
				} else {
					return session.run('MATCH (user:User{username: {username}}) ' +
						'MERGE (dob:DoB{DoB: {birthdate}}) ' +
						'MERGE (user)-[:BORN_IN]->(dob) ' +
						'RETURN user, dob', {birthdate: user.DoB.toDateString(), username: user.username})
				}
			})
			.then((response) => {
				res.status(201).send(response);
				session.close();
			})
			.catch((next));
	},

	put(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		const update = req.body;

		delete update.username;

		User.findByIdAndUpdate(username, update)
			.then((response) => {
				if (response === null) {
					res.status(404).send({error: 'The given user does not exist'})
				} else {
					return User.findById(username)
				}
			})
			.then((updatedEntry) => res.send(updatedEntry))
			.catch((next));
	},

	putConnect(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		const session = driver.session();

		User.findById(username)
			.then((user) => {
				session
					.run('MATCH (user:User{username: {username}})-[:BORN_IN]->(dob) ' +
						'RETURN dob', {username: username})
					.then((response) => {
						if (response.records.length === 0) {
							res.status(400).send({error: 'User is not yet connected or doesn\'t exist, post to api/user/' + username + '/connect'});
						} else {
							if (response.records[0]._fields[0].properties.DoB === user.DoB.toDateString()) {
								res.status(400).send({error: 'Users date of birth connection is up-to-date'})
							} else {
								return session.run('MATCH (user:User{username: {username}})-[rel:BORN_IN]->(dob) ' +
									'DELETE rel', {username: username})
									.then(() => {
										return session.run('MATCH (user:User{username: {username}}) ' +
											'MERGE (dob:DoB{DoB: {birthdate}}) ' +
											'MERGE (user)-[:BORN_IN]->(dob) ' +
											'RETURN user, dob', {
											birthdate: user.DoB.toDateString(),
											username: username
										})
									})
									.then((response) => {
										session.close();
										res.send(response);
									})
									.catch((next));
							}
						}
					})
			})
			.catch((next));
	},

	delete(req, res, next) {
		const param = req.params.username;
		const username = param.toLowerCase();

		User.findByIdAndRemove(username)
			.then((mongoResponse) => {
				if (mongoResponse === null) {
					res.status(404).send({error: 'The given user does not exist'})
				} else {
					const session = driver.session();
					Concept.remove({user: username})
						.then(() => {
							return Feedback.remove({author: username})
						})
						.then(() => {
							return session.run('MATCH (user:User{username: {username}}) ' +
								'DETACH DELETE user', {username: username})
						})
						.then((neoResponse) => {
							res.send({mongoDB: mongoResponse, neo4J: neoResponse});
							session.close();
						})
						.catch((next));
				}
			})
			.catch((next));
	}
};