const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: {
		type: String,
		alias: 'username',
		lowercase: true
	},
	name: String,
	DoB: Date,
	bio: String
});

UserSchema.pre('remove', function(next) {
	const Concept = mongoose.model('concept');

	Concept.remove({ user: this._id})
		.then(() => next());
	// TODO: remove from Neo4J
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
