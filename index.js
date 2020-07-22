const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log("[INDEX] DEBUG: Crestoria Bot is Logging In");
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	console.log("[INDEX] DEBUG: Adding "+command.name+" to Commands List");
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

const cooldowns = new Discord.Collection();
var currentTime = new Date();

client.on('message', message => {
	var currentTime = new Date();
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	new_message = message.content.replace(/[^a-zA-Z0-9!_~ ]/g, "");
	const args = new_message.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	var hours;
	var minutes;
	var seconds;

	if(currentTime.getHours() < 10){
		hours = "0"+currentTime.getHours();
	}else{
		hours = currentTime.getHours();
	}
	if(currentTime.getMinutes() < 10){
		minutes = "0"+currentTime.getMinutes();
	}else{
		minutes = currentTime.getMinutes();
	}
	if(currentTime.getSeconds() < 10){
		seconds = "0"+currentTime.getSeconds();
	}else{
		seconds = currentTime.getSeconds();
	}

	console.log("["+hours+":"+minutes+":"+seconds+"] [INDEX] DEBUG: Attempting to invoke Command: "+new_message);
	const command = client.commands.get(commandName);

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);
console.log("[INDEX] DEBUG: Crestoria Bot is Logged In");