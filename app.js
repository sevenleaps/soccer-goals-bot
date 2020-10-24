const assert = require('assert');
const TelegramBot = require('node-telegram-bot-api');
const CronJob = require('cron').CronJob;
const Database = require('./database.js').Database
const england = require('./england.js');
const germany = require('./germany.js');
const wc2018 = require('./worldcup18.js');
const common = require('./common.js');

process.on('uncaughtException', function(err) {
  console.error(err)
})

const BOT_TOKEN = process.env.BOT_TOKEN;
const FIRE_BASE_ROOT = process.env.FIRE_BASE_ROOT;
const FIREBASE_JSON = process.env.FIREBASE_JSON
const BPL_CHAT_ID = process.env.BPL_CHAT_ID;
const BUND_CHAT_ID = process.env.BUND_CHAT_ID;
const WC_CHAT_ID = process.env.WC_CHAT_ID;


assert.ok(BOT_TOKEN, 'BOT_TOKEN is missing')
assert.ok(FIREBASE_JSON, 'FIREBASE_JSON is missing')
assert.ok(FIRE_BASE_ROOT, 'FIRE_BASE_ROOT is missing')
assert.ok(BPL_CHAT_ID, 'BPL_CHAT_ID is missing')
assert.ok(BUND_CHAT_ID, 'BUND_CHAT_ID is missing')
assert.ok(WC_CHAT_ID, 'WC_CHAT_ID is missing')

const firebaseJson = JSON.parse(FIREBASE_JSON)

const database = new Database({
  "firebase": firebaseJson,
  "root": "Peil"
})

const bot = new TelegramBot(BOT_TOKEN, {polling: true});

common.setBot(bot);
common.setDatabase(database);
england.setChatId(BPL_CHAT_ID);
germany.setChatId(BUND_CHAT_ID);
wc2018.setChatId(WC_CHAT_ID);

function cacheGoals(goals) {
  Object.keys(goals).forEach((competitionName) => {
    console.log("Load goal cache for " + competitionName);
    if (competitionName == england.getCompetitionName()){
      england.setCompetitionGoals(goals[competitionName]);
    }
    else if (competitionName == germany.getCompetitionName()){
      germany.setCompetitionGoals(goals[competitionName]);
    } 
    else if (competitionName == wc2018.getCompetitionName()){
      wc2018.setCompetitionGoals(goals[competitionName]);
    }
  })
}

database.syncGoalsCache(cacheGoals)

new CronJob('0 */1 * * * *', function() {
  console.log('Going to reddit to look for new goals');
  england.checkRedditForGoals(common.storeGoal);
  // germany.checkRedditForGoals(common.storeGoal);
  // wc2018.checkRedditForGoals(common.storeGoal);
}, null, true, null);
