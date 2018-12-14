//0.01 
const Discord = require("discord.js");
var auth = require('./auth.json');
const bot = new Discord.Client();

bot.login(auth.token);
 
bot.on("ready", () => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});

bot.on("message", (message) => {
	if (message.content.indexOf('!') !== 0) return;  //does not start with '!'
	
    const args = message.content.slice(1).trim().split(/ +/g);
    const cmd = args.shift();
	
	
	switch(cmd) 
	{
		case 'cleanUp':
			if(!message.member.permissions.has("ADMINISTRATOR")){message.channel.send("You don not have the permissions to do this."); return;}  //dont have admin.
			if(args.length > 1 || isNaN(parseInt(args[0], 10))){message.channel.send("Request needs to be in the format of **!cleanUp {seconds}**"); return;}  //not in the right form
			if(parseInt(args[0], 10) < 15){message.channel.send("Time needs to be at least 15 seconds"); return;} //need to be at least 15 seconds

			message.channel.send("deleting all messages and each new messages after "+ parseInt(args[0], 10) + " seconds of the post time.");
			//this is valid clear the whole channel for all post but pin post. 
		break;
	}

	//is this message from a channel we want to delete from? (prob just use json, save channel ID and the time.)
		//message.delete(time)
});