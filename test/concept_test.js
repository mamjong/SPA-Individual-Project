const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

/*
Requiring the driver model using this method prevents express from creating the driver model more than once.
Express doesn't work very well alongside mongoose and mocha.
*/
const Concept = mongoose.model('concept');
const User = mongoose.model('user');

describe('Concepts controller receiving', () => {

	beforeEach((done) => {
		let testUser1 = new User({ username: 'testuser1' });
		let testConcept1 = new Concept({ title: 'testgame1', genre: 'MMORPG', description: 'First testing concept.' });
		let testConcept2 = new Concept({ title: 'testgame2', genre: 'FPP Shooter', description: 'Second testing concept.' });

		testConcept1.user = testUser1;
		testConcept2.user = testUser1;

		Promise.all([ testUser1.save(), testConcept1.save(), testConcept2.save() ])
			.then(() => {
				done();
			});
	});

	it('a GET request to /api/concept/:id returns a concept populated with the user', (done) => {

		Concept.findOne({ title: 'testgame1' })
			.then((concept) => {
				request(app)
					.get('/api/concept/' + concept._id)
					.then((response) => {
						assert(response.body.title === 'testgame1');
						assert(response.body.user.username === 'testuser1');
						done();
					});
			});
	});

	it('a GET request to /api/concepts returns a list of all concepts', (done) => {
		request(app)
			.get('/api/concepts')
			.then((response) => {
				assert(response.body.length === 2);
				done();
			});
	});

	xit('a POST request to /api/concepts creates a new concept with the given properties', (done) => {

		User.findOne({ username: 'testuser1' })
			.then((user) => {
				request(app)
					.post('/api/concepts')
					.send({ title: 'createdConcept', user })
			});
	});
});