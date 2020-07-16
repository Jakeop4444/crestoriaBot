const fs = require('fs');
const { operator_id_one, operator_id_two } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'statistics',
	cooldown: 10,
	description: 'Displays Statistics of Vision Orb, usable only by HERO and HellFyre.',
	execute(message, args) {
		if(message.author.id === operator_id_one || message.author.id === operator_id_two){
			
			var sCount = message.client.guilds.cache.size;
			var mCount = 0;
			message.client.guilds.cache.forEach(s => mCount+=(s.members.cache.filter(m => !m.user.bot).size));

			const embed = new MessageEmbed()
			.setTitle("**Vision Orb v0.11.1 BETA**")
			.setDescription("Currently running on **"+sCount+"** servers, with **"+mCount+"** users total");

			message.channel.send(embed);


		}
	},
};