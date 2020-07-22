const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');
const events = require('../events.json');


module.exports = {
	name: 'events',
	cooldown: 2,
	description: 'Displays a list of events that are soon to happen in Crestoria',
	execute(message, args) {
		const FieldsEmbed = new Pagination.FieldsEmbed()
		.setArray(events.list.events)
		.setAuthorizedUsers([message.author.id])
		.setChannel(message.channel)
		.setElementsPerPage(1)
		.setPage(1)
		.setPageIndicator(true)
		.formatField("Event", i => i.name, false)
		.formatField("Start", i => i.start_period, true)
		.formatField("End", i => i.end_period, true)
		.formatField("Event Details", i => i.description, false)
		.setDeleteOnTimeout(false);

		FieldsEmbed.embed
			.setTitle("Upcoming Events")

		FieldsEmbed.build();
	},
};