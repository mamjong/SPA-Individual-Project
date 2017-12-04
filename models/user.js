const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'A username is required.']
	},
	name: String,
	DoB: Date,
	bio: String
});

UserSchema.pre('delete', function(next) {
	const Concept = mongoose.model('concept');

	Concept.remove({ user: this})
		.then(() => next());
	// TODO: remove from Neo4J
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
