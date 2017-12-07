const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const config = require('./config/environment');

const app = express();

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
	mongoose.connect(config.dbConnectionUrl);
	mongoose.connection
		.once('open', () => console.log('Connected to MongoDB database on ' + config.dbConnectionUrl))
		.on('error', (error) => {
			console.warn('Warning', error.toString());
		});
}

app.use(bodyParser.json());

console.log('Environment variable set to: ' + process.env.ENV);

app.set('port', (process.env.PORT || config.environment.webPort));
app.set('env', (process.env.ENV || 'development'));

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

routes(app);

app.use((err, req, res, next) => {
	res.status(422).send({ error: err.message });
});

app.use('*', (req, res) => {
	res.status(400);
	res.json({
		'error': 'this URL does not exist'
	});
});

module.exports = app;