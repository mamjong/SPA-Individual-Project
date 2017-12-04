const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

/*
Requiring the driver model using this method prevents express from creating the driver model more than once.
Express doesn't work very well alongside mongoose and mocha.
*/
const Concept = mongoose.model('concept');
// const User = mongoose.model('user');

describe('Concepts controller receiving', () => {

	beforeEach((done) => {
		// let testUser1 = new User({ username: 'testuser1' });
		let testConcept1 = new Concept({ title: 'testgame1', genre: 'MMORPG', description: 'First testing concept.' });
		let testConcept2 = new Concept({ title: 'testgame2', genre: 'FPP Shooter', description: 'Second testing concept.' });

		// testConcept1.author = testUser1;
		// testConcept2.author = testUser1;

		Promise.all([ testConcept1.save(), testConcept2.save() ])
			.then(() => {
				done();
			});
	});

	it('a get request to /api/concepts returns a list of all concepts', (done) => {
		request(app)
			.get('/api/concepts')
			.then(() => {
				Concept.count().then((count) => {
					assert(count === 2);
					done();
				});
			});
	});

});