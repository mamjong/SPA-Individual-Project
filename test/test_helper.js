const mongoose = require('mongoose');
var driver = require('../neo4j');

mongoose.Promise = global.Promise;

before((done) => {
	mongoose.connect('mongodb://localhost/gameConcepts_test');
	mongoose.connection
		.once('open', () => {
			console.log('Connected to MongoDB testing database on mongodb://localhost/gameConcepts_test');
			done();
		})
		.on('error', (error) => {
			console.warn('Warning', error.toString())
		});
});

beforeEach((done) => {
	//TODO: drop newly added models
	const {concepts, users, feedbacks} = mongoose.connection.collections;

	const session = driver.session();

	// session.run('MATCH (n) DETACH DELETE n;')
	// 	.then(() => {
	// 		concepts.drop(() => {
	// 			users.drop(() => {
	// 				feedbacks.drop(() => {
	// 					done();
	// 				});
	// 			});
	// 		});
	// 	});

	session.run('MATCH (n) DETACH DELETE n;')
		.then(() => {
		return concepts.drop();
		})
		.then(() => {
		return users.drop();
		})
		.then(() => {
		return feedbacks.drop();
		})
		.then(() => {
		done();
		});
});

