const { client } = require('../index.js');

module.exports = {
	name: 'stahn',
	cooldown: 5,
	description: 'Sends Stahn Dummy Data',
	execute(message, args) {
		const embed = {
		  "color": 13632027,
		  "image": {
		    "url": "https://www.tocdb.xyz/img/ssr%20portraits/ch_cap_bust_0201_01.jpg"
		  },
		  "author": {
		    "name": "Stahn Aileron"
		  },
		  "description": "Insert Character Title Here \n Rarity: SSR \n Element: Fire \n Weapon Type: Sword",
		  "footer": {
		    "text": "https://www.tocdb.xyz/index.php"
		  }
		};
		message.channel.send({embed});
	},
};