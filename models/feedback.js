const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = mongoose.Schema({
	content: {
		type: String,
		required: [true, 'Please provide this concept with written feedback.']
	},
	rating: {
		type: Number,
		required: [true, 'Please give this concept a rating.'],
		min: 1,
		max: 5,
	},
	author: {
		type: Schema.Types.String,
		ref: 'user',
		lowercase: true,
	},
	concept: {
		type: Schema.Types.ObjectId,
		ref: 'concept',
		required: [true, 'Feedback must be linked to a concept.']
	}
});

const Feedback = mongoose.model('feedback', FeedbackSchema);

module.exports = Feedback;