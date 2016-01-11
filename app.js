var assert = require('assert');
var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var CronJob = require('cron').CronJob;
var Q = require("q");
var Firebase = require("firebase");

var england = require('./england.js');
var germany = require('./germany.js');
var common = require('./common.js');

var BOT_TOKEN = process.env.BOT_TOKEN;
var FIRE_BASE_APP = process.env.FIRE_BASE_APP;
var FIRE_BASE_ROOT = process.env.FIRE_BASE_ROOT;
var BPL_CHANNEL_NAME = process.env.BPL_CHANNEL_NAME;
var BUND_CHANNEL_NAME = process.env.BUND_CHANNEL_NAME;

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

function readFireBaseToLocal()
{
  if(myFirebaseRef){

    myFirebaseRef.once("value", function(data) {
      var goals = data.val();

      if(goals){
        Object.keys(goals).forEach(function(key){
          if(key == england.getCompetitionName()){
            england.setCompetitionGoals(goals[key]);
          }
          else if(key == germany.getCompetitionName()){
            germany.setCompetitionGoals(goals[key]);
          }
        });
      }
    });
  }
}

readFireBaseToLocal();

function getUseage() {
  var goals = '*/goals* - See goals from the Premier League';
  var tore = '*/tore* - See goals from the Bundesliga';

  return  [
    goals,
    tore
  ].reduce(function (last, match) {
    return last + '\n' + match;
  });
}

new CronJob('0 */1 * * * *', function() {
  console.log('Going to reddit to look for new goals');
  england.checkRedditForGoals(common.storeGoal);
  germany.checkRedditForGoals(common.storeGoal);
}, null, true, null);

bot.onText(/\/goals[ ]?(.*)/, function(msg, match){
  console.log('/goals');
  common.handleGoalsMessage(msg, england.competitionGoals, '/goals');
});

bot.onText(/\/help/, function (msg) {
  console.log('/help');
  bot.sendMessage(msg.chat.id, getUseage(), {
    parse_mode: 'Markdown'
  });
});

bot.onText(/\/start/, function (msg) {
  console.log('/start');
  bot.sendMessage(msg.chat.id, getUseage(), {
    parse_mode: 'Markdown'
  });
});

bot.onText(/\/tore[ ]?(.*)/, function(msg, match){
  common.handleGoalsMessage(msg, germany.competitionGoals, '/tore');
});
