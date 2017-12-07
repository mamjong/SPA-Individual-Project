const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');

const User = mongoose.model('user');

describe('Users controller receiving', () => {

	beforeEach((done) => {
		let testUser1 = new User({ username: 'testuser1' });

		testUser1.save()
			.then(() => {
				done();
			});
	});

	it('a GET request to /api/user/:username returns the user with the given username', (done) => {
		request(app)
			.get('/api/user/testuser1')
			.then((response) => {
				assert(response.body._id === 'testuser1');
				done();
			});
	});

	it('a POST request to /api/user creates a new user with the given properties if the username doesn\'t already exist', (done) => {
		request(app)
			.post('/api/users')
			.send({ username: 'testuser1' })
			.expect(422)
			.then(() => {
				request(app)
					.post('/api/users')
					.send({ username: 'testuser2' })
					.expect(201)
					.then((response) => {
						assert(response.body._id === 'testuser2');
						done();
					});
			});
	});

	it('a PUT request to /api/user/:username updates the user with the given properties and ignores the username property', (done) => {
		request(app)
			.put('/api/user/testuser1')
			.send({ username: 'updatedUsername', bio: 'The user now has a bio.', name: 'Test User' })
			.then((response) => {
				assert(response.body._id === 'testuser1');
				assert(response.body.bio === 'The user now has a bio.');
				assert(response.body.name === 'Test User');
				done();
			});
	});

	it('a DELETE request to /api/user/:username deletes the user with the given username if a user with said username exists', (done) => {

		request(app)
			.delete('/api/user/testuser2')
			.expect(404)
			.then((response) => {
			assert(response.body.error === 'The given user does not exist');
			request(app)
				.delete('/api/user/testuser1')
				.then((response) => {
					assert(response.body._id === 'testuser1');
					done();
				});
			});

	});
});
