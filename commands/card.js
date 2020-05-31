const Canvas = require('canvas');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const { db_host, db_user, db_password, db_name, db_table, profile_path} = require('../config.json');

module.exports = {
	name: 'card',
	cooldown: 2,
	description: 'Create a Profile Card for your Support Team. '+
	'Some images may be from datamined assets, otherwise all units are as of '+
	'current release in game',
	usage: "!card [fire_unit] [earth_unit] [wind_unit] [water_unit] [light_unit] [dark_unit] [character]\n"+
			"Unit names are inputer as [chara_title]. Titles are abbreviated to the first letter of each word in the title.\n"+
			"EX: [Under a Azure Sky] Asbel will be inputed as asbel_uaas. You can display a list of units with their names by using !card units [element].\n"+
			"[character] is a side image of your favorite character, all you just need is their name. You can display a list of charactesr by using !card characters.",
	async execute(message, args) {

		if(args.length >= 1 && args.length < 3){
			var connect = mysql.createConnection({
				host: db_host,
				user: db_user,
				password: db_password,
				database: db_name
			});
			if(args[0] === 'units'){
				var sql = "SELECT Title, Name, Bot FROM characters WHERE Element = '";
				if(args[1]){
					sql += args[1]+"'";
				}
				var resultText = "";
				connect.query(sql, function(error, result, fields){
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

			}else if(args[0] === 'characters'){
				const characterFiles = fs.readdirSync(profile_path+"/mystic").filter(file => file.endsWith('.png'));
				var names = '';
				characterFiles.forEach(read => names+=(path.basename(read, '.png')[0].toUpperCase()+path.basename(read, '.png').slice(1)+", "));
				const embed = new MessageEmbed()
				.setTitle("Here are all the available characters!")
				.setColor(0x000000)
				.setDescription(names.substring(0, names.length - 2));
				message.channel.send(embed);
			}else{
				message.reply("Invalid arguments.");
			}
			connect.end();
			//Either DM the command issuer all of the units and their shorthand names for the bot, 
			//or display the information as pages, or show a example on how characters are named for the bot
		}else if(args.length == 7){
			const canvas = Canvas.createCanvas(1900, 800);
			const ctx = canvas.getContext('2d');

			var endFunc = false

			//const background = await Canvas.loadImage('./images/wallpaper.jpg');	
			console.log("[CARD] DEBUG: Getting Card Image Elements");
			// Units
			try{
				if(!fs.existsSync(profile_path+'/fire_units/'+args[0]+'.png')){
					message.reply("That Fire Unit can't be found. Use ***!card units fire*** to check if that unit exists");
					return;
				}
				else if(!fs.existsSync(profile_path+'/earth_units/'+args[1]+'.png')){
					message.reply("That Earth Unit can't be found. Use ***!card units earth*** to check if that unit exists");
					return;
				}
				else if(!fs.existsSync(profile_path+'/wind_units/'+args[2]+'.png')){
					message.reply("That Wind Unit can't be found. Use ***!card units wind*** to check if that unit exists");
					return;
				}
				else if(!fs.existsSync(profile_path+'/water_units/'+args[3]+'.png')){
					message.reply("That Water Unit can't be found. Use ***!card units water*** to check if that unit exists");
					return;
				}
				else if(!fs.existsSync(profile_path+'/light_units/'+args[4]+'.png')){
					message.reply("That Light Unit can't be found. Use ***!card units light*** to check if that unit exists");
					return;
				}
				else if(!fs.existsSync(profile_path+'/dark_units/'+args[5]+'.png')){
					message.reply("That Dark Unit can't be found. Use ***!card units dark*** to check if that unit exists");
					return;
				}
				else if(!fs.existsSync(profile_path+'/mystic/'+args[6]+'.png')){
					message.reply("That Chara can't be found. Use ***!card characters*** to check if that unit exists");
					return;
				}else{
					const fire_unit = await Canvas.loadImage(profile_path+'/fire_units/'+args[0]+'.png');
					const earth_unit = await Canvas.loadImage(profile_path+'/earth_units/'+args[1]+'.png');
					const wind_unit = await Canvas.loadImage(profile_path+'/wind_units/'+args[2]+'.png');
					const water_unit = await Canvas.loadImage(profile_path+'/water_units/'+args[3]+'.png');
					const light_unit = await Canvas.loadImage(profile_path+'/light_units/'+args[4]+'.png');
					const dark_unit = await Canvas.loadImage(profile_path+'/dark_units/'+args[5]+'.png');
					const mystic = await Canvas.loadImage(profile_path+'/mystic/'+args[6]+'.png');
				}
			}catch(err){
				console.log(err);
			}

			/*const fire_unit = await Canvas.loadImage(profile_path+'/fire_units/'+args[0]+'.png');
			const earth_unit = await Canvas.loadImage(profile_path+'/earth_units/'+args[1]+'.png');
			const wind_unit = await Canvas.loadImage(profile_path+'/wind_units/'+args[2]+'.png');
			const water_unit = await Canvas.loadImage(profile_path+'/water_units/'+args[3]+'.png');
			const light_unit = await Canvas.loadImage(profile_path+'/light_units/'+args[4]+'.png');
			const dark_unit = await Canvas.loadImage(profile_path+'/dark_units/'+args[5]+'.png');
			const mystic = await Canvas.loadImage(profile_path+'/mystic/'+args[6]+'.png');*/
				

			//The Basics
			const sr_background = await Canvas.loadImage(profile_path+'/sr_background.png');
			const card_background = await Canvas.loadImage(profile_path+'/background.png');
			const elements = await Canvas.loadImage(profile_path+'/elements.png');
			const title = await Canvas.loadImage(profile_path+'/title.png');
			const border = await Canvas.loadImage(profile_path+'/borders.png');


			console.log("[CARD] DEBUG: Drawing Card Image Elements");
			ctx.drawImage(sr_background, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(card_background, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(mystic, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(fire_unit, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(water_unit, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(wind_unit, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(earth_unit, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(light_unit, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(dark_unit, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
			//Text to be rendered here
			ctx.drawImage(elements, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(title, 0, 0, canvas.width, canvas.height);

			console.log("[CARD] DEBUG: Sending Profile Card");
			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile_image.png');

			message.channel.send(attachment);
		}else{
			message.reply("Invalid use of the command");
		}

	},
};