const { MessageEmbed } = require('discord.js');
const mysql = require('mysql');
const { db_host, db_user, db_password, db_name, tier_name } = require('../config.json');
const emoji = require('../emoji.json');
const Pagination = require('discord-paginationembed');

module.exports = {
	name: 'vote',
	cooldown: 2,
	description: 'does voting things',
	usage: "units - Displays a list of units you can vote for.\n"+
	"~vote pvp (unit_name) (number from 1 to 10) - votes for a unit in PvP usage\n"+
	"~vote fire (unit_name) (number from 1 to 10) - votes for a unit in Fire Raid usage\n"+
	"~vote earth (unit_name) (number from 1 to 10) - votes for a unit in Earth Raid usage\n"+
	"~vote wind (unit_name) (number from 1 to 10) - votes for a unit in Wind Raid usage\n"+
	"~vote water (unit_name) (number from 1 to 10) - votes for a unit in Water Raid usage\n"+
	"~vote light (unit_name) (number from 1 to 10) - votes for a unit in Light Raid usage\n"+
	"~vote dark (unit_name) (number from 1 to 10) - votes for a unit in Dark Raid usage",
	execute(message, args) {
		var tier_con = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password,
			database: tier_name,
			multipleStatements: true
		});
		var con = mysql.createConnection({
			host: db_host,
			user: db_user,
			password: db_password,
			database: db_name,
			multipleStatements: true
		});
		if(args.length === 0){
			message.reply("Invalid use of vote command. Use `~help vote` to see how to use the command!");
		}else if(args.length > 0){
			sql = "SELECT Title, Name, Bot, Rarity FROM characters ORDER BY Name Asc";
			if(args[0].toLowerCase() == "units"){
				con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				const FieldsEmbed = new Pagination.FieldsEmbed()
				.setArray(result)
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.setElementsPerPage(10)
				.setPage(1)
				.setPageIndicator(true)
				.formatField('Here is a list of units you can vote for. Use the input after the `=>` in the results for the vote command.', i =>"[" + i.Title + "] " + i.Name.replace("_", " ") + " => **" + i.Bot+"**")
				.setDeleteOnTimeout(false);

				FieldsEmbed.build();
			})
			}else if(args[0].toLowerCase() == "pvp"){
				con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				for(i = 0; i < result.length; i++){
					if(result[i].Bot.toLowerCase() === args[1].toLowerCase()){
						console.log("found unit");
						id = message.author.id;
						name = result[i].Name;
						rarity = result[i].Rarity;
						score = args[2];
						if(score < 1){
							score = 1;
						}else if(score > 10){
							score = 10
						}
						t_sql = "SELECT * FROM pvp WHERE id = "+id+" AND name = '"+name+"'";
						tier_con.query(t_sql, function(error, result, fields){
							if(error) console.log(error);
							if(result.length === 0){
								t_sql2 = "INSERT INTO pvp (id, name, rarity, score) VALUES ("+id+", '"+name+"', '"+rarity+"', "+score+")";
								tier_con.query(t_sql2, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your vote has been added!");
								})
								tier_con.end();
							}else{
								t_sql2 = "UPDATE pvp SET score = "+score+" WHERE id = "+id+" AND name = '"+name+"'";
								tier_con.query(t_sql2, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your vote has been updated!");
								})
								tier_con.end();
							}
						})
					}
				}
			})
			}else if(args[0].toLowerCase == "fire" ||
				args[0].toLowerCase == "earth" ||
				args[0].toLowerCase == "wind" ||
				args[0].toLowerCase == "water" ||
				args[0].toLowerCase == "light" ||
				args[0].toLowerCase == "dark"){
				con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				for(i = 0; i < result.length; i++){
					if(result[i].Bot.toLowerCase() === args[1].toLowerCase()){
						id = message.author.id;
						name = result[i].Name;
						rarity = result[i].Rarity;
						score = args[2];
						if(score < 1){
							score = 1;
						}else if(score > 10){
							score = 10
						}
						t_sql = "SELECT * FROM raid_"+args[0]+" WHERE id = "+id+" AND name = '"+name+"'";
						tier_con.query(t_sql, function(error, result, fields){
							if(error) console.log(error);
							if(result.length === 0){
								t_sql2 = "INSERT INTO raid_"+args[0]+" (id, name, rarity, score) VALUES ("+id+", '"+name+"', '"+rarity+"', "+score+")";
								tier_con.query(t_sql2, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your vote has been added!");
								})
							}else{
								t_sql2 = "UPDATE raid_"+args[0]+" SET score = "+score+" WHERE id = "+id+" AND name = '"+name+"'";
								tier_con.query(t_sql2, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your vote has been updated!");
								})
							}
						})
					}
				}
			})
			}
			con.end();
		}
	},
};