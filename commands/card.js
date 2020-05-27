const Canvas = require('canvas');
const Discord = require('discord.js');

module.exports = {
	name: 'card',
	cooldown: 2,
	description: 'testing',
	async execute(message, args) {

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('./images/wallpaper.jpg');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		// Select the color of the stroke
		ctx.strokeStyle = '#FFFFFF';
		// Draw a rectangle with the dimensions of the entire canvas
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

		message.channel.send(attachment);

	},
};