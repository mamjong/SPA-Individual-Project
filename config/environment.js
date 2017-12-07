const neo4j = require('neo4j-driver').v1;

var neoDbConnectionUrl = '';
var neoDbUsername = '';
var neoDbPassword = '';

const environment = {
	webPort: process.env.PORT || 3000,
	dbHost: process.env.DB_HOST || 'localhost',
	dbPort: process.env.DB_PORT || '',
	dbUser: process.env.DB_USER || '',
	dbPassword: process.env.DB_PASSWORD || '',
	dbDatabase: process.env.DB_DATABASE || 'gameConcepts'
};

const mongoDbConnectionUrl = process.env.NODE_ENV === 'production' ?
	'mongodb://' + environment.dbUser + ':' + environment.dbPassword + '@' + environment.dbHost + ':' + environment.dbPort + '/' + environment.dbDatabase :
	'mongodb://localhost/' + environment.dbDatabase;

if (process.env.NODE_ENV === 'production') {
	neoDbConnectionUrl = 'bolt://hobby-nefmjjnckhclgbkemmdapial.dbs.graphenedb.com:24786';
	neoDbUsername = 'administrator';
	neoDbPassword = 'b.oR8fpCRUazq5.emvTXMNCeob3arKw';
} else {
	neoDbConnectionUrl = 'bolt://localhost';
	neoDbUsername = 'Admin';
	neoDbPassword = 'Admin123';
}

module.exports = {
	environment: environment,
	mongoDbConnectionUrl: mongoDbConnectionUrl,
	neoDbConnectionUrl: neoDbConnectionUrl,
	neoDbUsername: neoDbUsername,
	neoDbPassword: neoDbPassword
};
