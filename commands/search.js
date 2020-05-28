var mysql = require('mysql');
const { db_host, db_user, db_password, db_name } = require('../config.json');
var q_name = '*', q_element = '*', q_rarity = '*', q_type = '*';

module.exports = {
	name: 'search',
	cooldown: 5,
	description: 'Find and display a Unit!',
	execute(message, args) {
		var connec = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password
		});

		var counter = 0;
		while(counter < args.length){
			if (args[counter] === 'name'){
				q_name = args[counter+1];
				console.log("Name set.");
			} else if (args[counter] === 'element'){
				q_element = args[counter+1];
				console.log("Element set.");
			} else if (args[counter] === 'rarity'){
				q_rarity = args[counter+1];
				console.log("Rarity set.");
			} else if (args[counter] === 'type'){
				q_type = args[counter+1];
				console.log("Type set.");
			}

			counter += 2;
		}

		var sql = 'SELECT * FROM ? WHERE Name = ? AND Element = ? AND Rarity = ? AND Type = ?';
		connec.connect(function(error) {
			if (error) throw error;
			console.log("Connected to db!");

			connect.query(sql, [db_name, q_name, q_element, q_rarity, q_type], function (error, result) {
				if (error) throw error;
				console.log("Result:" + result);
			})
		});

		connec.end();
	},
};