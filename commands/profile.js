const { MessageEmbed } = require('discord.js');
const { userinfo_path } = require('../config.json');
const request = require('request');
const fs = require ('fs');


module.exports = {
	name: 'profile',
	cooldown: 2,
	usage: '[command name] [create] [your_name] [your_id] [*your_guild]',
	description: 'Create a profile card for users to reference you across multiple servers',
	execute(message, args){
		//display profile data
		if(args.length === 0){
			if(!fs.existsSync(userinfo_path+'/'+message.author.id)){
				message.reply("You don't have a profile created! Create a profile first!");
			}else{
				console.log('[PROFILE] DEBUG: Displaying Information');
				var text = fs.readFileSync(userinfo_path+'/'+message.author.id+'/profile_data.txt').toString('utf-8');
				console.log(text);
				var lines = text.split('\n');
				var profile_name = lines[0].split(':');
				var profile_id = lines[1].split(':');
				var description = profile_id[1];
				if(lines[2]){
					var profile_guild = lines[2].split(':');
					description+='\n'+profile_guild[1];
				}
				

				const embed = new MessageEmbed()
				.setTitle(profile_name[1])
				.setColor(0xFFFFFF)
				.setDescription(description)
				.attachFiles(userinfo_path+'/'+message.author.id+'/profile_img.png')
				.setImage('attachment://profile_img.png');
				message.channel.send({embed});	
			}

		}
		//Edit Profile
		else if(args.length === 3 && args[0] === 'edit'){
			if(!fs.existsSync(userinfo_path+'/'+message.author.id)){
				message.reply("You don't have a profile created! Create a profile first!");
				return;
			}else{
				var string = '';
				var text = fs.readFileSync(userinfo_path+'/'+message.author.id+'/profile_data.txt').toString('utf-8');
				var lines = text.split('\n');
				//Edit Name
				if(args[1] === 'name'){
					var edit = lines[0].split(':');
					edit[1] = args[2];
					string += edit[0]+':'+edit[1]+'\n'+lines[1];
					if(lines[2]){
						string+='\n'+lines[2];
					}
					fs.writeFile(userinfo_path+'/'+message.author.id+'/profile_data.txt', string, function(error){
						if(error) console.log(error);
						console.log('[PROFILE] DEBUG: Profile Text edited sucessfully')
					});
				}
				//Edit ID
				else if(args[1] === 'id'){
					var edit = lines[1].split(':');
					edit[1] = args[2];
					string += lines[0]+'\n'+edit[0]+':'+edit[1];
					if(lines[2]){
						string+='\n'+lines[2];
					}
					fs.writeFile(userinfo_path+'/'+message.author.id+'/profile_data.txt', string, function(error){
						if(error) console.log(error);
						console.log('[PROFILE] DEBUG: Profile Text edited sucessfully')
					});
				}
				//Edit Image
				else if(args[1] === 'image'){
					if(message.attachments.first()){
						var fileCheck = message.attachments.first().name.split('.');
						if(fileCheck[1] === 'png'||
							fileCheck[1] === 'jpeg'||
							fileCheck[1] === 'jpg'){
							console.log('[PROFILE] DEBUG: Downloading Image');
							if(!fs.existsSync(userinfo_path+'/'+message.author.id)){
								fs.mkdirSync(userinfo_path+'/'+message.author.id);
							}
							//console.log('[PROFILE] DEBUG: File URL; '+message.attachments.first().url);
							download(message.attachments.first().url, message.author.id);
						}else{
							message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
							return;
						}
					}else{
						message.reply("Image not attached to edit!");
					}
					

				}
				//Edit Guild
				else if(args[1] === 'guild'){
					if(lines[2]){
						var edit = lines[2].split(':');
						edit[1] = args[2];
						string += lines[0]+'\n'+lines[1];
						string+='\n'+edit[0]+':'+edit[1];
						fs.writeFile(userinfo_path+'/'+message.author.id+'/profile_data.txt', string, function(error){
						if(error) console.log(error);
							console.log('[PROFILE] DEBUG: Profile Text created sucessfully')
						});
					}else{
						fs.appendFile(userinfo_path+'/'+message.author.id+'/profile_data.txt', '\nguild:'+args[2]);
					}
				}
				else{
					message.reply("Invalid arguments for edit, valid arguments are [name] [id] [guild] [image]");
					return;
				}
			}
			
		}
		//Create Profile
		else if(args.length >=3 && args[0] === 'create'){
			if(fs.existsSync(userinfo_path+'/'+message.author.id)){
				message.reply("You already have a profile created, use the edit command instead!");
				return;
			}


			if(message.attachments.first()){
				console.log('[PROFILE] DEBUG: Found Image');
				console.log('[PROFILE] DEBUG: Filename; '+message.attachments.first().name);
				var fileCheck = message.attachments.first().name.split('.');
				if(fileCheck[1] === 'png'||
					fileCheck[1] === 'jpeg'||
					fileCheck[1] === 'jpg'){
					console.log('[PROFILE] DEBUG: Downloading Image');
					if(!fs.existsSync(userinfo_path+'/'+message.author.id)){
						fs.mkdirSync(userinfo_path+'/'+message.author.id);
					}
					//console.log('[PROFILE] DEBUG: File URL; '+message.attachments.first().url);
					download(message.attachments.first().url, message.author.id);
				}else{
					message.reply("The file you attached is not a supported type. Please use a PNG, JPG, or JPEG.");
					return;
				}
			}else{
				message.reply("Image not found to create a profile.");
				return;
			}
			var content = 'name:'+args[1]+'\nid:'+args[2];
			if(args[3]){
				content+='\nguild:'+args[3];
			}
			fs.writeFile(userinfo_path+'/'+message.author.id+'/profile_data.txt', content, function(error){
				if(error) console.log(error);
				console.log('[PROFILE] DEBUG: Profile Text created sucessfully')
			});

		}
		
	},
};

function download(url, id){
	request.get(url)
	.on('error', console.error)
	.pipe(fs.createWriteStream(userinfo_path+'/'+id+'/profile_img.png'));
}