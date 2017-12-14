const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

const Concept = mongoose.model('concept');
const User = mongoose.model('user');
const Feedback = mongoose.model('feedback');

describe('Users controller receiving', () => {

	beforeEach((done) => {
		let testUser1 = new User({username: 'testuser1', DoB: '1999-06-29'});
		let testConcept1 = new Concept({title: 'testconcept1', genre: 'MMORPG', description: 'A testing concept'});
		let testFeedback1 = new Feedback({content: 'testfeedback1', rating: 4});

		testConcept1.user = testUser1;
		testFeedback1.concept = testConcept1;
		testFeedback1.author = testUser1;

		Promise.all([testUser1.save(), testConcept1.save(), testFeedback1.save()])
			.then(() => {
				done();
			});
	});

	it('a GET request to /api/user/:username returns the user with the given username and an error if that user doesn\'t exist', (done) => {
		request(app)
			.get('/api/user/TESTUSER1')
			.then((response) => {
				assert(response.body._id === 'testuser1');
				return request(app)
					.get('/api/user/nonexistinguser');
			})
			.then((response) => {
				assert(response.body.error === 'The given user does not exist');
				done();
			})
	});

	it('a POST request to /api/user creates a new user with the given properties if the username doesn\'t already exist', (done) => {
		request(app)
			.post('/api/users')
			.send({username: 'testuser1'})
			.expect(422)
			.then(() => {
				return request(app)
					.post('/api/users')
					.send({username: 'testuser2', DoB: '1999-06-29'})
					.expect(201)
			})
			.then((response) => {
				assert(response.body.neo4J.summary.counters._stats.nodesCreated === 1);
				assert(response.body.neo4J.records[0]._fields[0].properties.username === 'testuser2');
				assert(response.body.mongoDB._id === 'testuser2');
				done();
			});

	});

	it('a PUT request to /api/user/:username updates the user with the given properties and ignores the username property', (done) => {

		request(app)
			.put('/api/user/randomuser')
			.expect(404)
			.then((response) => {
				assert(response.body.error === 'The given user does not exist');
				return request(app)
					.put('/api/user/TESTUSER1')
					.send({username: 'updatedUsername', bio: 'The user now has a bio.', name: 'Test User'})
			})
			.then((response) => {
				assert(response.body._id === 'testuser1');
				assert(response.body.bio === 'The user now has a bio.');
				assert(response.body.name === 'Test User');
				done();
			});

	});

	it('a DELETE request to /api/user/:username deletes the user, his/her feedback and concepts, with the given username if a user with said username exists', (done) => {

		request(app)
			.delete('/api/user/testuser2')
			.expect(404)
			.then((response) => {
				assert(response.body.error === 'The given user does not exist');
				return request(app)
					.post('/api/users')
					.send({username: 'testuser3', DoB: '1999-12-30'})
			})
			.then(() => {
				return request(app)
					.delete('/api/user/TESTUSER3')
			})
			.then((response) => {
				assert(response.body.neo4J.summary.counters._stats.nodesDeleted === 1);
				return request(app)
					.delete('/api/user/TESTUSER1')
			})
			.then((response) => {
				assert(response.body.mongoDB._id === 'testuser1');
				return User.findOne({username: 'testuser1'})
			})
			.then((response) => {
				assert(response === null);
				return Concept.findOne({user: 'testuser1'})
			})
			.then((response) => {
				assert(response === null);
				return Feedback.findOne({author: 'testuser1'})
			})
			.then((response) => {
				assert(response === null);
				done();
			})
	});
});
