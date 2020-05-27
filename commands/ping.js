module.exports = {
	name: 'ping',
	cooldown: 2,
	description: 'Ping!',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};