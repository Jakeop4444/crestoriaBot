const Pagination = require('discord-paginationembed');

module.exports = {
	name: 'testpage',
	cooldown: 2,
	description: 'Testing pagination using Discord PaginationEmbed utility.',
	execute(message, args) {
		const FieldsEmbed = new Pagination.FieldsEmbed()
			.setArray([{name: 'Lloyd'}, {name: 'Edna'}, {name: 'Rita'}, {name: 'Regal'}, {name: 'Jude'}, {name: 'Magilou'}])
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(2)
			.setPage(1)
			.setPageIndicator(true)
<<<<<<< HEAD:commands/testpage.js
			.formatField('Units:', i => i.name)
			.setDeleteOnTimeout(true);
=======
			.formatField('', i => i.name)
			.setDeleteOnTimeout(false);
>>>>>>> d7bc6be15dd1303643eec5d2fbe2a977c3be43d3:testpage.js

		FieldsEmbed.embed
			.setColor(0xFF00AE)
			.setDescription('**Test Description**');

		FieldsEmbed.build();
	},
};