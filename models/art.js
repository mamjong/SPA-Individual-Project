const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtSchema = new Schema({
	path: {
		type: String,
		validate: {
			validator: (path) => path.endsWith('.jpg') || path.endsWith('.jpeg'),
			message: 'The image must be a JPEG.'
		}
	}
});

module.exports = ArtSchema;