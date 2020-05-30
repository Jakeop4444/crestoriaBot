const Canvas = require('canvas');
const Discord = require('discord.js');
const fs = require('fs');
const { profile_path } = require("../config.json");

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
			if(args[0] === 'units'){
				if(args[1] === 'fire'){

				}else if(args[1] === 'earth'){
					
				}else if(args[1] === 'wind'){
					
				}else if(args[1] === 'water'){
					
				}else if(args[1] === 'light'){
					
				}else if(args[1] === 'dark'){
					
				}else{
					message.reply("Invalid Element");
				}
			}else if(args[0] === 'characters'){

			}
			//Either DM the command issuer all of the units and their shorthand names for the bot, 
			//or display the information as pages, or show a example on how characters are named for the bot
		}else if(args.length == 7){
			const canvas = Canvas.createCanvas(1900, 800);
			const ctx = canvas.getContext('2d');

			//const background = await Canvas.loadImage('./images/wallpaper.jpg');	
			console.log("[CARD] DEBUG: Getting Card Image Elements");
			// Units
			fs.access(profile_path+'/fire_units/'+args[0]+'.png', fs.F_OK, (err) => {
				if(err){
					message.reply("That Fire Unit can't be found. Use ***!card units fire*** to check if that unit exists");
					return;
				}else{
					const fire_unit = Canvas.loadImage(profile_path+'/fire_units/'+args[0]+'.png');
				}
			})
			fs.access(profile_path+'/earth_units/'+args[1]+'.png', fs.F_OK, (err) => {
				if(err){
					message.reply("That Water Unit can't be found. Use ***!card units water*** to check if that unit exists");
					return;
				}else{
					const earth_unit = Canvas.loadImage(profile_path+'/earth_units/'+args[1]+'.png');
				}
			})
			fs.access(profile_path+'/wind_units/'+args[2]+'.png', fs.F_OK, (err) => {
				if(err){
					message.reply("That Wind Unit can't be found. Use ***!card units wind*** to check if that unit exists");
					return;
				}else{
					const wind_unit = Canvas.loadImage(profile_path+'/wind_units/'+args[2]+'.png');
				}
			})
			fs.access(profile_path+'/earth_units/'+args[3]+'.png', fs.F_OK, (err) => {
				if(err){
					message.reply("That Earth Unit can't be found. Use ***!card units earth*** to check if that unit exists");
					return;
				}else{
					const water_unit = Canvas.loadImage(profile_path+'/water_units/'+args[3]+'.png');
				}
			})
			fs.access(profile_path+'/light_units/'+args[4]+'.png', fs.F_OK, (err) => {
				if(err){
					message.reply("That Light Unit can't be found. Use ***!card units light*** to check if that unit exists");
					return;
				}else{
					const light_unit = Canvas.loadImage(profile_path+'/light_units/'+args[4]+'.png');
				}
			})
			fs.access(profile_path+'/dark_units/'+args[5]+'.png', fs.F_OK, (err) => {
				if(err){
					message.reply("That Dark Unit can't be found. Use ***!card units dark*** to check if that unit exists");
					return;
				}else{
					const dark_unit = Canvas.loadImage(profile_path+'/dark_units/'+args[5]+'.png');
				}
			})
			// Mystic Cut-in on the right side
			fs.access(profile_path+'/mystic/'+args[6]+'.png', fs.F_OK, (err) => {
				if(err){
					message.reply("That Character can't be found. Use ***!card characters*** to check if that character exists");
					return;
				}else{
					const mystic = Canvas.loadImage(profile_path+'/mystic/'+args[6]+'.png');
				}
			})
			

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