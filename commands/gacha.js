const { MessageEmbed } = require('discord.js');
const gacha_pool = require('../gacha_pool.json');
const emotes = require('../emoji.json');

module.exports = {
	name: 'gacha',
	cooldown: 5,
	description: 'Gacha Rolls!',
	usage: " - pulls from the general gacha\n`~gacha arena` pulls from the arena gacha",
	execute(message, args) {
		var results = "";
		var gacha = ""
		if(args.length === 0){
			gacha = "general";
		}else{
			gacha = args[0].toLowerCase();
		}
		if(gacha_pool[gacha]){
			for(i = 0; i<10; i++){
				var pull = Math.floor(Math.random() * 100) + 1;
				if(i < 9 || gacha_pool[gacha].Rates.Bonus === false){
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
			.setTitle("Here is your results from the "+gacha.charAt(0).toUpperCase()+gacha.slice(1)+" Gacha:")
			.setColor(0xF0F0F0)
			.setDescription(results);
			message.reply(embed);
		}else{
			message.reply("You can't pull from a gacha that doesn't exist <:murdestelle:714863544415551599>");
		}
	},
};