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
	const {concepts, users, feedbacks} = mongoose.connection.collections;

	const session = driver.session();

	session.run('MATCH (n) DETACH DELETE n;')
		.then(() => {
			concepts.drop(() => {
				users.drop(() => {
					feedbacks.drop(() => {
						done();
					});
				});
			});
		});
});

