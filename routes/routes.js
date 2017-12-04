const ConceptsController = require('../controllers/concepts_controller');

module.exports = (app) => {

	app.get('/api/concepts', ConceptsController.get)
};