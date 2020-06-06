const fs = require('fs');

module.exports = {
	name: 'suggestion',
	cooldown: 2,
	description: "Submit a suggestion to VisionOrb's Dev Team",
	execute(message, args) {
		var string = "";

		for(i = 0; i<args.length; i++){
			string+=(args[i]+" ");
		}
		string+="\n\n";
		fs.appendFile("./suggestions/suggestions.txt", string, function (err) {
			if (err) throw err;
			message.delete();
			message.reply("Your suggestion has been submitted!");
		});
	},
};