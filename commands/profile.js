const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const mysql = require('mysql');
const fs = require ('fs');
const images = require('../images.json');
const Canvas = require('canvas');
const { db_host, profile_user, profile_password, profile_db, profile_table, db_user, db_password, db_name, db_table} = require('../config.json');
const Pagination = require('discord-paginationembed');

module.exports = {
	name: 'profile',
	cooldown: 2,
	description: 'Create a Profile Card for your Support Team. '+
	'All units are as of current release in game',
	usage: '- Displays your profile information if you have one created\n\n***___EDIT COMMANDS___***\n'+
			'_Note: Some edit commands will not display if you provided a custom image_\n'+
			'_You also don\'t need to use brackets when entering commands, those are just to show what you enter as the command user.\n'+
			'`~profile edit (element) (character)` - Edits your support unit \n'+
			'`~profile edit fire_asc (number from 0 to 5)` - Edits the ascension level displayed on your fire unit\n'+
			'`~profile edit earth_asc (number from 0 to 5)` - Edits the ascension level displayed on your earth unit\n'+
			'`~profile edit wind_asc (number from 0 to 5)` - Edits the ascension level displayed on your wind unit\n'+
			'`~profile edit water_asc (number from 0 to 5)` - Edits the ascension level displayed on your water unit\n'+
			'`~profile edit light_asc (number from 0 to 5)` - Edits the ascension level displayed on your light unit\n'+
			'`~profile edit dark_asc (number from 0 to 5)` - Edits the ascension level displayed on your dark unit\n'+
			'`~profile edit character (character)` - Edits the character to display on the side of your profile\n'+
			'`~profile edit name (Username)` - Edits the username on your profile\n'+
			'`~profile edit id (ID Number)` - Edits the ID number listed on your profile\n'+
			'`~profile edit guild (Guild Name)` - Edits the Guild Name listed on your profile\n'+
			'`~profile edit image` - Attach your own custom image to the profile. Image must be attached to the message that sends this command\n'+
			'`~profile edit flair` - Attach your own custom image to the profile. Image must be attached to the message that sends this command\n'+
			'`~profile edit bg` - Attach your own custom image to the profile. Image must be attached to the message that sends this command\n'+
			'`~profile edit clrimg` - Clears your own custom image to use the self-generated one. **Does not clear anything set for the self-generated image**\n'+
			'`~profile clear (element)` - Clears a unit from your profile. Not setting an element will wipe all the units you have set.\n\n'+
			'***___LOOKUP COMMANDS___***\n'+
			'`~profile units (element)` - Displays a list of all the units that you can set for your card\n'+
			'the name after the "=>" in the results is the name you use in the `~profile edit unit (element) (character)` command\n'+
			'`~profile characters` - Displays a list of all the characters that you can set on the side of your card\n'+
			'`~profile flair` - Displays a list of all the characters that you can set on the side of your card\n'+
			'`~profile backgrounds` - Displays a list of all the characters that you can set on the side of your card\n\n'+
			'***___CREATE COMMAND___***\n'+
			'`~profile create (Username) (ID Number) (Guild Name)` - Creates a profile with the bot. Entering the ID and Guild Name is optional.\n'+
			'You can also attach an image to this command and set your own custom image.',
	execute(message, args) {
		var con = mysql.createConnection({
			host: db_host,
			user: profile_user,
			password: profile_password,
			database: profile_db,
			multipleStatements: true
		});

		//Display the profile
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
							details += "ID: ";
							if(result[0].profile_id.length < 9){
								details+= "0"+result[0].profile_id+"\n";
							}else{
								details+= result[0].profile_id+"\n";
							}
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
					}
					//If an image isn't provided, create a dynamic profile image for display.
					else{
						//Create the canvas and set the context to 2D image
						//console.log("[PROFILE] DEBUG: Creating Canvas");
						// Image loads as follows:
						// Background
						// Mystic
						// Flair
						// SR Background
						// Units
						// Elements
						// Name Bar
						// Ascension BG
						// Unit Ascension
						// Borders
						const canvas = Canvas.createCanvas(1624, 916);
						const ctx = canvas.getContext('2d');

						//Asynchronous check if the image exists within the bot.
						//Will hang/error if the image does not exist in the context.
						const background = await Canvas.loadImage(images.background[result[0].background]);
						ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
						//If none of these images are set, do not draw image, otherwise draw
						if(result[0].flair != "NONE_SET"){
							const mystic = await Canvas.loadImage(images.mystic[result[0].flair]);
							ctx.drawImage(mystic, 0, 0, canvas.width, canvas.height);
						}
						const flair = await Canvas.loadImage(images.flair[result[0].pvp_rank]);
						ctx.drawImage(flair, 0, 0, canvas.width, canvas.height);
						const sr_background = await Canvas.loadImage(images["sr_background"]);
						ctx.drawImage(sr_background, 0, 0, canvas.width, canvas.height);
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
						const elements = await Canvas.loadImage(images["elements"]);
						ctx.drawImage(elements, 0, 0, canvas.width, canvas.height);
						const name_bar = await Canvas.loadImage(images["name_bar"]);
						ctx.drawImage(name_bar, 0, 0, canvas.width, canvas.height);

						//TEXT
						string = result[0].profile_name.substring(0, 12) + " - " + result[0].profile_id + " - " + result[0].profile_guild.substring(0, 12)
						ctx.font = "30px Sylfaen";
						ctx.fillStyle = "#ffffff";
						ctx.fillText(string, 30, 815)
						
						const ascension_bg = await Canvas.loadImage(images["ascension_bg"]);
						ctx.drawImage(ascension_bg, 0, 0, canvas.width, canvas.height);
						if(result[0].fire_asc > 0){
							const fire_asc = await Canvas.loadImage(images.fire_asc[""+result[0].fire_asc.toString()]);
							ctx.drawImage(fire_asc, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].earth_asc > 0){
							const earth_asc = await Canvas.loadImage(images.earth_asc[""+result[0].earth_asc.toString()]);
							ctx.drawImage(earth_asc, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].wind_asc > 0){
							const wind_asc = await Canvas.loadImage(images.wind_asc[""+result[0].wind_asc.toString()]);
							ctx.drawImage(wind_asc, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].water_asc > 0){
							const water_asc = await Canvas.loadImage(images.water_asc[""+result[0].water_asc.toString()]);
							ctx.drawImage(water_asc, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].light_asc > 0){
							const light_asc = await Canvas.loadImage(images.light_asc[""+result[0].light_asc.toString()]);
							ctx.drawImage(light_asc, 0, 0, canvas.width, canvas.height);
						}
						if(result[0].dark_asc > 0){
							const dark_asc = await Canvas.loadImage(images.dark_asc[""+result[0].dark_asc.toString()]);
							ctx.drawImage(dark_asc, 0, 0, canvas.width, canvas.height);
						}
						//Load the rest of the elements to the canvas
						//console.log("[PROFILE] DEBUG: Units Set");
						// Image loads as follows:
						// Background
						// Mystic (flair)
						// Flair (pvp_rank)
						// SR Background
						// Units
						// Elements
						// Name Bar
						// Ascension BG
						// Unit Ascension
						// Borders
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
			});
			con.end();
		}
		//Alters information about the profile
		else if(args.length >= 1){
			//Edit the profile
			if(args[0].toLowerCase() == 'edit'){
				var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
				con.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length === 0){
						message.reply("You don't have a profile created! Create a profile first using `~profile create (Username)`**");
					}else{
						//Edits any unit
						if((args[1].toLowerCase() === 'fire' || args[1].toLowerCase() === 'earth' || 
							args[1].toLowerCase() === 'wind' || args[1].toLowerCase() === 'water' || 
							args[1].toLowerCase() === 'light' || args[1].toLowerCase() === 'dark') && args.length >= 3){
							var leftString = args[1].toLowerCase()+"_units";
							var rightString = args[2].toLowerCase();
							if(images[leftString][rightString]){
								//console.log("[PROFILE] DEBUG: Editing "+args[1].toLowerCase().charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()+" Unit");
								sql = 'UPDATE '+profile_table+" SET "+args[1].toLowerCase()+"_unit = '"+args[2].toLowerCase()+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your "+args[1].toLowerCase().charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()+" Support has been updated!");
								});
							}else{
								message.reply("That "+args[1].toLowerCase()+" unit does not exist. Use `~profile units "+args[1].toLowerCase()+"` to see what units exist");
							}
						}
						//Edits the ascension level on units. Uncomment once game releases
						else if((args[1].toLowerCase() === 'fire_asc' || args[1].toLowerCase() === 'earth_asc' || 
								args[1].toLowerCase() === 'wind_asc' || args[1].toLowerCase() === 'water_asc' || 
								args[1].toLowerCase() === 'light_asc' || args[1].toLowerCase() === 'dark_asc') && args.length >= 3){
							if(args[2] < 0 || args[2] > 5){
								message.reply("Please use a number from 0 to 5")
							}else{
								sql = "UPDATE "+profile_table+" SET "+args[1].toLowerCase()+" = "+args[2]+" WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your ascension information has been updated");
								});
							}
						}
						//Edits the character flair
						else if(args[1].toLowerCase() === "character" && args.length >= 3){
							//console.log("[PROFILE] DEBUG: Editing Flair");
							if(images.mystic[args[2].toLowerCase()]){
								sql = 'UPDATE '+profile_table+" SET flair = '"+args[2].toLowerCase()+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Character has been updated!");
								});
							}
							else{
								message.reply("That character does not exist. Use `~profile characters` to see what you can set!");
							}
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the background
						else if(args[1].toLowerCase() === "bg" && args.length >= 3){
							//console.log("[PROFILE] DEBUG: Editing Flair");
							if(images.background[args[2].toLowerCase()]){
								sql = 'UPDATE '+profile_table+" SET background = '"+args[2].toLowerCase()+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Background has been updated!");
								});
							}
							else{
								message.reply("That background does not exist. Use `~profile backgrounds` to see what you can set!");
							}
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile flair
						else if(args[1].toLowerCase() === "flair" && args.length >= 3){
							//console.log("[PROFILE] DEBUG: Editing Flair");
							if(images.flair[args[2].toLowerCase()]){
								sql = 'UPDATE '+profile_table+" SET pvp_rank = '"+args[2].toLowerCase()+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Flair has been updated!");
								});
							}
							else{
								message.reply("That character does not exist. Use `~profile characters` to see what you can set!");
							}
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile name
						else if(args[1].toLowerCase() === "name" && args.length >= 3){
							//console.log("[PROFILE] DEBUG: Editing Profile Name");
							name = args[2];
							if(args[2].length > 12){
								name = name.substring(0, 12);
							}
							sql = 'UPDATE '+profile_table+" SET profile_name = '"+name+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Name has been updated!");
							});
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile id
						else if(args[1].toLowerCase() === "id" && args.length >= 3){
							//console.log("[PROFILE] DEBUG: Editing Profile ID");
							sql = 'UPDATE '+profile_table+" SET profile_id = '"+args[2]+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile ID has been updated!");
							});
							console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile guild
						else if(args[1].toLowerCase() === "guild" && args.length >= 3){
							//console.log("[PROFILE] DEBUG: Editing Profile Guild");
							var guildname = '';
							for(i = 2; i < args.length; i++){
								guildname += args[i]+" ";
							}
							if(guildname.length > 12){
								guildname = guildname.substring(0, 12);
							}
							sql = 'UPDATE '+profile_table+" SET profile_guild = '"+guildname+"' WHERE user_id = "+message.author.id;
							con.query(sql, function(error, result, fields){
								if(error) console.log(error);
								message.reply("Your Profile Guild has been updated!");
							});
							//console.log("[PROFILE] DEBUG: Done Editing Profile");
						}
						//Edits the profile image to a user submitted image
						//Needs to have an supported image type attached to the message otherwise will error
						else if(args[1].toLowerCase() === "image" && args.length >= 2){
							//console.log("[PROFILE] DEBUG: Editing Profile Image");
							if(message.attachments.first()){
								var fileCheck = message.attachments.first().name.split('.');
								if(fileCheck[1] === 'png'||fileCheck[1] === 'jpeg'||fileCheck[1] === 'jpg'){
				                	//console.log('[PROFILE] DEBUG: Changing Image');
				                	sql = 'UPDATE '+profile_table+" SET profile_image = '"+message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"' WHERE user_id = "+message.author.id;
				                    con.query(sql, function(error, result, fields){
										if(error) console.log(error);
										message.reply("Your Profile Image has been changed!");
									});
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
							});
							//console.log("[PROFILE] DEBUG: Done Clearing User Input Image");
						}
						else{
							message.reply("Invalid use of command. Use `~help profile` to see how to use the command!");
						}
					}
					
					//console.log("[PROFILE] DEBUG: Unhooked from database");
				});
				con.end();
			}
			//Edits the units
			else if(args[0].toLowerCase() == "units"){
				var con2 = mysql.createConnection({
					host: db_host,
					user: db_user,
					password: db_password,
					database: db_name
				});
				var sql = "SELECT Title, Name, Bot FROM characters ";
				if(args[1]){
					sql +=  "WHERE Element = '"+args[1]+"' ORDER BY Name ASC";
				}
				con2.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length >= 1){
						//result.forEach(p => console.log(p.Title));
						const FieldsEmbed = new Pagination.FieldsEmbed()
						.setArray(result)
						.setAuthorizedUsers([message.author.id])
						.setChannel(message.channel)
						.setElementsPerPage(10)
						.setPage(1)
						.setPageIndicator(true)
						.formatField("Results", i => "["+i.Title+"] "+i.Name.replace(/_/g, " ")+" => **"+i.Bot+"**")
						.setDeleteOnTimeout(false);

						FieldsEmbed.embed
						.setColor(0xFF00AE)
						.setDescription("Here are all the "+args[1]+" units!\nTo set a character to your profile, use the name after the '=>' in the results!")

						FieldsEmbed.build();
					}else{
						message.reply("No Characters found with that element");
						return;
					}			
				});
				con2.end();
			}
			//Clears the units
			else if(args[0].toLowerCase() == "clear"){
				var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
				con.query(sql, function(error, result, fields){
					if(error) console.log(error);
					if(result.length === 0){
						message.reply("You don't have a profile created! Create a profile first using `~profile create (Username)`**");
					}else{
						sql = "";
						if(args[1]){
							if(args[1].toLowerCase() == "fire"){
							sql = 'UPDATE '+profile_table+" SET fire_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
							}else if(args[1].toLowerCase() == "earth"){
								sql = 'UPDATE '+profile_table+" SET earth_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
							}else if(args[1].toLowerCase() == "water"){
								sql = 'UPDATE '+profile_table+" SET water_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
							}else if(args[1].toLowerCase() == "wind"){
								sql = 'UPDATE '+profile_table+" SET wind_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
							}else if(args[1].toLowerCase() == "light"){
								sql = 'UPDATE '+profile_table+" SET light_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
							}else if(args[1].toLowerCase() == "dark"){
								sql = 'UPDATE '+profile_table+" SET dark_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
							}else{
								sql = 'UPDATE '+profile_table+" SET fire_unit = 'NONE_SET', earth_unit = 'NONE_SET', wind_unit = 'NONE_SET', "+
								"water_unit = 'NONE_SET', light_unit = 'NONE_SET', dark_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
							}
						}else{
							sql = 'UPDATE '+profile_table+" SET fire_unit = 'NONE_SET', earth_unit = 'NONE_SET', wind_unit = 'NONE_SET', "+
							"water_unit = 'NONE_SET', light_unit = 'NONE_SET', dark_unit = 'NONE_SET' WHERE user_id = "+message.author.id;
						}
						
						con.query(sql, function(error, result, fields){
							if(error) console.log(error);
							message.reply("Your profile has been updated!");
						})
					}
				});
				con.end();
			}
			//Create a profile
			else if(args[0].toLowerCase() == "create"){
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
								"light_unit, dark_unit, flair, profile_image, background, pvp_rank, fire_asc, earth_asc, wind_asc, water_asc, light_asc, dark_asc) VALUES ("+message.author.id+", ";
						if(args[1]){
							if(args[1].length > 12){
								sql += "'"+args[1].substring(0, 12)+"', ";
							}else{
								sql += "'"+args[1]+"', ";
							}
							if(args[2]){
								sql += args[2];
							}else{
								sql += "'unknown'";
							}
							if(args[3]){
								if(args[3].length > 12){
								sql += ", '"+args[3].substring(0, 12)+"', ";
								}else{
									sql += ", '"+args[1]+"', ";
								}
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
								sql += "NONE_SET'";
							}
							sql += ", 'cosmos', 'crestoria', 0, 0, 0, 0, 0, 0)";
							con.query(sql, function(error, result, fields){
								if (error){
									console.log(error);
									message.reply("Error creating profile");
									return;
								}
								message.reply("Profile Create Successfully, check it out with **~profile**");
							});
							con.end();
						}else{
							message.reply("Invalid usage of command, use `~help profile` to see the proper usage");
						}

						
						//console.log("[PROFILE] DEBUG: Unhooked from database");
					}
				});
			}
			else if(args[0].toLowerCase() === "characters"){
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
			}else if(args[0].toLowerCase() === "flair"){
				const FieldsEmbed = new Pagination.FieldsEmbed()
				.setArray(Object.keys(images.flair))
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.setElementsPerPage(15)
				.setPage(1)
				.setPageIndicator(true)
				.formatField("Results", i => i)
				.setDeleteOnTimeout(false);

				FieldsEmbed.embed
				.setColor(0xFF00AE)
				.setDescription("Here is a list of Flair you can assign to your profile.")

				FieldsEmbed.build();
			}else if(args[0].toLowerCase() === "backgrounds"){
				const FieldsEmbed = new Pagination.FieldsEmbed()
				.setArray(Object.keys(images.background))
				.setAuthorizedUsers([message.author.id])
				.setChannel(message.channel)
				.setElementsPerPage(15)
				.setPage(1)
				.setPageIndicator(true)
				.formatField("Results", i => i)
				.setDeleteOnTimeout(false);

				FieldsEmbed.embed
				.setColor(0xFF00AE)
				.setDescription("Here is a list of Backgrounds you can assign to your profile.")

				FieldsEmbed.build();
			}else{
				message.reply("Invalid usage of `~profile` command");
			}
		}
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