const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConceptSchema = new Schema({
	title: {
		type: String,
		required: [true, 'A concept must have a title.']
	},
	genre: {
		type: String,
		required: [true, 'A concept must have a genre.']
	},
	description: {
		type: String,
		required: [true, 'A concept must have a gameplay description.']
	},
	likes: Number,
	artImagePaths: [{
		path: {
			type: String,
			validate: {
				validator: (path) => path.endsWith('.jpg' || '.jpeg'),
				message: 'The image must be a JPEG.'
			}
		}
	}],
	user: {
		type: String,
		ref: 'user.username'
	}
});

const Concept = mongoose.model('concept', ConceptSchema);

module.exports = Concept;