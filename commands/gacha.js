const { MessageEmbed } = require('discord.js');
const gacha_pool = require('../gacha_pool.json');
const emotes = require('../emoji.json');

module.exports = {
	name: 'gacha',
	cooldown: 5,
	description: 'Gacha Rolls!',
	usage: " - Simulates a 10-pull, use `~gacha list` to see the list of available gacha",
	execute(message, args) {
		var results = "";
		var gacha = ""
		if(args.length === 0){
			gacha = "general";
		}else if(args[0].toLowerCase() === "list"){
			var names = "";
			Object.keys(gacha_pool).forEach(function(k){
				names += "**"+gacha_pool[k].Name+"** => "+k+"\n";
			});
			const embed = new MessageEmbed()
			.setTitle("Here is a list of gacha you can pull from. Use the name after the => in the results")
			.setColor(0xF0F0F0)
			.setDescription(names);
			message.reply(embed);
		}else{
			gacha = args[0].toLowerCase();
		}
		if(args[0].toLowerCase() != "list"){
			if(gacha_pool[gacha]){
				for(i = 0; i<gacha_pool[gacha].Rolls; i++){
					var pull = Math.floor(Math.random() * 100) + 1;
					if(i < gacha_pool[gacha].Rolls-1 || gacha_pool[gacha].Rates.Bonus === false){
						if(pull <= gacha_pool[gacha].Rates.SSR){
							pull = Math.floor(Math.random() * gacha_pool[gacha].SSR.length);
							results+=emotes["SSR"]+" "+gacha_pool[gacha].SSR[pull]+"\n";
							//console.log("SSR");
						}else if(pull > gacha_pool[gacha].Rates.SSR && pull <= (gacha_pool[gacha].Rates.SSR + gacha_pool[gacha].Rates.SR)){
							pull = Math.floor(Math.random() * gacha_pool[gacha].SR.length);
							results+=emotes["SR"]+" "+gacha_pool[gacha].SR[pull]+"\n";
							//console.log("SR");
						}else{
							pull = Math.floor(Math.random() * gacha_pool[gacha].R.length);
							results+=emotes["R"]+" "+gacha_pool[gacha].R[pull]+"\n";
							//console.log("R");
						}
					}else{
						if(pull <= gacha_pool[gacha].Rates.SSR){
							pull = Math.floor(Math.random() * gacha_pool[gacha].SSR.length);
							results+=emotes["SSR"]+" "+gacha_pool[gacha].SSR[pull]+"\n";
							//console.log("SSR");
						}else{
							pull = Math.floor(Math.random() * gacha_pool[gacha].SR.length);
							results+=emotes["SR"]+" "+gacha_pool[gacha].SR[pull]+"\n";
							//console.log("SR");
						}
					}
				}
				const embed = new MessageEmbed()
				.setTitle("Here is your results from the "+gacha_pool[gacha].Name+" Gacha:")
				.setColor(0xF0F0F0)
				.setDescription(results);
				message.reply(embed);
			}else{
				message.reply("You can't pull from a gacha that doesn't exist <:murdestelle:714863544415551599>");
			}
		}
	},
};