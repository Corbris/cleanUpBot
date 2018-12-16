//0.01 
const Discord = require("discord.js");
var auth = require('./auth.json');
var channelJSON = require('./Channels.json');
var fs = require('fs');
const bot = new Discord.Client();

bot.login(auth.token);
 
bot.on("ready", () => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});

bot.on("message", (message) => {
	var args;
	var cmd;
	
	if (message.content.indexOf('!') === 0)
	{
    args = message.content.slice(1).trim().split(/ +/g);
    cmd = args.shift();
	}
	
	
	switch(cmd) 
	{
		case 'cleanUp':
			timeInt = parseInt(args[0], 10);
			
			if(!message.member.permissions.has("ADMINISTRATOR")){message.channel.send("You don not have the permissions to do this.").then(msg => {msg.delete(20000)}); return;}  //dont have admin.
			if(args.length > 1 || isNaN(timeInt) && args[0] !== 'stop'){message.channel.send("Request needs to be in the format of **!cleanUp {seconds}**").then(msg => {msg.delete(20000)}); return;}  //not in the right form
			if(timeInt < 15 && args[0] !== 'stop'){message.channel.send("Time needs to be at least 15 seconds").then(msg => {msg.delete(20000)}); return;} //need to be at least 15 seconds
			
			if(args[0] === 'stop')
			{
				for(var i=0; i<channelJSON.channelList.length; i++)
				{
				if(channelJSON.channelList[i].id === message.channel.id)
					{
					message.channel.send("This channel is no longer being cleaned.").then(msg => {msg.delete(20000)});
					channelJSON.channelList.splice(i, 1); //delete from json
					fs.writeFile('./Channels.json', JSON.stringify(channelJSON), function (err) {if (err) return console.log(err);}); //write to JSON
					return;
					
					}
				}	
			}
			
			//Is this channel all ready being cleaned, if so we update the time.
			for(var i=0; i<channelJSON.channelList.length; i++)
			{
				if(channelJSON.channelList[i].id === message.channel.id)
				{
					message.channel.send("Updated time to " + timeInt + " seconds").then(msg => {msg.delete(timeInt*1000)});
					channelJSON.channelList[i].time = timeInt;
					message.delete(timeInt*1000);
					fs.writeFile('./Channels.json', JSON.stringify(channelJSON), function (err) {if (err) return console.log(err);}); //write to JSON
					return;
					
				}
			}
			
			
			//new channel to be cleaned, add it to the JSON file. 
			message.channel.send("deleting all messages and each new messages after "+ timeInt + " seconds of the post time.").then(msg => {msg.delete(timeInt*1000)});
			async function clear() 
			{
				const fetched = await message.channel.fetchMessages({limit: 99});
				message.channel.bulkDelete(fetched);
			}
			clear();
			channelJSON.channelList.push({"id":message.channel.id,"time":timeInt});
			fs.writeFile('./Channels.json', JSON.stringify(channelJSON), function (err) {if (err) return console.log(err);}); //write to JSON
			
			
		break;
	}

	//delete messages if not from an admin.
	if(!message.member.permissions.has("ADMINISTRATOR"))
	{
	for(var i=0; i<channelJSON.channelList.length; i++)
	{
		if(channelJSON.channelList[i].id === message.channel.id)
		{
			
			message.delete(parseInt(channelJSON.channelList[i].time, 10)*1000);
			console.log("deleted message");
		}
	}
	}
});