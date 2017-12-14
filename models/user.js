const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: {
		type: String,
		alias: 'username',
		lowercase: true
	},
	name: String,
	DoB: {
		type: Date,
		required: [true, 'A date of birth is required.']
	},
	bio: String
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
