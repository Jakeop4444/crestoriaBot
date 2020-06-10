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
	usage: '- Displays your profile information if you have one created\n\n***___EDIT COMMANDS___***\n'+
			'_Note: Some edit commands will not display if you provided a custom image_\n'+
			'_You also don\'t need to use brackets when entering commands, those are just to show what you enter as the command user.\n'+
			'`~profile edit (element) (character)` - Edits your support unit \n'+
			'`~profile edit character (character)` - Edits the character to display on the side of your profile\n'+
			'`~profile edit name (Username)` - Edits the username on your profile\n'+
			'`~profile edit id (ID Number)` - Edits the ID number listed on your profile\n'+
			'`~profile edit guild (Guild Name)` - Edits the Guild Name listed on your profile\n'+
			'`~profile edit image` - Attach your own custom image to the profile. Image must be attached to the message that sends this command\n'+
			'`~profile edit clrimg` - Clears your own custom image to use the self-generated one. **Does not clear anything set for the self-generated image**\n\n'+
			'***___LOOKUP COMMANDS___***\n'+
			'`~profile units (element)` - Displays a list of all the units that you can set for your card\n'+
			'the name after the "=>" in the results is the name you use in the `~profile edit unit (element) (character)` command\n'+
			'`~profile characters` - Displays a list of all the characters that you can set on the side of your card\n\n'+
			'***___CREATE COMMAND___***\n'+
			'`~profile create (Username) (ID Number) (Guild Name)` - Creates a profile with the bot. Entering the ID and Guild Name is optional.\n'+
			'You can also attach an image to this command and set your own custom image.',
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
			
			//console.log("[PROFILE] DEBUG: Displaying Profile");
			
			createProfileCard(con, message.author.id).then(async function(result){

				if(result.length === 0){
					message.reply("You don't have a profile created! Create a profile first using `~profile create (Username)`");
				}else{
					//console.log("Hey Look, it worked?: "+result[0].user_id);
					// If an image is provided by a user in the database, send that player's profile image with their User Data
					if(result[0].profile_image != "NONE_SET"){

						var details = '';
						if(result[0].profile_id != 'unknown'){
							details += "ID: "+result[0].profile_id+"\n";
						}
						if(result[0].profile_guild != 'unknown'){
							details += "Guild: "+result[0].profile_guild;
						}
						//console.log("Here");
						const _embed = new MessageEmbed()
						.setTitle(result[0].profile_name)
						.setColor(0xFFFFFF)
						.setDescription(details)
						.setImage(result[0].profile_image.replace("CLN", ":").replace("DBLFWS", "//"));
						message.channel.send(_embed);

					}//If an image isn't provided, create a dynamic profile image for display.
					else{
						//Create the canvas and set the context to 2D image
						//console.log("[PROFILE] DEBUG: Creating Canvas");
						const canvas = Canvas.createCanvas(1900, 800);
						const ctx = canvas.getContext('2d');

						//Asynchronous check if the image exists within the bot.
						//Will hang/error if the image does not exist in the context.
						const sr_background = await Canvas.loadImage(images["sr_background"]);
						const card_background = await Canvas.loadImage(images["background"]);

						//console.log("[PROFILE] DEBUG: Setting Unit Images");

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
						//console.log("[PROFILE] DEBUG: Units Set");
						const elements = await Canvas.loadImage(images["elements"]);
						ctx.drawImage(elements, 0, 0, canvas.width, canvas.height);
						
						const title = await Canvas.loadImage(images["title"]);
						ctx.drawImage(title, 0, 0, canvas.width, canvas.height);
					
						const border = await Canvas.loadImage(images["borders"]);
						ctx.drawImage(border, 0, 0, canvas.width, canvas.height);

						//Send Message
						var details = '';
						if(result[0].profile_id != 'unknown'){
							details += "ID: "+result[0].profile_id+"\n";
						}
						if(result[0].profile_guild != 'unknown'){
							details += "Guild: "+result[0].profile_guild;
						}
						const _embed = new MessageEmbed()
						.setTitle(result[0].profile_name)
						.setColor(0xFFFFFF)
						.setDescription(details)
						.setImage("attachment://profile_image.png");
						//console.log("[PROFILE] DEBUG: Sending Message");
						message.channel.send({embed: _embed, files: [new Discord.MessageAttachment(canvas.toBuffer(), 'profile_image.png')]});
						//console.log("[PROFILE] DEBUG: Message Sent");
					}
				}
			})
			con.end();
			console.log("[PROFILE] DEBUG: Unhooked from database");
		}
		//Display Characters you can set as flair for your profile
		else if(args.length === 1){
			if(args[0].toLowerCase() === "characters"){
				var names = '';
				Object.keys(images.mystic).forEach(function(k){
					names += k.charAt(0).toUpperCase()+k.slice(1)+", ";
				});
				const embed = new MessageEmbed()
				.setColor(0x000000)
				.setTitle("Here are all the available characters for your Character Option!")
				.setDescription("Use `~profile edit character (name)` to add the character to your profile image!\n_Only usable if we make the image for you_\n\n"+names.substring(0, names.length-2));

				message.channel.send(embed);

				//images.forEach(data => console.log(data.mystic));
			}else if(args[0] === "create"){
				message.reply("Invalid use of `~profile create` command.");
			}else if(args[0] === "edit"){
				message.reply("Invalid use of `~profile edit` command.");
			}else if(args[0] === "units"){
				message.reply("Invalid use of `~profile units` command.");
			}else{
				message.reply("Invalid use of command. Use `~help profile` to see how to use the command!");
			}
			con.end();
		}
		//Edit Profile Command
		else if(args.length >= 2){
			if(args[0].toLowerCase() === 'edit'){
				var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
				con.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length === 0){
						message.reply("You don't have a profile created! Create a profile first using `~profile create (Username)`**");
					}else{
						//Edits any unit
						if(args[1].toLowerCase() === 'fire' || args[1].toLowerCase() === 'earth' || 
							args[1].toLowerCase() === 'wind' || args[1].toLowerCase() === 'water' || 
							args[1].toLowerCase() === 'light' || args[1].toLowerCase() === 'dark'){
							var leftString = args[1].toLowerCase()+"_units";
							var rightString = args[2].toLowerCase();
							if(images[leftString][rightString]){
								//console.log("[PROFILE] DEBUG: Editing "+args[1].toLowerCase().charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()+" Unit");
								sql = 'UPDATE '+profile_table+" SET "+args[1].toLowerCase()+"_unit = '"+args[2].toLowerCase()+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your "+args[1].toLowerCase().charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()+" Support has been updated!");
								})
							}else{
								message.reply("That "+args[1].toLowerCase()+" unit does not exist. Use `~profile units "+args[1].toLowerCase()+"` to see what units exist");
							}
						}
						//Edits the character flair
						else if(args[1].toLowerCase() === "character"){
							//console.log("[PROFILE] DEBUG: Editing Flair");
							if(images.mystic[args[2].toLowerCase()]){
								sql = 'UPDATE '+profile_table+" SET flair = '"+args[2].toLowerCase()+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Character has been updated!");
								})
							}
							else{
								message.reply("That character does not exist. Use `~profile characters` to see what you can set!");
							}
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile name
						else if(args[1].toLowerCase() === "name"){
							//console.log("[PROFILE] DEBUG: Editing Profile Name");
							sql = 'UPDATE '+profile_table+" SET profile_name = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Name has been updated!");
							})
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile id
						else if(args[1].toLowerCase() === "id"){
							//console.log("[PROFILE] DEBUG: Editing Profile ID");
							sql = 'UPDATE '+profile_table+" SET profile_id = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile ID has been updated!");
							})
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile guild
						else if(args[1].toLowerCase() === "guild"){
							//console.log("[PROFILE] DEBUG: Editing Profile Guild");
							var guildname = '';
							for(i = 2; i < args.length; i++){
								guildname += args[i]+" ";
							}
							sql = 'UPDATE '+profile_table+" SET profile_guild = '"+guildname.substring(0, guildname.length-1)+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Guild has been updated!");
							})
							//console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile image to a user submitted image
						//Needs to have an supported image type attached to the message otherwise will error
						else if(args[1].toLowerCase() === "image"){
							//console.log("[PROFILE] DEBUG: Editing Profile Image");
							if(message.attachments.first()){
								var fileCheck = message.attachments.first().name.split('.');
								if(fileCheck[1] === 'png'||fileCheck[1] === 'jpeg'||fileCheck[1] === 'jpg'){
				                	//console.log('[PROFILE] DEBUG: Changing Image');
				                	sql = 'UPDATE '+profile_table+" SET profile_image = '"+message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"' WHERE user_id = "+message.author.id;
				                    con.query(sql, function(error, result, fields){
										if(error) console.log(error);
										message.reply("Your Profile Image has been changed!");
									})
			                    }else{
			                        message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
			                    }
			                    //console.log("[PROFILE] DEBUG: Done Changing Profile Image to User Input");
							}else{
								message.reply("Image not attached to message");
							}
						}
						//Clears the user submitted image and returns to using a dynamic genreated image for the player
						else if(args[1].toLowerCase() === "clrimg"){
							//console.log("[PROFILE] DEBUG: Clearing Image");
							sql = 'UPDATE '+profile_table+" SET profile_image = 'NONE_SET' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Image has been cleared!");
							})
							//console.log("[PROFILE] DEBUG: Done Clearing User Input Image");
						}else{
							message.reply("Invalid use of command. Use `~help profile` to see how to use the command!");
						}
					}
					con.end();
					//console.log("[PROFILE] DEBUG: Unhooked from database");
				})
			}
			//Displays all the units the bot has access to.
			else if(args[0].toLowerCase() === "units"){
				con.end();
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
						.setTitle("Here are all the "+args[1]+" units!\nTo set a character to your profile, use the name after the '=>' in the results!")
						.setColor(0x000000)
						.setDescription(resultText);

						message.channel.send(embed);
					}else{
						message.reply("No Characters found with that element");
						return;
					}					
				});
				con2.end();
				//console.log("[PROFILE] DEBUG: Done Displaying Character Info For Profile");
			}
			//Creates a profile should the user not have one.
			//Will return an error message if the user already has a profile.
			else if(args[0].toLowerCase() === "create"){
				var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
				var create = false;
				con.query(sql, function(error, result, fields){
					if(error) console.log(error);
					//Denies the creation of multiple profiles
					if(result.length === 1){
						message.reply("You already have a profile! Use the `~edit` commands to edit your information!");
						con.end();
						//console.log("[PROFILE] DEBUG: Unhooked from database");
						return;
					}
					//Creates a profile if one doesn't exist
					else{
						create = true;
						//console.log("[PROFILE] DEBUG: Creating Profile");
						sql = "INSERT INTO "+profile_table+" (user_id, profile_name, profile_id, profile_guild, fire_unit, earth_unit, wind_unit, water_unit, "+
								"light_unit, dark_unit, flair, profile_image) VALUES ("+message.author.id+", '"+args[1]+"', ";
						if(args[2]){
							sql += args[2];
						}else{
							sql += "'unknown'";
						}
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
						       //	console.log('[PROFILE] DEBUG: Changing Image');
						       	sql += message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"')";
				            }else{
				                message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
				                con.end();
								//console.log("[PROFILE] DEBUG: Unhooked from database");
				                return;
				            }
						}else{
							sql += "NONE_SET')";
						}
						//Replaces special characters so SQL doesn't break
						sql.replace("/[/g", "").replace("/]/g", "");
						con.query(sql, function(error, result, fields){
							if (error){
								console.log(error);
								message.reply("Error creating profile");
								return;
							}
							message.reply("Profile Create Successfully, check it out with **~profile**");
						})
						con.end();
						//console.log("[PROFILE] DEBUG: Unhooked from database");
					}
				})
				//console.log("[PROFILE] DEBUG: Done Creating Profile");
			}
			else{
				message.reply("Invalid use of command. Use `~help profile` to see how to use the command!");
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
