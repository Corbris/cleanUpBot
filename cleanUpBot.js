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
			message.channel.send("deleting each new messages after "+ args + " seconds.");
		break;
	}

});
