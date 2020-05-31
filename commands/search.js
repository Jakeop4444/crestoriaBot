const { MessageEmbed } = require('discord.js');
const mysql = require('mysql');
const { db_host, db_user, db_password, db_name, db_table } = require('../config.json');
const emoji = require('../emoji.json');


module.exports = {
	name: 'search',
	cooldown: 5,
	description: 'Search the database for a Unit! Usage: !search (name|element|rarity|type) input. Example Command: !search name Stahn',
	execute(message, args) {
		var q_name = '*', q_element = '*', q_rarity = '*', q_type = '*';
		var connec = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password,
			database: db_name
		});

		var var_set = false;
		var counter = 0;
		while(counter < args.length){
			if (args[counter] === 'name'){
				q_name = args[counter+1];
				var_set = true;
				console.log("Name set.");
			} else if (args[counter] === 'element'){
				q_element = args[counter+1];
				var_set = true;
				console.log("Element set.");
			} else if (args[counter] === 'rarity'){
				q_rarity = args[counter+1];
				var_set = true;
				console.log("Rarity set.");
			} else if (args[counter] === 'type'){
				q_type = args[counter+1];
				var_set = true;
				console.log("Type set.");
			}

			counter += 2;
		}

		if(var_set != true){
			message.reply("Invalid Arguments");
			return;
		}

		
		var sql = "SELECT Name, Image, Title, Element, Rarity, Type FROM characters WHERE";
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
			sql += " Type = '"+q_type+"'";
		}

		//var output = ''
		var many_names = "";
		connec.query(sql, function (error, result, fields) {
			if (error) console.log(error);
			//console.log("Result:" + result);
			//console.log("Fields:" + fields);
			//console.log(sql);

			//Check for result array length
			if (result.length > 1){
				//Length > 1, means we found more than one unit following the user's guidelines
				result.forEach(data => many_names += ("[[" + data.Title + "] " + data.Name + "](https://www.tocdb.xyz/" + data.Rarity.toLowerCase() + "/" + data.Name + ".php) \n") );
				const embed = {
					"color": 13632027,
					"author": {
						"name": result.length + " entries were found!"
					},
					"description": many_names,
					"footer": {
					    "text": "https://www.tocdb.xyz/index.php"
					}
				}

				message.channel.send({embed});
			} else if (result.length < 1){
				message.channel.send('No entries were found!');
			} else if (result.length === 1){
				//Length is == 1, print the result in pretty fashion
				console.log(result[0].Image);
				console.log(result[0].Title + "\n" + "Rarity: " + result[0].Rarity + "\n" + "Element: " + result[0].Element + "\n" + "Weapon Type: " + result[0].Type);
				const embed_single = new MessageEmbed()
				.setTitle(result[0].Name)
				.setURL('https://www.tocdb.xyz/' + result[0].Rarity.toLowerCase() + '/' + result[0].Name + '.php')
				.setColor(0xFF0000)
				.setDescription(result[0].Title + "\n" + "Rarity: " + emoji[result[0].Rarity] + "\n" + "Element: " + emoji[result[0].Element] + "\n" + "Weapon Type: " + emoji[result[0].Type])
				.setImage(result[0].Image)
				.setFooter("https://www.tocdb.xyz/index.php");

				message.channel.send(embed_single);
			}

			result.forEach(data => console.log(data.Title+" "+data.Name+" "+data.Element+" "+data.Rarity+" "+data.Type));
			//console.log(result[0].Name+" "+result[0].Title+" "+result[0].Element+" "+result[0].Rarity+" "+result[0].Type);
		});
		
		//message.channel.send(output);

		connec.end();
	},
};