const app = require('./app');
const config = require('./config/environment');

app.listen(config.environment.webPort, function () {
	console.log('Server online and listening for requests on port ' + app.get('port'));
});
