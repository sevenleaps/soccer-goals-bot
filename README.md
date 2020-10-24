# Soccer-Goals-Bot #

A telegram bot that parses goals from Reddit. Written in node.js

### What does the bot do? ###

* Connects to reddit and looks on goals for the Premier League and the Bundesliga.

Feel free to add a pull request if you want to add another league!

### How do I run the bot? ###

* [Get a bot API key](https://core.telegram.org/bots#botfather)
* After cloning the project down run a "npm install" to resolve dependancies
* Configure the "BOT_TOKEN" environment variable 
* Run with "node app" and you should then be able to talk to your bot

#### Required Environment Variables ####

Some functionality requires additional environment variables

Storing the goals found in [Firebase](https://www.firebase.com/) requires the following to set

* FIREBASE_JSON=
* FIRE_BASE_ROOT=

Posting to channels requires environment variables to be set. I'll show what we have them set to, but you will need to configure different channels (Note: A bot must be added as a channel admin to post on it)

* BOT_TOKEN=
* BPL_CHAT_ID=
* BUND_CHAT_ID=
* WC_CHAT_ID=
