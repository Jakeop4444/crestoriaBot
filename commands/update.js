const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'update',
	cooldown: 2,
	description: 'Displays Bot Updates',
	execute(message, args) {
		const text = fs.readFileSync("./updates.txt");
		const embed = new MessageEmbed()
		.setColor(0x00FF00)
		.setDescription(text);

		message.channel.send(embed);
	},
};