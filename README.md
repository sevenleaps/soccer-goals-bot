# Soccer-Goals-Bot #

A telegram bot that parses goals from Reddit. Written in node.js

[Bot Link](https://telegram.me/soccer_goals_bot)

### What does the bot do? ###

* Connects to reddit and looks on goals for the Premier League and the Bundesliga. 
* Users can talk to the bot and request goals since today,yesterday or the last week 
* The bot will post the goals as it finds them to following two public channels: [PremierLeague](https://telegram.me/bplGoals) & [Bundesliga](https://telegram.me/bundesligaGoals) 

Feel free to add a pull request if you want to add another league!

### How do I run the bot? ###

* [Get a bot API key](https://core.telegram.org/bots#botfather)
* After cloning the project down run a "npm install" to resolve dependancies
* Configure the "BOT_TOKEN" environment variable 
* Run with "node app" and you should then be able to talk to your bot

#### Optional Environment Variables ####

Some functionality requires additional environment variables

Storing the goals found in [Firebase](https://www.firebase.com/) requires the following to set

example firebase URL - https://example-name-1234.firebaseio.com/

* FIRE_BASE_APP = example-name-1234
* FIRE_BASE_ROOT = anything 


Posting to channels requires environment variables to be set. I'll show what we have them set to, but you will need to configure different channels (Note: A bot must be added as a channel admin to post on it)

* BPL_CHANNEL_NAME = bplGoals
* BUND_CHANNEL_NAME = bundesligaGoals