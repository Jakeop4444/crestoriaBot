module.exports = {
	name: 'bing',
	cooldown: 2,
	description: 'Ping!',
	execute(message, args) {
		message.channel.send('Bong.');
	},
};