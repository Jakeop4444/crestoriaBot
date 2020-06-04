const { MessageEmbed } = require('discord.js');
const mysql = require('mysql');
const { db_host, db_user, db_password, db_name, db_table } = require('../config.json');
const emoji = require('../emoji.json');

module.exports = {
	name: 'search',
	cooldown: 5,
	description: 'Search the database for a Unit. _Stone Lookup is TBD_',
	usage: '\n\n`~search (what to search)` - Type what you\'re looking for',
	execute(message, args) {
		
		var connec = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password,
			database: db_name
		});

		console.log("[SEARCH] DEBUG: Bot has connected to database.");

		var var_set = false;
		var counter = 0;
		var sql = "SELECT * FROM characters WHERE ";

		//Loop through arguments to find the query user-inputs
		if(args.length === 0 ){
			message.reply("Nothing to Search");
			return;
		}else{
			sql += "Name LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					sql+=args[i]+" ";
				}else{
					sql+=args[i];
				}
			}
			sql += "%' UNION SELECT * FROM characters WHERE Title LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					sql+=args[i]+" ";
				}else{
					sql+=args[i];
				}
			}
			sql += "%' UNION SELECT * FROM characters WHERE Element LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					sql+=args[i]+" ";
				}else{
					sql+=args[i];
				}
			}
			sql += "%' UNION SELECT * FROM characters WHERE Type LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					sql+=args[i]+" ";
				}else{
					sql+=args[i];
				}
			}
		}
		sql+="%'";
		
		

		console.log(sql);
		/*var q_name, q_element, q_rarity, q_type;
		//Instantiate SQL Query -- This may change, but for now we will leave this version.
		if(q_name != ''){
			sql += " Name LIKE '%"+q_name+"%'";
		}
		if(q_element != '*'){
			if(q_name != ''){
				sql += " AND";
			}
			sql += " Element LIKE '%"+q_element+"%'";	
		}
		if(q_rarity != ''){
			if(q_name != '' || q_element != ''){
				sql += " AND";	
			}
			sql += " Rarity = '"+q_rarity+"'";
		}
		if(q_type != ''){
			if(q_name != '' || q_element != '' || q_rarity != ''){
				sql += " AND";
			}
			sql += " Type LIKE '%"+q_type+"%'";
		}*/

		sql += " ORDER BY Name ASC"

		console.log("[SEARCH] DEBUG: Query assembled.");

		var many_names = "";
		connec.query(sql, function (error, result, fields) {
			if (error) console.log(error);

			//Check for result array length
			if (result.length > 1){
				//Length > 1, means we found more than one unit following the user's guidelines
					for (var i = 0; i < result.length; i++){
						if(i < 10){
							//Only perform a maximum of 15 entries, Embeds can only hold 2048 characters
							many_names += (emoji[result[i].Rarity]+" "+emoji[result[i].Element]+" [[" + result[i].Title + "] " + result[i].Name + "](https://www.tocdb.xyz/" + result[i].Rarity.toLowerCase() + "/" + result[i].Name + ".php) \n");
						}else{
							many_names += "**And "+ (result.length - 10) + " more...**";
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
				.setTitle("["+result[0].Title+"] "+result[0].Name)
				.setURL('https://www.tocdb.xyz/' + result[0].Rarity.toLowerCase() + '/' + result[0].Name + '.php') //Set the Title to link to our database site for more detailed info!
				.setColor(0x0000FF)
				.setImage(result[0].Image)
				.setDescription("**Rarity:** " + emoji[result[0].Rarity] + "\t" + "**Element:** " + emoji[result[0].Element] + "\t" + "**Weapon Type:** " + emoji[result[0].Type]+"\n_All Stats are as if they are Max Level/Ascension_")
				.addField("**HP**", "```["+result[0].HP+"]```", true)
				.addField("**ATK**", "```css\n["+result[0].Attack+"]```", true)
				.addField("**DEF**", "```ini\n["+result[0].Defense+"]```", true);
				if(result[0].p_name){
					embed_single.addField("**Passive: "+result[0].p_name+"**", result[0].p1+"\n"+result[0].p2);
				}

				var arte_information = '';
				arte_information = "**Hit Count:** "+result[0].a1_hit+"\n**Damage**: "+result[0].a1_dmg+"%\n**Cooldown:** "+result[0].a1_cd+" turns";
				if(result[0].a1_ef){
					arte_information+="\n**Effect:** "+result[0].a1_ef;
				}
				embed_single.addField("**Arte 1: "+result[0].a1_name+"**", arte_information);
				arte_information = "**Hit Count:** "+result[0].a2_hit+"\n**Damage:** "+result[0].a2_dmg+"%\n**Cooldown:** "+result[0].a2_cd+" turns";
				if(result[0].a2_ef){
					arte_information+="\n**Effect:** "+result[0].a2_ef;
				}
				embed_single.addField("**Arte 2: "+result[0].a2_name+"**", arte_information);

				if(result[0].ma_name != ""){
					arte_information = "**Hit Count:** "+result[0].ma_hit+"\n**Damage:** "+result[0].ma_dmg+"%\n**Overlimit:** "+result[0].ma_ol+" OL";
					if(result[0].ma_ef){
						arte_information+="\n**Effect:** "+result[0].ma_ef;
					}
					embed_single.addField("**Mystic Arte: "+result[0].ma_name+"**", arte_information);
				}

				embed_single.setFooter("Click the Title to see more detailed information"); //Default link to our site

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