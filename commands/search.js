var mysql = require('mysql');
const { db_host, db_user, db_password, db_name, db_table } = require('../config.json');


module.exports = {
	name: 'search',
	cooldown: 5,
	description: 'Find and display a Unit!',
	execute(message, args) {
		var q_name = '*', q_element = '*', q_rarity = '*', q_type = '*';
		var connec = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password,
			database: db_name
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

		
		var sql = "SELECT Name, Title, Element, Rarity, Type FROM characters WHERE";
		if(q_name != '*'){
			sql += " Name = '"+q_name+"'";
		}
		if(q_element != '*'){
			if(q_name != '*'){
				sql += " AND";
			}
			sql += " Element = '"+q_element+"'";	
		}
		if(q_rarity != '*'){
			if(q_name != '*' || q_element != '*'){
				sql += " AND";	
			}
			sql += " Rarity = '"+q_rarity+"'";
		}
		if(q_type != '*'){
			if(q_name != '*' || q_element != '*' || q_rarity != '*'){
				sql += " AND";
			}
			sql += " Rarity = '"+q_type+"'";
		}
		connec.query(sql, function (error, result, fields) {
			if (error) console.log(error);
			//console.log("Result:" + result);
			//console.log("Fields:" + fields);
			console.log(sql);
			console.log(result[0].Name+" "+result[0].Title+" "+result[0].Element+" "+result[0].Rarity+" "+result[0].Type);
		});
		/*var sql = "SELECT Name, Title, Element, Rarity, Type FROM characters WHERE Name = "+q_name;//+"' AND Element = '"+q_element+"' AND Rarity = '"+q_rarity+"' AND Type = '"+q_type+"'";
		//var sql = "SELECT * FROM characters WHERE Name = ? AND Element = ? AND Rarity = ? AND Type = ?";
		connec.query(sql, function (error, result, fields) {
			if (error) console.log(error);
			console.log(sql);
			console.log("Result:" + result);
		});*/
		

		connec.end();
	},
};