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
		let testConcept1 = new Concept({ title: 'testgame1', genre: 'MMORPG', description: 'First testing concept.',
			artImagePaths: [{ path: 'test.jpg' }]});
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

	it('a POST request to /api/concepts creates a new concept with the given properties', (done) => {

		User.findOne({ username: 'testuser1' })
			.then((user) => {
				request(app)
					.post('/api/concepts')
					.send({ title: 'createdConcept', genre: 'MMORPG', description: 'Test created concept', user })
					.expect(201)
					.then((response) => {
						console.log(response.body.user + ' = ' + user._id);
						assert(response.body.title === 'createdConcept');
						assert(response.body.user === user._id.toString());
						done();
					});
			});
	});

	it('a PUT request to /api/concept/:id updates the concept with the given properties, if said concept exists, and validates properties', (done) => {
		Concept.findOne({ title: 'testgame1' })
			.then((concept) => {
				request(app)
					.put('/api/concept/000000000000000000000000')
					.expect(404)
					.then((response) => {
						assert(response.body.error === 'The given concept does not exist')
						request(app)
							.put('/api/concept/' + concept._id)
							.send({ artImagePaths: [{ _id: concept.artImagePaths[0]._id, path: 'test.png' }] })
							.expect(422)
							.then(() => {
								request(app)
									.put('/api/concept/' + concept._id)
									.send({ artImagePaths: [{ _id: concept.artImagePaths[0]._id, path: 'updatedtest.jpg' }] })
									.then((response) => {
										assert(response.body.artImagePaths[0].path === 'updatedtest.jpg');
										done();
									});
							})
					});
			});
	});

	it('a DELETE request to /api/concept/:id deletes a concept with the given id if a concept with said id exists', (done) => {
		Concept.findOne({ title: 'testgame1' })
			.then((concept) => {
				request(app)
					.delete('/api/concept/000000000000000000000000')
					.expect(404)
					.then((response) => {
						assert(response.body.error === 'The given concept does not exist');
						request(app)
							.delete('/api/concept/' + concept._id)
							.then((response) => {
								assert(response.body.title === 'testgame1');
								done();
							});
					});
			});
	});
});