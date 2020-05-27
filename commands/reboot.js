const fs = require('fs');
const { token } = require('../config.json');
const { client } = require('../index.js');

module.exports = {
	name: 'reboot',
	cooldown: 10,
	description: 'Shut down and reboot the entire bot.',
	execute(message, args) {

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

		//message.client = newClient;
	},
};