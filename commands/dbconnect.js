var mysql = require('mysql');
const { db_host, db_user, db_password } = require('../config.json');

module.exports = {
	name: 'dbconnect',
	cooldown: 20,
	description: 'Test connection to database. Usable only by HERO and HellFyre.',
	execute(message, args) {
		if(message.author.id === operator_id_one || message.author.id === operator_id_two){
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
		}
	},
};