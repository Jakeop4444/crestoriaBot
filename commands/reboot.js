const fs = require('fs');
const { token, operator_id_one, operator_id_two } = require('../config.json');
const { client } = require('../index.js');

module.exports = {
	name: 'reboot',
	cooldown: 10,
	description: 'Reboots VisionOrb, usable only by HERO and HellFyre.',
	execute(message, args) {
		if(message.author.id === operator_id_one || message.author.id === operator_id_two){
			const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

			message.client.commands.clear();

			console.log("[REBOOT] DEBUG: Crestoria Bot is Rebooting");
			for (const file of commandFiles) {
				const command = require(`../commands/${file}`);
				console.log("[REBOOT] DEBUG: Adding "+command.name+" to Commands List");
				message.client.commands.set(command.name, command);
			}

			console.log("[REBOOT] DEBUG: Crestoria Bot is Logging In");
			message.channel.send('Resetting...')
			.then(message.client.destroy())
			.then(message.client.login(token));
			console.log("[REBOOT] DEBUG: Crestoria Bot is Logged In");
		}
	},
};