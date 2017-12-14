const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

const Concept = mongoose.model('concept');
const User = mongoose.model('user');
const Feedback = mongoose.model('feedback');

describe('Feedback controller receiving', () => {

	beforeEach((done) => {
		let testFeedback1 = new Feedback({content: 'testcontent1', rating: 2});
		let testFeedback2 = new Feedback({content: 'testcontent2', rating: 3});

		let testUser = new User({username: 'testuser1', DoB: '1999-06-29'});

		let testConcept1 = new Concept({title: 'testconcept1', genre: 'MMORPG', description: 'This is a test concept'});
		let testConcept2 = new Concept({
			title: 'testconcept2',
			genre: 'FPP Shooter',
			description: 'This is a second test concept'
		});

		testFeedback1.concept = testConcept1;
		testFeedback2.concept = testConcept2;

		testConcept1.user = testUser;
		testConcept2.user = testUser;

		Promise.all([testUser.save(), testConcept1.save(), testConcept2.save(), testFeedback1.save(), testFeedback2.save()])
			.then(() => {
				done();
			})
	});

	it('a GET request to /api/feedback/:id returns all feedback on the concept with given id', (done) => {

		Concept.findOne({title: 'testconcept1'})
			.then((concept) => {
				return request(app)
					.get('/api/feedback/' + concept._id)
			})
			.then((response) => {
				assert(response.body.length === 1);
				assert(response.body[0].content === 'testcontent1');
				done();
			});
	});

	it('a POST request to /api/feedback creates a new feedback post with the given properties', (done) => {

		let concept = {};

		Concept.findOne({title: 'testconcept2'})
			.then((dbConcept) => {
				concept = dbConcept;
				return request(app)
					.post('/api/feedback')
					.send({content: 'Test created feedback', rating: 1, concept: concept._id})
					.expect(201)
			})
			.then((response) => {
				assert(response.body.content === 'Test created feedback');
				assert(response.body.rating === 1);
				assert(response.body.concept === concept._id.toString());
				done();
			});
	});

	it('a PUT request to /api/feedback/:id updates the feedback with the given properties, if said feedback exists, and validates properties', (done) => {

		Feedback.findOne({content: 'testcontent1'})
			.then((feedback) => {
				return request(app)
					.put('/api/feedback/' + feedback._id)
					.send({content: 'Test updated feedback', rating: 3, author: 'TESTUSER1'})
			})
			.then((response) => {
				assert(response.body.content === 'Test updated feedback');
				assert(response.body.rating === 3);
				assert(response.body.author === 'testuser1');
				return request(app)
					.put('/api/feedback/000000000000000000000000')
					.expect(404)
			})
			.then((response) => {
				assert(response.body.error === 'The given feedback does not exist');
				done();
			});
	});

	it('a DELETE request to /api/feedback/:id deletes feedback with the given id if feedback with said id exists', (done) => {

		let feedback = {};

		Feedback.findOne({content: 'testcontent2'})
			.then((dbFeedback) => {
				feedback = dbFeedback;
				return request(app)
					.delete('/api/feedback/' + feedback._id)
			})
			.then((response) => {
				assert(response.body.content === 'testcontent2');
				return Feedback.findOne({content: 'testcontent2'})
			})
			.then((response) => {
				assert(response === null);
				return request(app)
					.delete('/api/feedback/000000000000000000000000')
					.expect(404)
			})
			.then((response) => {
				assert(response.body.error === 'The given feedback does not exist');
				done();
			});

	});

});