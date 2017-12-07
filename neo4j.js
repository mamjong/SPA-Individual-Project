var neo4j = require('neo4j-driver').v1;
var config = require('./config/environment');

var driver = neo4j.driver(config.neoDbConnectionUrl, neo4j.auth.basic(config.neoDbUsername, config.neoDbPassword));
var session = driver.session();

module.exports = session;
