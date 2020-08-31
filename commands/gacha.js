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
		var gacha = "";

		var ssr_pool = new Array();
		var sr_pool = new Array();
		var r_pool = new Array();
		if(args.length > 0 && args[0].toLowerCase() === "list"){
			var names = "";
			Object.keys(gacha_pool).forEach(function(k){
				if(gacha_pool[k].Can_Roll){
					names += "**"+gacha_pool[k].Name+"** => "+k+"\n";
				}
			});
			const embed = new MessageEmbed()
			.setTitle("Here is a list of gacha you can pull from. Use the name after the => in the results")
			.setColor(0xF0F0F0)
			.setDescription(names);
			message.reply(embed);
		}else{
			if(args.length === 0){
				gacha = "premium";
			}else{
				gacha = args[0].toLowerCase();
			}
			if(gacha_pool[gacha] && gacha_pool[gacha].Can_Roll){
				if(gacha_pool[gacha].SSR){
					gacha_pool[gacha].SSR.forEach(e => ssr_pool.push(e));
				}
				if(gacha_pool[gacha].Use_SSR){
					gacha_pool["pool"].SSR.forEach(e => ssr_pool.push(e));
				}
				if(gacha_pool[gacha].SR){
					gacha_pool[gacha].SR.forEach(e => sr_pool.push(e));
				}
				if(gacha_pool[gacha].Use_SR){
					gacha_pool["pool"].SR.forEach(e => sr_pool.push(e));
				}
				if(gacha_pool[gacha].R){
					gacha_pool[gacha].R.forEach(e => r_pool.push(e));
				}
				if(gacha_pool[gacha].Use_R){
					gacha_pool["pool"].R.forEach(e => r_pool.push(e));
				}

				for(i = 0; i<gacha_pool[gacha].Rolls; i++){
					var pull = Math.floor(Math.random() * 100) + 1;
					if(i < gacha_pool[gacha].Rolls-1 || gacha_pool[gacha].Rates.Bonus === false){
						if(pull <= gacha_pool[gacha].Rates.SSR){
							pull = Math.floor(Math.random() * ssr_pool.length);
							var e;
							if(emotes.Materials[ssr_pool[pull]]){
								e = emotes.Materials[ssr_pool[pull]];
							}else{
								e = emotes["SSR"];
							}
							results+=e+" "+ssr_pool[pull]+"\n";
							//console.log("SSR");
						}else if(pull > gacha_pool[gacha].Rates.SSR && pull <= (gacha_pool[gacha].Rates.SSR + gacha_pool[gacha].Rates.SR)){
							pull = Math.floor(Math.random() * sr_pool.length);
							var e;
							if(emotes.Materials[sr_pool[pull]]){
								e = emotes.Materials[sr_pool[pull]];
							}else{
								e = emotes["SR"];
							}
							results+=e+" "+sr_pool[pull]+"\n";
							//console.log("SR");
						}else{
							pull = Math.floor(Math.random() * r_pool.length);
							var e;
							if(emotes.Materials[r_pool[pull]]){
								e = emotes.Materials[r_pool[pull]];
							}else{
								e = emotes["R"];
							}
							results+=e+" "+r_pool[pull]+"\n";
							//console.log("R");
						}
					}else{
						if(pull <= gacha_pool[gacha].Rates.SSR){
							pull = Math.floor(Math.random() * ssr_pool.length);
							results+=emotes["SSR"]+" "+ssr_pool[pull]+"\n";
							//console.log("SSR");
						}else{
							pull = Math.floor(Math.random() * sr_pool.length);
							results+=emotes["SR"]+" "+sr_pool[pull]+"\n";
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
			ssr_pool.splice(0, ssr_pool.length);
			sr_pool.splice(0, sr_pool.length);
			r_pool.splice(0, r_pool.length);
		}	
	},
};