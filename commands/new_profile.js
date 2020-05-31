const { MessageEmbed } = require('discord.js');
const mysql = require('mysql');
const fs = require ('fs');
const images = require('../images.json');
const { db_host, profile_user, profile_password, profile_db, profile_table, db_user, db_password, db_name, db_table} = require('../config.json');

module.exports = {
	name: 'profile',
	cooldown: 2,
	description: 'Create a Profile Card for your Support Team. '+
	'Some images may be from datamined assets, otherwise all units are as of '+
	'current release in game',
	usage: 'To be determined',
	execute(message, args){
		var con = mysql.createConnection({
			host: db_host,
			user: profile_user,
			password: profile_password,
			database: profile_db,
			multipleStatements: true
		});
		//Base Profile Command
		if(args.length === 0){
			console.log("[DEBUG] Profile: Displaying Profile");
			var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
			con.query(sql, function (error, result, fields){
				if(error) console.log(error);
				if(result.length === 0){
					message.reply("You don't have a profile created! Create a profile with **!profile create** first!");
				}else{
					console.log('[PROFILE] DEBUG: Displaying Information');
					if(result[0].profile_image == "NONE_SET"){
						const canvas = Canvas.createCanvas(1900, 800);
						const ctx = getContext('2d');

						const sr_background = Canvas.loadImage(images["sr_background"]);
						const card_background = Canvas.loadImage(images["background"]);
						const elements = Canvas.loadImage(images["elements"]);
						const title = Canvas.loadImage(images["title"]);
						const border = Canvas.loadImage(images["borders"]);

						console.log("[DEBUG] PROFILE: Creating Custom Card");

						ctx.drawImage(sr_background, 0, 0, canvas.width, canvas.height);
						ctx.drawImage(card_background, 0, 0, canvas.width, canvas.height);
						if(result[0].flair != "NONE_SET"){
							const mystic = Canvas.loadImage(images["mystic"][result[0].flair]);
							ctx.drawImage(mystic, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].fire_unit != "NONE_SET"){
							const fire = Canvas.loadImage(images["fire_units"][result[0].fire_unit]);
							ctx.drawImage(fire, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].earth_unit != "NONE_SET"){
							const earth = Canvas.loadImage(images["earth_units"][result[0].earth_unit]);
							ctx.drawImage(earth, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].wind_unit != "NONE_SET"){
							const wind = Canvas.loadImage(images["wind_units"][result[0].wind_unit]);
							ctx.drawImage(wind, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].water_unit != "NONE_SET"){
							const water = Canvas.loadImage(images["water_units"][result[0].water_unit]);
							ctx.drawImage(water, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].light_unit != "NONE_SET"){
							const light = Canvas.loadImage(images["light_units"][result[0].light_unit]);
							ctx.drawImage(light, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].dark_unit != "NONE_SET"){
							const dark = Canvas.loadImage(images["dark_units"][result[0].dark_unit]);
							ctx.drawImage(dark, 0, 0, canvas.width, canvas.height);
						}
						ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
						ctx.drawImage(elements, 0, 0, canvas.width, canvas.height);
						ctx.drawImage(title, 0, 0, canvas.width, canvas.height);

						const embed = new MessageEmbed()
						.setTitle(result[0].profile_name)
						.setColor(0xFFFFFF)
						.setDescription("ID: "+result[0].profile_id+"\nGuild: "+result[0].profile_guild)
						.setImage(canvas.toBuffer());

						message.channel.send(embed);
					}else{
						const embed = new MessageEmbed()
						.setTitle(result[0].profile_name)
						.setColor(0xFFFFFF)
						.setDescription("ID: "+result[0].profile_id+"\nGuild: "+result[0].profile_guild)
						.setImage(result[0].profile_image.replace('CLN', ":").replace("DBLFWS", "//").replace("FWS/g", "/"));

						message.channel.send(embed);
					}
				}
			})
			con.end();
		}
		//Edit Profile Command
		else if(args.length === 2 || args.length === 3){
			if(args[0] === 'edit'){
				var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
				con.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length === 0){
						message.reply("You don't have a profile created! Create a profile first!");
						con.end();
					}else{
						if(args[1] == "fire"){
							console.log("[PROFILE] DEBUG: Editing Fire Unit");
							if(images["fire_units"][args[2]]){
								sql = 'UPDATE '+profile_table+" SET fire_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Fire Support has been updated!");
								})
								con.end();
							}
							else{
								message.reply("That fire unit does not exist. Use **!profile units fire** to see what units exist")
								con.end();
							}
						}else if(args[1] == "earth"){
							console.log("[PROFILE] DEBUG: Editing Earth Unit");
							if(images["earth_units"][args[2]]){
								sql = 'UPDATE '+profile_table+" SET earth_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Earth Support has been updated!");
								})
								con.end();
							}
							else{
								message.reply("That earth unit does not exist. Use **!profile units earth** to see what units exist")
								con.end();
							}
						}else if(args[1] == "wind"){
							console.log("[PROFILE] DEBUG: Editing Wind Unit");
							if(images["wind_units"][args[2]]){
								sql = 'UPDATE '+profile_table+" SET wind_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Wind Support has been updated!");
								})
								con.end();
							}
							else{
								message.reply("That wind unit does not exist. Use **!profile units wind** to see what units exist")
								con.end();
							}
						}else if(args[1] == "water"){
							console.log("[PROFILE] DEBUG: Editing Water Unit");
							if(images["water_units"][args[2]]){
								sql = 'UPDATE '+profile_table+" SET water_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Water has been updated!");
								})
								con.end();
							}
							else{
								message.reply("That fire unit does not exist. Use **!profile units fire** to see what units exist")
								con.end();
							}
						}else if(args[1] == "light"){
							console.log("[PROFILE] DEBUG: Editing Light Unit");
							if(images["light_units"][args[2]]){
								sql = 'UPDATE '+profile_table+" SET light_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Light Support has been updated!");
								})
								con.end();
							}
							else{
								message.reply("That light unit does not exist. Use **!profile units light** to see what units exist")
								con.end();
							}
						}else if(args[1] == "dark"){
							console.log("[PROFILE] DEBUG: Editing Dark Unit");
							if(images["dark_units"][args[2]]){
								sql = 'UPDATE '+profile_table+" SET dark_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Dark Support has been updated!");
								})
								con.end();
							}
							else{
								message.reply("That dark unit does not exist. Use **!profile units dark** to see what units exist")
								con.end();
							}
						}else if(args[1] == "character"){
							console.log("[PROFILE] DEBUG: Editing Fire Unit");
							if(images["mystic"][args[2]]){
								sql = 'UPDATE '+profile_table+" SET flair = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Flair has been updated!");
								})
								con.end();
							}
							else{
								message.reply("That flair does not exist. Use **!profile flair** to see what you can set!")
								con.end();
							}
						}else if(args[1] == "name"){
							console.log("[PROFILE] DEBUG: Editing Profile Name");
							sql = 'UPDATE '+profile_table+" SET profile_name = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Name has been updated!");
							})
							con.end();
						}else if(args[1] == "id"){
							console.log("[PROFILE] DEBUG: Editing Profile ID");
							sql = 'UPDATE '+profile_table+" SET profile_id = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile ID has been updated!");
							})
							con.end();
						}else if(args[1] == "guild"){
							console.log("[PROFILE] DEBUG: Editing Profile Guild");
							sql = 'UPDATE '+profile_table+" SET profile_guild = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Guild has been updated!");
							})
							con.end();
						}else if(args[1] == "image"){
							console.log("[PROFILE] DEBUG: Editing Profile Image");
							if(message.attachments.first()){
								var fileCheck = message.attachments.first().name.split('.');
								if(fileCheck[1] === 'png'||fileCheck[1] === 'jpeg'||fileCheck[1] === 'jpg'){
				                	console.log('[PROFILE] DEBUG: Changing Image');
				                	sql = 'UPDATE '+profile_table+" SET profile_image = '"+message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"' WHERE user_id = "+message.author.id;
				                    con.query(sql, function(error, result, fields){
										if(error) console.log(error);
										message.reply("Your Profile Image has been changed!");
										con.end();
									})
			                    }else{
			                        message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
			                        con.end();
			                    }
							}else{
								message.reply("Image not attached to message");
								con.end();
							}
						}else if(args[1] == "clrimg"){
							console.log("[PROFILE] DEBUG: Clearing Image");
							sql = 'UPDATE '+profile_table+" SET profile_image = 'NONE_SET' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Image has been cleared!");
							})
							con.end();
						}else{
							message.reply("Invalid use of command.");
						}
					}
				})
			}else if(args[1] === "units"){
				var con2 = mysql.createConnection({
					host: db_host,
					user: db_user,
					password: db_password,
					database: db_table
				});
				var sql = "SELECT Title, Name, Bot FROM characters WHERE Element = '";
				if(args[1]){
					sql += args[1]+"'";
				}
				var resultText = "";
				con2.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length >= 1){
						result.forEach(p => console.log(p.Title));
						result.forEach(data => resultText += ("["+data.Title+"] "+data.Name+" => **"+data.Bot+"**\n"));
						const embed = new MessageEmbed()
						.setTitle("Here are all the "+args[1]+" units!")
						.setColor(0x000000)
						.setDescription(resultText);

						message.channel.send(embed);
					}else{
						message.reply("No Characters found with that element");
						return;
					}					
				});
				con2.end();
			}else if(args[1] === "characters"){
				var names = '';
				images.mystic.forEach(console.log(images.mystic));
			}else{
				message.reply("Invalid use of the command");
			}
		}
		else if(args.length >= 3){
			var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
			var create = false;
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				if(result.length === 1){
					message.reply("You already have a profile! Use ***!edit*** to edit your information!");
					con.end();
					return;
				}else{
					console.log("Need to Create Profile");
					create = true;
					console.log("[PROFILE] DEBUG: Creating Profile");
					sql = "INSERT INTO "+profile_table+" (user_id, profile_name, profile_id, profile_guild, fire_unit, earth_unit, wind_unit, water_unit, light_unit, dark_unit, flair, profile_image) VALUES ("+message.author.id+", '"+args[1]+"', "+args[2];
					if(args[3]){
						sql += ", '"+args[3]+"', '";
					}else{
						sql += ", 'unknown', '";
					}
					sql += "NONE_SET, NONE_SET, NONE_SET, NONE_SET, NONE_SET, NONE_SET, NONE_SET, ";
					if(message.attachments.first()){
						var fileCheck = message.attachments.first().name.split('.');
						if(fileCheck[1] === 'png'||fileCheck[1] === 'jpeg'||fileCheck[1] === 'jpg'){
					       	console.log('[PROFILE] DEBUG: Changing Image');
					       	sql += message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"')";
			            }else{
			                message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
			                con.end();
			                return;
			            }
					}else{
						sql += "NONE_SET')";
					}
					console.log("[PROFILE] DEBUG: "+sql);
					con.query(sql, function(error, result, fields){
						if (error){
							console.log(error);
							message.reply("Error creating profile");
							return;
						}
						message.reply("Profile Create Successfully, check it out with ***!profile***");
					})
					con.end();
				}
			})
		}else{
			message.reply("Invalid Usage");
		}
		}
		//Create Profile Command
	},
};
