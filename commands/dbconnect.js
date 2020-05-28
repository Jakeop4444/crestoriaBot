var mysql = require('mysql');
const { db_host, db_user, db_password } = require('../config.json');

module.exports = {
	name: 'dbconnect',
	cooldown: 20,
	description: 'Test connecting to the Database',
	execute(message, args) {
		var connec = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password
		});

		connec.connect(function(error) {
			if (error) throw error;
			console.log("Connected to db!");
		});

		connec.end();
	},
};