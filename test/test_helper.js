const mongoose = require('mongoose');

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
	const { concepts, users } = mongoose.connection.collections;

	concepts.drop(() => {
		users.drop(() => {
			done();
		});
	});
});