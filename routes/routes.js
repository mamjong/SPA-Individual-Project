const ConceptsController = require('../controllers/concepts_controller');
const UserController = require('../controllers/users_controller');

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
};