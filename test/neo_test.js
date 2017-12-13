const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

const Concept = mongoose.model('concept');
const User = mongoose.model('user');
const Feedback = mongoose.model('feedback');

xdescribe('Feedback controller receiving', () => {

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

	xit('a GET request to /api/feedback/:id returns all feedback on the concept with given id', (done) => {

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
});