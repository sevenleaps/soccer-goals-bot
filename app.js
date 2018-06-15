var assert = require('assert');
var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var CronJob = require('cron').CronJob;
var Firebase = require("firebase");

var england = require('./england.js');
var germany = require('./germany.js');
var wc2018 = require('./worldcup18.js');
var common = require('./common.js');
var BotGA = require('./bot_google_analytics');

process.on('uncaughtException', function(err) {
  console.error(err);
});

var BOT_TOKEN = process.env.BOT_TOKEN;
var FIRE_BASE_APP = process.env.FIRE_BASE_APP;
var FIRE_BASE_ROOT = process.env.FIRE_BASE_ROOT;
var BPL_CHANNEL_NAME = process.env.BPL_CHANNEL_NAME;
var BUND_CHANNEL_NAME = process.env.BUND_CHANNEL_NAME;
var WC_CHANNEL_NAME = process.env.WC_CHANNEL_NAME;

var myFirebaseRef;
if(FIRE_BASE_APP && FIRE_BASE_ROOT){
  myFirebaseRef = new Firebase("https://" + FIRE_BASE_APP + ".firebaseio.com/" + FIRE_BASE_ROOT);
}

assert.ok(BOT_TOKEN, 'BOT_TOKEN is missing');


// Setup polling way
var bot = new TelegramBot(BOT_TOKEN, {polling: true});
// var bot = new TelegramBot(BOT_TOKEN);
// bot.setWebHook('https://my-web-root.com/' + bot.token);

common.setBot(bot);
common.setFireBaseRef(myFirebaseRef);
england.setChannelName(BPL_CHANNEL_NAME);
germany.setChannelName(BUND_CHANNEL_NAME);
wc2018.setChannelName(WC_CHANNEL_NAME);

function readFireBaseToLocal()
{
  console.log("Trying to load in goals from Firebase.");
  if(myFirebaseRef){

    myFirebaseRef.once("value", function(data) {
      var goals = data.val();

      if(goals){
        Object.keys(goals).forEach(function(key){
          console.log("Found goals for " + key);
          if(key == england.getCompetitionName()){
            england.setCompetitionGoals(goals[key]);
          }
          else if(key == germany.getCompetitionName()){
            germany.setCompetitionGoals(goals[key]);
          } 
          else if(key == wc2018.getCompetitionName()){
            wc2018.setCompetitionGoals(goals[key]);
          }
        });
      }
    });
  }
  else {
    console.log("No Firebase reference set.");
  }
}

readFireBaseToLocal();

function getChannelLink(channelName){
  return 'https://telegram.me/' + channelName;
}

function getChannelsMessageText() {


  var messageText = "Join the following Channels for notificaitons of goals as we find them:\n\n";

  if(BPL_CHANNEL_NAME)
  {
    messageText = messageText + '- [Premier League](' + getChannelLink(BPL_CHANNEL_NAME) + ')\n';
  }

  if(BUND_CHANNEL_NAME)
  {
    messageText = messageText + '- [Bundesliga](' + getChannelLink(BUND_CHANNEL_NAME) + ')\n';
  }

  if(WC_CHANNEL_NAME)
  {
    messageText = messageText + '- [World cup 2018](' + getChannelLink(WC_CHANNEL_NAME) + ')\n';
  }

  //Remove last line break
  messageText = messageText.slice(0, -1);

  return messageText;
}

function getUseage() {

  var goals = '/goals - See goals from the Premier League.';
  var tore = '/tore - See goals from the Bundesliga.';
  var channels = '/channels - List channels available (Post goals when found).';

  return  [
    goals,
    tore,
    channels
  ].reduce(function (last, match) {
    return last + '\n' + match;
  });
}

new CronJob('0 */1 * * * *', function() {
  console.log('Going to reddit to look for new goals');
  england.checkRedditForGoals(common.storeGoal);
  germany.checkRedditForGoals(common.storeGoal);
  wc2018.checkRedditForGoals(common.storeGoal);
}, null, true, null);

bot.onText(/\/channels/, function(msg, match){
  console.log('/channels');
  BotGA.logBotEvent('channels');
  var messageText = getChannelsMessageText();
  bot.sendMessage(msg.chat.id, messageText, {
    parse_mode: 'Markdown'
  });
});

bot.onText(/\/goals[ ]?(.*)/, function(msg, match){
  BotGA.logBotEvent('goals');
  common.handleGoalsMessage(msg, england.getCompetitionGoals(), '/goals', match, BPL_CHANNEL_NAME);
});

bot.onText(/\/help/, function (msg) {
  console.log('/help');
  BotGA.logBotEvent('help');
  bot.sendMessage(msg.chat.id, getUseage(), {
    parse_mode: 'Markdown'
  });
});

bot.onText(/\/start/, function (msg) {
  console.log('/start');
  BotGA.logBotEvent('start');
  bot.sendMessage(msg.chat.id, getUseage(), {
    parse_mode: 'Markdown'
  });
});

bot.onText(/\/tore[ ]?(.*)/, function(msg, match){
  BotGA.logBotEvent('tore');
  common.handleGoalsMessage(msg, germany.getCompetitionGoals(), '/tore', match, BUND_CHANNEL_NAME);
});
