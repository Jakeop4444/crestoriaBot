const { MessageEmbed } = require('discord.js');
const mysql = require('mysql');
const request = require('request');
const fs = require ('fs');
const { db_host, profile_user, profile_password, profile_db, profile_table, userinfo_path } = require('../config.json');

module.exports = {
	name: 'profile',
	cooldown: 2,
	usage: '[command name] [create] [your_name] [your_id] [*your_guild]',
	description: 'Create a profile card for users to reference you across multiple servers',
	execute(message, args){
		var con = mysql.createConnection({
			host: db_host,
			user: profile_user,
			password: profile_password,
			database: profile_db,
			multipleStatements: true
		});
		console.log("[PROFILE] DEBUG: connection to database established.");
		//display profile data
		if(args.length === 0){
			console.log("[PROFILE] DEBUG: Displaying Profile Data");
			var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
			con.query(sql, function (error, result, fields){
				if(error) console.log(error);
				if(result.length === 0){
					message.reply("You don't have a profile created! Create a profile first!");
				}else{
					console.log('[PROFILE] DEBUG: Displaying Information');

					const embed = new MessageEmbed()
					.setTitle(result[0].profile_name)
					.setColor(0xFFFFFF)
					.setDescription("ID: "+result[0].profile_id+"\nGuild: "+result[0].profile_guild)
					.setImage(result[0].profile_image.replace('CLN', ":").replace("DBLFWS", "//").replace("FWS/g", "/"));

					message.channel.send(embed);
				}
			})
			con.end();
		}
		//Edit Profile
		else if(args.length >= 2 && args[0] === 'edit'){
			var sql = "SELECT * FROM "+profile_table+" WHERE user_id = "+message.author.id;
			console.log("[PROFILE] DEBUG: Editing Profile");
			con.query(sql, function(error, result, fields){
				if(error) console.log(error);
				if(result.length === 0){
					message.reply("You don't have a profile created! Create a profile first!");
					con.end();
				}else{
					if(args.length === 2){
						if(args[1] === 'image'){
							console.log("[PROFILE] DEBUG: Editing Profile Image");
							if(message.attachments.first()){
								var fileCheck = message.attachments.first().name.split('.');
								if(fileCheck[1] === 'png'||fileCheck[1] === 'jpeg'||fileCheck[1] === 'jpg'){
				                	console.log('[PROFILE] DEBUG: Changing Image');
				                	sql = 'UPDATE '+profile_table+" SET profile_image = '"+message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"' WHERE user_id = "+message.author.id;
				                    con.query(sql, function(error, result, fields){
										if(error) console.log(error);
										message.reply("Your Profile Image has been changed!")
										con.end();
										return;
									})
			                    }else{
			                        message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
			                        con.end();
			                        return;
			                    }
							}else{
								message.reply("Image Not Attached");
								con.end();
							}
						}
					}else if(args.length === 3){
							if(args[1] === 'name'){
								console.log("[PROFILE] DEBUG: Editing Profile Name");
								sql = 'UPDATE '+profile_table+" SET profile_name = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Profile Name has been updated!");
								})
								con.end();
							}else if(args[1] === 'id'){
								console.log("[PROFILE] DEBUG: Editing Profile ID");
								sql = 'UPDATE '+profile_table+" SET profile_id = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Profile ID has been updated!");
								})
								con.end();
							}else if(args[1] === 'guild'){
								console.log("[PROFILE] DEBUG: Editing Profile Guild");
								sql = 'UPDATE '+profile_table+" SET profile_guild = '"+args[2]+"' WHERE user_id = "+message.author.id;
								con.query(sql, function(error, result, fields){
									if(error) console.log(error);
									message.reply("Your Profile Guild has been updated!");
								})
								con.end();
							}else{
								message.reply("Invalid Arguments");
								con.end();
							}
					}else{
						message.reply("Invalid Arguments");
						con.end();
					}
				}
			})
		}
		//Create Profile
		else if(args.length >= 3 && args[0] === 'create'){
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
					sql = "INSERT INTO "+profile_table+" (user_id, profile_name, profile_id, profile_guild, profile_image) VALUES ("+message.author.id+", '"+args[1]+"', "+args[2];
					if(args[3]){
						sql += ", '"+args[3]+"', '";
					}else{
						sql += ", 'unknown', '";
					}
					if(message.attachments.first()){
						var fileCheck = message.attachments.first().name.split('.');
						if(fileCheck[1] === 'png'||fileCheck[1] === 'jpeg'||fileCheck[1] === 'jpg'){
				       	console.log('[PROFILE] DEBUG: Changing Image');
				       	sql += message.attachments.first().url.replace(':', "CLN").replace("//", "DBLFWS")+"')";
				        console.log("[PROFILE] DEBUG: "+sql);
						con.query(sql, function(error, result, fields){
							if (error){
								console.log(error);
								message.reply("Error creating profile");
								return;
							}
							message.reply("Profile Create Successfully, check it out with ***!profile***");
						})
			            }else{
			                message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
			                con.end();
			                return;
			            }
					}else{
						message.reply("Image Not Attached");
						con.end();
					}
					con.end();
				}
			})
		}else{
			message.reply("Invalid Usage");
		}
	},
};