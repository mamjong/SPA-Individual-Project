const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ArtSchema = require('./art');

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
	art: [ArtSchema],
	user: {
		type: Schema.Types.String,
		ref: 'user',
		lowercase: true,
		required: [true, 'A concept must be linked to a user.']
	}
});

const Concept = mongoose.model('concept', ConceptSchema);

module.exports = Concept;