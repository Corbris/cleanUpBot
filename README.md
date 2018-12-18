# cleanUpBot
Discord clean up bot that will delete messages after x time. 


This bot is using Discord.js, It is very simple with only 1 command. !cleanUp {seconds/stop}
This command will store or remove the channel id the command was from as well as the time interval.
This allows the bot to look at each message, see if it's in a channel that is being "cleaned" and then delete it after x time.

This will not delete any messages from users who have the admin role. 

Future:
  clear a whole channel of messages but pinned messages.

