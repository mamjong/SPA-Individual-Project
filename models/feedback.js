const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./user');

const FeedbackSchema = mongoose.Schema({
	content: {
		type: String,
		required: [true, 'Please provide this concept with written feedback.']
	},
	rating: {
		type: Number,
		required: [true, 'Please give this concept a rating.'],
		validate: {
			validator: (rating) => rating.max(5) && rating.min(1),
			message: 'Rating must be between 1 and 5.'
		}
	},
	author: [UserSchema.username]
});

const Feedback = mongoose.model('feedback', FeedbackSchema);

module.exports = Feedback;