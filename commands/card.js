const Canvas = require('canvas');
const Discord = require('discord.js');

module.exports = {
	name: 'card',
	cooldown: 2,
	description: 'testing',
	async execute(message, args) {

		const canvas = Canvas.createCanvas(1900, 800);
		const ctx = canvas.getContext('2d');

		//const background = await Canvas.loadImage('./images/wallpaper.jpg');	
		console.log("[CARD] DEBUG: Getting Card Image Elements");
		// Units
		const fire_unit = await Canvas.loadImage('./images/profile_card_images/fire_units/'+args[0]+'.png');
		const earth_unit = await Canvas.loadImage('./images/profile_card_images/earth_units/'+args[1]+'.png');
		const wind_unit = await Canvas.loadImage('./images/profile_card_images/wind_units/'+args[2]+'.png');
		const water_unit = await Canvas.loadImage('./images/profile_card_images/water_units/'+args[3]+'.png');
		const light_unit = await Canvas.loadImage('./images/profile_card_images/light_units/'+args[4]+'.png');
		const dark_unit = await Canvas.loadImage('./images/profile_card_images/dark_units/'+args[5]+'.png');

		// Mystic Cut-in on the right side
		const mystic = await Canvas.loadImage('./images/profile_card_images/mystic/'+args[6]+'.png');

		//The Basics
		const sr_background = await Canvas.loadImage('./images/profile_card_images/sr_background.png');
		const card_background = await Canvas.loadImage('./images/profile_card_images/background.png');
		const elements = await Canvas.loadImage('./images/profile_card_images/elements.png');
		const title = await Canvas.loadImage('./images/profile_card_images/title.png');
		const border = await Canvas.loadImage('./images/profile_card_images/borders.png');


		console.log("[CARD] DEBUG: Drawing Card Image Elements");
		ctx.drawImage(sr_background, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(card_background, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(fire_unit, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(water_unit, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(wind_unit, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(earth_unit, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(light_unit, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(dark_unit, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(mystic, 0, 0, canvas.width, canvas.height);
		//Text to be rendered here
		ctx.drawImage(elements, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(title, 0, 0, canvas.width, canvas.height);

		console.log("[CARD] DEBUG: Sending Profile Card");
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

		message.channel.send(attachment);

	},
};