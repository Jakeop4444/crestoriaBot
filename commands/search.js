const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const sqlManager = require('../sqlManager.js');
const fs = require ('fs');
const images = require('../images.json');
const Canvas = require('canvas');
const Pagination = require('discord-paginationembed');
const emoji = require('../emoji.json');

module.exports = {
	name: 'search',
	cooldown: 5,
	description: 'Search the database for a Unit. _Stone Lookup is TBD_',
	usage: '\n\n`~search (what to search)` - Type what you\'re looking for',
	execute(message, args) {
		var _tempSql1 = "SELECT * FROM characters WHERE ";
		var _tempSql2 = "SELECT * FROM ((SELECT * FROM characters WHERE ";

		//Loop through arguments to find the query user-inputs
		if(args.length === 0 ){
			message.reply("Nothing to Search");
			return;
		}else{
			_tempSql1 += "Name LIKE '%";
			_tempSql2 += "Name LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					_tempSql1+=args[i]+" ";
					_tempSql2+=args[i]+"%' OR Name LIKE '%";
				}else{
					_tempSql1+=args[i];
					_tempSql2+=args[i];
				}
			}
			_tempSql1 += "%' UNION SELECT * FROM characters WHERE Title LIKE '%";
			_tempSql2 += "%') UNION ALL(SELECT * FROM characters WHERE Title LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					_tempSql1+=args[i]+" ";
					_tempSql2+=args[i]+"%' OR Title LIKE '%";
				}else{
					_tempSql1+=args[i];
					_tempSql2+=args[i];
				}
			}
			_tempSql1 += "%' UNION SELECT * FROM characters WHERE Element LIKE '%";
			_tempSql2 += "%') UNION ALL(SELECT * FROM characters WHERE Element LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					_tempSql1+=args[i]+" ";
					_tempSql2+=args[i]+"%' OR Element LIKE '%";
				}else{
					_tempSql1+=args[i];
					_tempSql2+=args[i];
				}
			}
			_tempSql1 += "%' UNION SELECT * FROM characters WHERE Type LIKE '%";
			_tempSql2 += "%') UNION ALL(SELECT * FROM characters WHERE Type LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					_tempSql1+=args[i]+" ";
					_tempSql2+=args[i]+"%' OR Type LIKE '%";
				}else{
					_tempSql1+=args[i];
					_tempSql2+=args[i];
				}
			}
			_tempSql1 += "%' UNION SELECT * FROM characters WHERE Rarity LIKE '%";
			_tempSql2 += "%') UNION ALL(SELECT * FROM characters WHERE Rarity LIKE '%";
			for(i = 0; i<args.length; i++){
				if(i != args.length-1){
					_tempSql1+=args[i]+" ";
					_tempSql2+=args[i]+"%' OR Rarity LIKE '%";
				}else{
					_tempSql1+=args[i];
					_tempSql2+=args[i];
				}
			}
		}
		_tempSql1+="%'";
		_tempSql2+="%'))c GROUP BY Title HAVING COUNT(*) > 1";
		
		//console.log(sql);

		_tempSql1 += " ORDER BY Name ASC";
		_tempSql2 += " ORDER BY Name ASC";

		sqlManager.doubleQuery(_tempSql1, _tempSql2, message.author.id).then(async function(result){
			if (result.length > 1){
				//Length > 1, means we found more than one unit following the user's guidelines
					/*for (var i = 0; i < result.length; i++){
						if(i < 10){
							//Only perform a maximum of 15 entries, Embeds can only hold 2048 characters
							many_names += (emoji[result[i].Rarity]+" "+emoji[result[i].Element]+" [[" + result[i].Title + "] " + result[i].Name + "](https://www.tocdb.xyz/" + result[i].Rarity.toLowerCase() + "/" + result[i].Name + ".php) \n");
						}else{
							many_names += "**And "+ (result.length - 10) + " more...**";
							break;
						}
					}*/
					
					const FieldsEmbed = new Pagination.FieldsEmbed()
						.setArray(result)
						.setAuthorizedUsers([message.author.id])
						.setChannel(message.channel)
						.setElementsPerPage(10)
						.setPage(1)
						.setPageIndicator(true)
						.formatField('Query Results', i => emoji[i.Rarity] + " [[" + i.Title + "] " + i.Name.replace(/_/g, " ") + "](https://www.tocdb.xyz/db/" + i.Rarity.toLowerCase() + "/" + i.Name + ")")
						.setDeleteOnTimeout(false);

					FieldsEmbed.embed
						.setColor(0xFF00AE)
						.setDescription('**'+result.length+' Total Entries Found**');

					FieldsEmbed.build();
				
				/*console.log("[SEARCH] DEBUG: Multi-Embed created. Sending...");
				message.channel.send({embed});
				console.log("[SEARCH] DEBUG: Embed sent!");*/

			} else if (result.length < 1){
				message.channel.send('No entries were found!');
			} else if (result.length === 1){
				//Length is == 1, print the result in pretty fashion
				//console.log(result[0].Image);
				//console.log(result[0].Title + "\n" + "Rarity: " + result[0].Rarity + "\n" + "Element: " + result[0].Element + "\n" + "Weapon Type: " + result[0].Type);
				const embed_single = new MessageEmbed()
				.setTitle("["+result[0].Title+"] "+result[0].Name.replace("_", " "))
				.setURL('https://www.tocdb.xyz/db/' + result[0].Rarity.toLowerCase() + '/' + result[0].Name) //Set the Title to link to our database site for more detailed info!
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

				arte_information = "**Hit Count:** "+result[0].n_hit+"\n**Damage:** "+result[0].n_dmg+"%\n**Targets:** "+result[0].n_targ+"";
				embed_single.addField("**Basic Attack**", arte_information);

				embed_single.setFooter("Click the Title to see more detailed information"); //Default link to our site

				//console.log("[SEARCH] DEBUG: Single-Embed created. Sending...");
				message.channel.send(embed_single);
				//console.log("[SEARCH] DEBUG: Embed sent!");
			}
			sqlManager.endConnection(message.author.id);
		});
	},
};