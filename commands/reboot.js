const { token } = require('../config.json');
const { client } = require('../index.js');

module.exports = {
	name: 'reboot',
	cooldown: 10,
	description: 'Shut down and reboot the entire bot.',
	execute(message, args) {
		message.channel.send('Resetting...')
		.then(message.client.destroy())
		.then(message.client.login(token));
	},
};