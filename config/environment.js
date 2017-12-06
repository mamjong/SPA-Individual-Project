const environment = {
	webPort: process.env.PORT || 3000,
	dbHost: process.env.DB_HOST || 'localhost',
	dbPort: process.env.DB_PORT || '',
	dbUser: process.env.DB_USER || '',
	dbPassword: process.env.DB_PASSWORD || '',
	dbDatabase: process.env.DB_DATABASE || 'gameConcepts'
};

const dbConnectionUrl = process.env.NODE_ENV === 'production' ?
	'mongodb://' + environment.dbUser + ':' + environment.dbPassword + '@' + environment.dbHost + ':' + environment.dbPort + '/' + environment.dbDatabase :
	'mongodb://localhost/' + environment.dbDatabase;

module.exports = {
	environment: environment,
	dbConnectionUrl: dbConnectionUrl
};
