const ConceptsController = require('../controllers/concepts_controller');
const UserController = require('../controllers/users_controller');
const FeedbackController = require('../controllers/feedback_controller');

module.exports = (app) => {

	// Concept routes

	app.get('/api/concepts', ConceptsController.get);

	app.get('/api/concept/:id', ConceptsController.getOne);

	app.post('/api/concepts', ConceptsController.post);

	app.put('/api/concept/:id', ConceptsController.put);

	app.delete('/api/concept/:id', ConceptsController.delete);

	// User routes

	app.get('/api/user/:username', UserController.getOne);

	app.post('/api/users', UserController.post);

	app.put('/api/user/:username', UserController.put);

	app.delete('/api/user/:username', UserController.delete);

	// Feedback routes

	app.get('/api/feedback/:id', FeedbackController.get);

	app.post('/api/feedback', FeedbackController.post);

	app.put('/api/feedback/:id', FeedbackController.put);

	app.delete('/api/feedback/:id', FeedbackController.delete);
};