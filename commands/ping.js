module.exports = {
	name: 'ping',
	cooldown: 2,
	description: 'Ping test!',
	execute(message, args) {
		message.channel.send('<:murdestelle:714863544415551599>');
	},
};