const { MessageEmbed } = require('discord.js');
const gacha_pool = require('../gacha_pool.json');
const emotes = require('../emoji.json');

module.exports = {
	name: 'gacha',
	cooldown: 5,
	description: 'Gacha Rolls!',
	usage: " - pulls from the general gacha\n`~gacha arena` pulls from the arena gacha"
	execute(message, args) {
		var results = "";
		if(args.length === 0 || args[0].toLowerCase() === "general"){
			for(i = 0; i < 10; i++){
				var pull = Math.floor(Math.random() * 100) + 1;
				if(i < 9 ){
					if(pull <= gacha_pool["general"].Rates.SSR){
						pull = Math.floor(Math.random() * gacha_pool["general"].SSR.length);
						results+=emotes["SSR"]+" "+gacha_pool["general"].SSR[pull]+"\n";
						//console.log("SSR");
					}else if(pull > gacha_pool["general"].Rates.SSR && pull <= (gacha_pool["general"].Rates.SSR + gacha_pool["general"].Rates.SR)){
						pull = Math.floor(Math.random() * gacha_pool["general"].SR.length);
						results+=emotes["SR"]+" "+gacha_pool["general"].SR[pull]+"\n";
						//console.log("SR");
					}else{
						pull = Math.floor(Math.random() * gacha_pool["general"].R.length);
						results+=emotes["R"]+" "+gacha_pool["general"].R[pull]+"\n";
						//console.log("R");
					}
				}else{
					if(pull <= gacha_pool["general"].Rates.SSR){
						pull = Math.floor(Math.random() * gacha_pool["general"].SSR.length);
						results+=emotes["SSR"]+" "+gacha_pool["general"].SSR[pull]+"\n";
						//console.log("SSR");
					}else{
						pull = Math.floor(Math.random() * gacha_pool["general"].SR.length);
						results+=emotes["SR"]+" "+gacha_pool["general"].SR[pull]+"\n";
						//console.log("SR");
					}
				}
			}
			const embed = new MessageEmbed()
			.setTitle("Here is your results from the General Gacha:")
			.setColor(0xF0F0F0)
			.setDescription(results);
			message.reply(embed);
			//console.log(gacha_pool["general"].SSR.length);
		}else if(args[0].toLowerCase() === "arena"){
			for(i = 0; i < 10; i++){
				var pull = Math.floor(Math.random() * 100) + 1;
				if(pull <= gacha_pool["arena"].Rates.SSR){
					pull = Math.floor(Math.random() * gacha_pool["arena"].SSR.length);
					results+=emotes["SSR"]+" "+gacha_pool["arena"].SSR[pull]+"\n";
					//console.log("SSR");
				}else if(pull > gacha_pool["arena"].Rates.SSR && pull <= (gacha_pool["arena"].Rates.SSR + gacha_pool["arena"].Rates.SR)){
					pull = Math.floor(Math.random() * gacha_pool["arena"].SR.length);
					results+=emotes["SR"]+" "+gacha_pool["arena"].SR[pull]+"\n";
					//console.log("SR");
				}else{
					pull = Math.floor(Math.random() * gacha_pool["arena"].R.length);
					results+=emotes["R"]+" "+gacha_pool["arena"].R[pull]+"\n";
					//console.log("R");
				}
			}
			const embed = new MessageEmbed()
			.setTitle("Here is your results from the Arena Gacha:")
			.setColor(0xF0F0F0)
			.setDescription(results);
			message.reply(embed);
			//console.log(gacha_pool["arena"].Rates.SSR);
		}else{
			message.reply("You can't pull from a gacha that doesn't exist <:murdestelle:714863544415551599>");
		}
	},
};