const Canvas = require('canvas');
const Discord = require('discord.js');
const { profile_path } = require("../config.json");

module.exports = {
	name: 'card',
	cooldown: 2,
	description: 'Create a Profile Card for your Support Team. '+
	'Some images may be from datamined assets, otherwise all units are as of '+
	'current release in game',
	async execute(message, args) {

		if(args.length === 1 && args[0] === 'units'){
			//Either DM the command issuer all of the units and their shorthand names for the bot, 
			//or display the information as pages, or show a example on how characters are named for the bot
		}else{
			const canvas = Canvas.createCanvas(1900, 800);
			const ctx = canvas.getContext('2d');

			//const background = await Canvas.loadImage('./images/wallpaper.jpg');	
			console.log("[CARD] DEBUG: Getting Card Image Elements");
			// Units
			const fire_unit = await Canvas.loadImage(profile_path+'/fire_units/'+args[0]+'.png');
			const earth_unit = await Canvas.loadImage(profile_path+'/earth_units/'+args[1]+'.png');
			const wind_unit = await Canvas.loadImage(profile_path+'/wind_units/'+args[2]+'.png');
			const water_unit = await Canvas.loadImage(profile_path+'/water_units/'+args[3]+'.png');
			const light_unit = await Canvas.loadImage(profile_path+'/light_units/'+args[4]+'.png');
			const dark_unit = await Canvas.loadImage(profile_path+'/dark_units/'+args[5]+'.png');

			// Mystic Cut-in on the right side
			const mystic = await Canvas.loadImage(profile_path+'/mystic/'+args[6]+'.png');

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
		}

	},
};