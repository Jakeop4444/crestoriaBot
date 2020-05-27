module.exports = {
	name: 'waiting',
	cooldown: 2,
	description: 'Waiting for release like',
	execute(message, args) {
		const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'veltriggered');
		message.reply(emoji);
	},
};