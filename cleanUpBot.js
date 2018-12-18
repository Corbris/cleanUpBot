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

function isAdmin(message)
{
	if(message.member.permissions.has("ADMINISTRATOR")){return true;}
	return false;
}

function indexChannelJson(message)
{
	for(var i=0; i<channelJSON.channelList.length; i++)
	{
		if(channelJSON.channelList[i].id === message.channel.id)
		{
			return Number(i);
		}
	}
	return -1;
}

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
			var index = indexChannelJson(message);
			
			if(!isAdmin(message)){message.channel.send("You don not have the permissions to do this.").then(msg => {msg.delete(10000)}); return;}  //dont have admin.
			if(args.length > 1 || isNaN(timeInt) && args[0] !== 'stop'){message.channel.send("Request needs to be in the format of **!cleanUp {seconds}**").then(msg => {msg.delete(10000)}); return;}  //not in the right form
			if(timeInt < 15 && args[0] !== 'stop'){message.channel.send("Time needs to be at least 15 seconds").then(msg => {msg.delete(10000)}); return;} //need to be at least 15 seconds
			
			if(args[0] === 'stop')
			{
				message.channel.send("This channel is no longer being cleaned.");
				channelJSON.channelList.splice(index, 1); //delete from json
				fs.writeFile('./Channels.json', JSON.stringify(channelJSON), function (err) {if (err) return console.log(err);}); //write to JSON
				return;
			}
			
			//Is this channel all ready being cleaned, if so we update the time.
			if(index >= 0)
			{
				message.channel.send("Updated time to " + timeInt + " seconds").then(msg => {msg.delete(timeInt*1000)});
				channelJSON.channelList[index].time = timeInt;
				message.delete(timeInt*1000);
				fs.writeFile('./Channels.json', JSON.stringify(channelJSON), function (err) {if (err) return console.log(err);}); //write to JSON
				return;
			}
					
			
			//new channel to be cleaned, add it to the JSON file. 
			message.channel.send("Each new messages after "+ timeInt + " seconds of the post time.").then(msg => {msg.delete(timeInt*1000)});
			channelJSON.channelList.push({"id":message.channel.id,"time":timeInt});
			fs.writeFile('./Channels.json', JSON.stringify(channelJSON), function (err) {if (err) return console.log(err);}); //write to JSON

		break;
	}

	//delete messages if not from an admin.
	var index = indexChannelJson(message);
	if(!isAdmin(message) && index >= 0) //not a admin post and the channel is one that should be cleaned.
	{
		message.delete(parseInt(channelJSON.channelList[index].time, 10)*1000);
		console.log("deleted message");
	}
	
});













