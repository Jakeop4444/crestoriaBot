const mysql = require('mysql');
const { db_host, profile_user, profile_password, profile_db, profile_table, db_user, db_password, db_name, db_table} = require('./config.json');

var connection;
var connectionArray = [];
module.exports = {
	singleQuery: function(sqlQuery1, author){
		connection = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password,
			database: db_name,
			multipleStatements: true
		});
		if(connectionArray[author] != null){
			connectionArray[author].end();
		}
		connectionArray[author] = connection;
		return new Promise(function(resolve, reject){
			connectionArray[author].query(sqlQuery1, function(error, result, fields){
				//console.log("[DEBUG] Invoking Query 1");
				if(error){
					console.log("[SQL MANAGER] There has been an error in Single Query");
					return reject(error);
				}
				resolve(result);
			});
		});
	},

	doubleQuery: function(sqlQuery1, sqlQuery2, author){
		connection = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password,
			database: db_name,
			multipleStatements: true
		});
		if(connectionArray[author] != null){
			connectionArray[author].end();
		}
		connectionArray[author] = connection;
		return new Promise(function(resolve, reject){
			connectionArray[author].query(sqlQuery1, function(error, result, fields){
				//console.log("[DEBUG] Invoking Query 1");
				if(error){
					console.log("[SQL MANAGER] There has been an error in Double Query Pt 1");
					return reject(error);
				}
				if(result.length === 0){
					//console.log(sqlQuery2);
					//console.log("[DEBUG] No Results Found. Invoking Query 2");
					connectionArray[author].query(sqlQuery2, function(error, result, fields){
						if(error){
							return reject(error);
							console.log("[SQL MANAGER] There has been an error in Double Query Pt 2");
						}
						resolve(result);
					});
				}else{
					resolve(result);
				}
			});
		});
	},

	createProfileCard: function(author){
		connection = mysql.createConnection({
			host: db_host,
			user: profile_user,
			password: profile_password,
			database: profile_db,
			multipleStatements: true
		});
		if(connectionArray[author] != null){
			connectionArray[author].end();
		}
		connectionArray[author] = connection;
		return new Promise(function(resolve, reject){
			var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+author;
			connectionArray[author].query(sql, function(error, result, fields){
				if(error){
					console.log("[SQL MANAGER] There has been an error in Create Query");
					return reject(error);
				}
				resolve(result);
			});
		});
	},

	queryProfileCard: function(query, author){
		connection = mysql.createConnection({
			host: db_host,
			user: profile_user,
			password: profile_password,
			database: profile_db,
			multipleStatements: true
		});
		if(connectionArray[author] != null){
			connectionArray[author].end();
		}
		connectionArray[author] = connection;
		return new Promise(function(resolve, reject){
			connectionArray[author].query(query, function(error, result, fields){
				if(error){
					console.log("[SQL MANAGER] There has been an error in Profile Query");
					return reject(error);
				}
				resolve(result);
			});
		});
	},

	endConnection: function(author){
		console.log("[SQL MANAGER] Connection for "+author+" has ended.");
		connectionArray[author].end();
		connectionArray[author] = null;
	}
}
