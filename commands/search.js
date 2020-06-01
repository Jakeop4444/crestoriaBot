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

		console.log("[SEARCH] DEBUG: Bot has connected to database.");

		var var_set = false;
		var counter = 0;

		//Loop through arguments to find the query user-inputs
		while(counter < args.length){
			if (args[counter] === 'name'){
				q_name = args[counter+1];
				var_set = true;
				console.log("[SEARCH] DEBUG: Name set.");
			} else if (args[counter] === 'element'){
				q_element = args[counter+1];
				var_set = true;
				console.log("[SEARCH] DEBUG: Element set.");
			} else if (args[counter] === 'rarity'){
				q_rarity = args[counter+1];
				var_set = true;
				console.log("[SEARCH] DEBUG: Rarity set.");
			} else if (args[counter] === 'type'){
				q_type = args[counter+1];
				var_set = true;
				console.log("[SEARCH] DEBUG: Type set.");
			}

			counter += 2;
		}

		if(var_set != true){
			message.reply("Invalid Arguments");
			return;
		}

		//Instantiate SQL Query -- This may change, but for now we will leave this version.
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

		console.log("[SEARCH] DEBUG: Query assembled.");

		var many_names = "";
		connec.query(sql, function (error, result, fields) {
			if (error) console.log(error);

			//Check for result array length
			if (result.length > 1){
				//Length > 1, means we found more than one unit following the user's guidelines
					for (var i = 0; i < result.length; i++){
						if(i < 15){
							//Only perform a maximum of 15 entries, Embeds can only hold 2048 characters
							many_names += ("[[" + result[i].Title + "] " + result[i].Name + "](https://www.tocdb.xyz/" + result[i].Rarity.toLowerCase() + "/" + result[i].Name + ".php) \n");
						}else{
							many_names += "**And "+ (result.length - 15) + " more...**";
							break;
						}
					}
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
				console.log("[SEARCH] DEBUG: Multi-Embed created. Sending...");
				message.channel.send({embed});
				console.log("[SEARCH] DEBUG: Embed sent!");

			} else if (result.length < 1){
				message.channel.send('No entries were found!');
			} else if (result.length === 1){
				//Length is == 1, print the result in pretty fashion
				//console.log(result[0].Image);
				//console.log(result[0].Title + "\n" + "Rarity: " + result[0].Rarity + "\n" + "Element: " + result[0].Element + "\n" + "Weapon Type: " + result[0].Type);
				const embed_single = new MessageEmbed()
				.setTitle(result[0].Name)
				.setURL('https://www.tocdb.xyz/' + result[0].Rarity.toLowerCase() + '/' + result[0].Name + '.php') //Set the Title to link to our database site for more detailed info!
				.setColor(0xFF0000)
				.setDescription(result[0].Title + "\n" + "Rarity: " + emoji[result[0].Rarity] + "\n" + "Element: " + emoji[result[0].Element] + "\n" + "Weapon Type: " + emoji[result[0].Type])
				.setImage(result[0].Image)
				.setFooter("https://www.tocdb.xyz/index.php"); //Default link to our site

				console.log("[SEARCH] DEBUG: Single-Embed created. Sending...");
				message.channel.send(embed_single);
				console.log("[SEARCH] DEBUG: Embed sent!");

			}
		});

		//Staying connected to the database auto-kicks the connection which shuts down the bot.
		connec.end();
		console.log("[SEARCH] DEBUG: Unhooked from database.");
	},
};