const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const mysql = require('mysql');
const fs = require ('fs');
const images = require('../images.json');
const Canvas = require('canvas');
const { db_host, profile_user, profile_password, profile_db, profile_table, db_user, db_password, db_name, db_table} = require('../config.json');

module.exports = {
	name: 'profile',
	cooldown: 2,
	description: 'Create a Profile Card for your Support Team. '+
	'Some images may be from datamined assets, otherwise all units are as of '+
	'current release in game',
	usage: '**!profile** - Displays your profile information if you have one created\n'+
			'**!profile (edit|**',
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
			
			createProfileCard(con, message.author.id).then(async function(result){

				if(result.length === 0){
					message.reply("You don't have a profile created! Create a profile using **!profile create** first!");
				}else{
					//console.log("Hey Look, it worked?: "+result[0].user_id);
					// If an image is provided by a user in the database, send that player's profile image with their User Data
					if(result[0].profile_image != "NONE_SET"){
						console.log("Here");
						const _embed = new MessageEmbed()
						.setTitle(result[0].profile_name)
						.setColor(0xFFFFFF)
						.setDescription("ID: "+result[0].profile_id+"\nGuild: "+result[0].profile_guild)
						.setImage(result[0].profile_image.replace("CLN", ":").replace("DBLFWS", "//"));
						message.channel.send(_embed);

					}//If an image isn't provided, create a dynamic profile image for display.
					else{
						//Create the canvas and set the context to 2D image
						console.log("[PROFILE] DEBUG: Creating Canvas");
						const canvas = Canvas.createCanvas(1900, 800);
						const ctx = canvas.getContext('2d');

						//Asynchronous check if the image exists within the bot.
						//Will hang/error if the image does not exist in the context.
						const sr_background = await Canvas.loadImage(images["sr_background"]);
						const card_background = await Canvas.loadImage(images["background"]);

						console.log("[PROFILE] DEBUG: Setting Unit Images");

						ctx.drawImage(sr_background, 0, 0, canvas.width, canvas.height);
						ctx.drawImage(card_background, 0, 0, canvas.width, canvas.height);

						//If none of these images are set, do not draw image, otherwise draw
						if(result[0].flair != "NONE_SET"){
							const mystic = await Canvas.loadImage(images.mystic[result[0].flair]);
							ctx.drawImage(mystic, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].fire_unit != "NONE_SET"){
							const fire = await Canvas.loadImage(images.fire_units[result[0].fire_unit]);
							ctx.drawImage(fire, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].earth_unit != "NONE_SET"){
							const earth = await Canvas.loadImage(images.earth_units[result[0].earth_unit]);
							ctx.drawImage(earth, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].wind_unit != "NONE_SET"){
							const wind = await Canvas.loadImage(images.wind_units[result[0].wind_unit]);
							ctx.drawImage(wind, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].water_unit != "NONE_SET"){
							const water = await Canvas.loadImage(images.water_units[result[0].water_unit]);
							ctx.drawImage(water, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].light_unit != "NONE_SET"){
							const light = await Canvas.loadImage(images.light_units[result[0].light_unit]);
							ctx.drawImage(light, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].dark_unit != "NONE_SET"){
							const dark = await Canvas.loadImage(images.dark_units[result[0].dark_unit]);
							ctx.drawImage(dark, 0, 0, canvas.width, canvas.height);
						}

						//Load the rest of the elements to the canvas
						console.log("[PROFILE] DEBUG: Units Set");
						const elements = await Canvas.loadImage(images["elements"]);
						ctx.drawImage(elements, 0, 0, canvas.width, canvas.height);
						
						const title = await Canvas.loadImage(images["title"]);
						ctx.drawImage(title, 0, 0, canvas.width, canvas.height);
					
						const border = await Canvas.loadImage(images["borders"]);
						ctx.drawImage(border, 0, 0, canvas.width, canvas.height);

						//Send Message
						const _embed = new MessageEmbed()
						.setTitle(result[0].profile_name)
						.setColor(0xFFFFFF)
						.setDescription("ID: "+result[0].profile_id+"\nGuild: "+result[0].profile_guild)
						.setImage("attachment://profile_image.png");
						console.log("[PROFILE] DEBUG: Sending Message");
						message.channel.send({embed: _embed, files: [new Discord.MessageAttachment(canvas.toBuffer(), 'profile_image.png')]});
						console.log("[PROFILE] DEBUG: Sending Message");
					}
				}
			})
			con.end();
			console.log("[PROFILE] DEBUG: Unhooked from database");
		}
		//Display Characters you can set as flair for your profile
		else if(args.length === 1){
			if(args[0] === "characters"){
				var names = '';
				//images.forEach(data => console.log(data.mystic));
			}
		}
		//Edit Profile Command
		else if(args.length >= 2){
			if(args[0] === 'edit'){
				var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
				con.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length === 0){
						message.reply("You don't have a profile created! Create a profile first!");
						con.end();
						console.log("[PROFILE] DEBUG: Unhooked from database");
					}else{
						//Edits the fire unit
						if(args[1] == "fire"){
							console.log("[PROFILE] DEBUG: Editing Fire Unit");
							if(images.fire_units[args[2]]){
								sql = 'UPDATE '+profile_table+" SET fire_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Fire Support has been updated!");
								})
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							else{
								message.reply("That fire unit does not exist. Use **!profile units fire** to see what units exist")
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
						}
						//Edits the earth unit
						else if(args[1] == "earth"){
							console.log("[PROFILE] DEBUG: Editing Earth Unit");
							if(images.earth_units[args[2]]){
								sql = 'UPDATE '+profile_table+" SET earth_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Earth Support has been updated!");
								})
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							else{
								message.reply("That earth unit does not exist. Use **!profile units earth** to see what units exist")
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
						}
						//Edits the wind unit
						else if(args[1] == "wind"){
							console.log("[PROFILE] DEBUG: Editing Wind Unit");
							if(images.wind_units[args[2]]){
								sql = 'UPDATE '+profile_table+" SET wind_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Wind Support has been updated!");
								})
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							else{
								message.reply("That wind unit does not exist. Use **!profile units wind** to see what units exist")
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
						}
						//Edits the water unit
						else if(args[1] == "water"){
							console.log("[PROFILE] DEBUG: Editing Water Unit");
							if(images.water_units[args[2]]){
								sql = 'UPDATE '+profile_table+" SET water_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Water has been updated!");
								})
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							else{
								message.reply("That water unit does not exist. Use **!profile units water** to see what units exist")
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
						}
						//Edits the light unit
						else if(args[1] == "light"){
							console.log("[PROFILE] DEBUG: Editing Light Unit");
							if(images.light_units[args[2]]){
								sql = 'UPDATE '+profile_table+" SET light_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Light Support has been updated!");
								})
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							else{
								message.reply("That light unit does not exist. Use **!profile units light** to see what units exist")
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
						}
						//Edits the dark unit
						else if(args[1] == "dark"){
							console.log("[PROFILE] DEBUG: Editing Dark Unit");
							if(images.dark_units[args[2]]){
								sql = 'UPDATE '+profile_table+" SET dark_unit = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Dark Support has been updated!");
								})
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							else{
								message.reply("That dark unit does not exist. Use **!profile units dark** to see what units exist")
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
						}
						//Edits the character flair
						else if(args[1] == "character"){
							console.log("[PROFILE] DEBUG: Editing Flair");
							if(images.mystic[args[2]]){
								sql = 'UPDATE '+profile_table+" SET flair = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Flair has been updated!");
								})
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							else{
								message.reply("That flair does not exist. Use **!profile characters** to see what you can set!")
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile name
						else if(args[1] == "name"){
							console.log("[PROFILE] DEBUG: Editing Profile Name");
							sql = 'UPDATE '+profile_table+" SET profile_name = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Name has been updated!");
							})
							con.end();
							console.log("[PROFILE] DEBUG: Unhooked from database");
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile id
						else if(args[1] == "id"){
							console.log("[PROFILE] DEBUG: Editing Profile ID");
							sql = 'UPDATE '+profile_table+" SET profile_id = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile ID has been updated!");
							})
							con.end();
							console.log("[PROFILE] DEBUG: Unhooked from database");
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile guild
						else if(args[1] == "guild"){
							console.log("[PROFILE] DEBUG: Editing Profile Guild");
							sql = 'UPDATE '+profile_table+" SET profile_guild = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Guild has been updated!");
							})
							con.end();
							console.log("[PROFILE] DEBUG: Unhooked from database");
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile image to a user submitted image
						//Needs to have an supported image type attached to the message otherwise will error
						else if(args[1] == "image"){
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
										console.log("[PROFILE] DEBUG: Unhooked from database");
									})
			                    }else{
			                        message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
			                        con.end();
									console.log("[PROFILE] DEBUG: Unhooked from database");
			                    }
			                    console.log("[PROFILE] DEBUG: Done Changing Profile Image to User Input");
							}else{
								message.reply("Image not attached to message");
								con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
							}
						}
						//Clears the user submitted image and returns to using a dynamic genreated image for the player
						else if(args[1] == "clrimg"){
							console.log("[PROFILE] DEBUG: Clearing Image");
							sql = 'UPDATE '+profile_table+" SET profile_image = 'NONE_SET' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Image has been cleared!");
							})
							con.end();
							console.log("[PROFILE] DEBUG: Unhooked from database");
							console.log("[PROFILE] DEBUG: Done Clearing User Input Image");
						}else{
							message.reply("Invalid use of command.");
						}
					}
				})
			}
			//Displays all the units the bot has access to.
			else if(args[0] === "units"){
				var con2 = mysql.createConnection({
					host: db_host,
					user: db_user,
					password: db_password,
					database: db_name
				});
				var sql = "SELECT Title, Name, Bot FROM characters WHERE Element = '";
				if(args[1]){
					sql += args[1]+"'";
				}
				var resultText = "";
				con2.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length >= 1){
						//result.forEach(p => console.log(p.Title));
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
				console.log("[PROFILE] DEBUG: Done Displaying Character Info For Profile");
			}
			//Creates a profile should the user not have one.
			//Will return an error message if the user already has a profile.
			else if(args[0] === "create"){
				var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
				var create = false;
				con.query(sql, function(error, result, fields){
					if(error) console.log(error);
					//Denies the creation of multiple profiles
					if(result.length === 1){
						message.reply("You already have a profile! Use ***!edit*** to edit your information!");
						con.end();
						console.log("[PROFILE] DEBUG: Unhooked from database");
						return;
					}
					//Creates a profile if one doesn't exist
					else{
						create = true;
						console.log("[PROFILE] DEBUG: Creating Profile");
						sql = "INSERT INTO "+profile_table+" (user_id, profile_name, profile_id, profile_guild, fire_unit, earth_unit, wind_unit, water_unit, "+
								"light_unit, dark_unit, flair, profile_image) VALUES ("+message.author.id+", '"+args[1]+"', "+args[2];
						if(args[3]){
							sql += ", '"+args[3]+"', '";
						}else{
							sql += ", 'unknown', '";
						}
						sql += "NONE_SET', 'NONE_SET', 'NONE_SET', 'NONE_SET', 'NONE_SET', 'NONE_SET', 'NONE_SET', '";
						//Makes sure there is an image attached to the message, otherwise will just set the value to NONE_SET
						if(message.attachments.first()){
							var fileCheck = message.attachments.first().name.split('.');
							if(fileCheck[1] === 'png'||fileCheck[1] === 'jpeg'||fileCheck[1] === 'jpg'){
						       	console.log('[PROFILE] DEBUG: Changing Image');
						       	sql += message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"')";
				            }else{
				                message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
				                con.end();
								console.log("[PROFILE] DEBUG: Unhooked from database");
				                return;
				            }
						}else{
							sql += "NONE_SET')";
						}
						//console.log("[PROFILE] DEBUG: "+sql);
						con.query(sql, function(error, result, fields){
							if (error){
								console.log(error);
								message.reply("Error creating profile");
								return;
							}
							message.reply("Profile Create Successfully, check it out with ***!profile***");
						})
						con.end();
						console.log("[PROFILE] DEBUG: Unhooked from database");
					}
				})
				console.log("[PROFILE] DEBUG: Done Creating Profile");
			}
			else{
				message.reply("Invalid use of the command");
			}
		}else{
			message.reply("Invalid Usage");
		}
		//Create Profile Command
	},
};

function createProfileCard(connection, authorID){
	return new Promise(function(resolve, reject){
		var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+authorID;
		connection.query(sql, function(error, result, fields){
			if(error){
				return reject(error);
			}
			resolve(result);
		});
	});
}
