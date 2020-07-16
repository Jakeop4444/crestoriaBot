const Pagination = require('discord-paginationembed');

module.exports = {
	name: 'testpage',
	cooldown: 2,
	description: 'Testing pagination using Discord PaginationEmbed utility.',
	execute(message, args) {
		const FieldsEmbed = new Pagination.FieldsEmbed()
			.setArray([{name: 'Lloyd'}, {name: 'Edna'}])
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(1)
			.setPage(1)
			.setPageIndicator(true)
			.formatField('Units:', i => i.name)
			.setDeleteOnTimeout(true);

		FieldsEmbed.embed
			.setColor(0xFF00AE)
			.setDescription('Test Description');

		FieldsEmbed.build();
	},
};