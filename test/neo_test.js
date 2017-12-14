const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const driver = require('../neo4j');

const Concept = mongoose.model('concept');
const User = mongoose.model('user');
const Feedback = mongoose.model('feedback');

describe('Neo4J endpoints receiving ', () => {

	beforeEach((done) => {
		const session = driver.session();

		const sameDate = new Date('1999-6-6');
		const differentDate = new Date('1999-12-12');

		User.create({username: 'testuser1', DoB: '1999-6-6'})
			.then(() => {
				return User.create({username: 'testuser2', DoB: '1999-12-12'})
			})
			.then(() => {
				return User.create({username: 'testuser3', DoB: '1999-6-6'})
			})
			.then(() => {
				session.run('CREATE (user:User{username: {username}}) RETURN user', {username: 'testuser1'})
					.then(() => {
						return session.run('MATCH (user:User{username: {username}}) ' +
							'MERGE (dob:DoB{DoB: {birthdate}}) ' +
							'MERGE (user)-[:BORN_IN]->(dob) ' +
							'RETURN user, dob', {birthdate: sameDate.toDateString(), username: 'testuser1'})
					})
					.then(() => {
						session.run('CREATE (user:User{username: {username}}) RETURN user', {username: 'testuser3'})
							.then(() => {
								return session.run('MATCH (user:User{username: {username}}) ' +
									'MERGE (dob:DoB{DoB: {birthdate}}) ' +
									'MERGE (user)-[:BORN_IN]->(dob) ' +
									'RETURN user, dob', {birthdate: sameDate.toDateString(), username: 'testuser3'})
							});
					})
					.then(() => {
						session.run('CREATE (user:User{username: {username}}) RETURN user', {username: 'testuser2'})
							.then(() => {
								return session.run('MATCH (user:User{username: {username}}) ' +
									'MERGE (dob:DoB{DoB: {birthdate}}) ' +
									'MERGE (user)-[:BORN_IN]->(dob) ' +
									'RETURN user, dob', {
									birthdate: differentDate.toDateString(),
									username: 'testuser2'
								})
							});
					})
					.then(() => {
						done();
					})
			});
	});


		it('a postConnect request to /api/user/:id/connect adds the users DoB as a Node and creates a link between both.', (done) => {

			request(app)
				.post('/api/users')
				.send({username: 'test', DoB: '1900-1-1'})
				.then(() => {
					return request(app)
						.post('/api/user/test/connect');
				})
				.then((response) => {
					assert(response.body.summary.counters._stats.nodesCreated === 1);
					assert(response.body.summary.counters._stats.relationshipsCreated === 1);
					done();
				});
		});

		it('a putConnect request to /api/user/:id/connect adds the users new DoB as a Node and creates a link between both.', (done) => {

			request(app)
				.post('/api/users')
				.send({username: 'test', DoB: '1900-1-1'})
				.then(() => {
					return request(app)
						.post('/api/user/test/connect');
				})
				.then(() => {
					return request(app)
						.put('/api/user/test')
						.send({DoB: '1900-2-2'})
				})
				.then(() => {
					return request(app)
						.put('/api/user/test/connect');
				})
				.then((response) => {
					assert(response.body.summary.updateStatistics._stats.nodesCreated === 1);
					assert(response.body.summary.updateStatistics._stats.relationshipsCreated === 1);
					done();
				});
		});

		it('a GET request to /api/user/:username/related returns all users with the same DoB as the specified user.', (done) => {
			request(app)
				.get('/api/user/testuser1/related')
				.then((response) => {
					console.log(response.body.records[0]._fields[0].properties.username === 'testuser3');
					done();
				});
		})
	});