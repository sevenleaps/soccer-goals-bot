const assert = require('assert')
const TelegramBot = require('node-telegram-bot-api')
const CronJob = require('cron').CronJob
const Database = require('./database.js').Database
const League = require('./league.js').League
const Reddit = require('./reddit.js').Reddit
const germany = require('./germany.js')
const common = require('./common.js')

process.on('uncaughtException', (err) => console.error(err))

const BOT_TOKEN = process.env.BOT_TOKEN
const FIRE_BASE_ROOT = process.env.FIRE_BASE_ROOT
const FIREBASE_JSON = process.env.FIREBASE_JSON
const BPL_CHAT_ID = process.env.BPL_CHAT_ID
const BUND_CHAT_ID = process.env.BUND_CHAT_ID
const WC_CHAT_ID = process.env.WC_CHAT_ID

assert.ok(BOT_TOKEN, 'BOT_TOKEN is missing')
assert.ok(FIREBASE_JSON, 'FIREBASE_JSON is missing')
assert.ok(FIRE_BASE_ROOT, 'FIRE_BASE_ROOT is missing')
assert.ok(BPL_CHAT_ID, 'BPL_CHAT_ID is missing')
assert.ok(BUND_CHAT_ID, 'BUND_CHAT_ID is missing')
assert.ok(WC_CHAT_ID, 'WC_CHAT_ID is missing')

const firebaseConfig = JSON.parse(FIREBASE_JSON)

const database = new Database({
  firebase: firebaseConfig,
  root: 'Peil'
})

const bot = new TelegramBot(BOT_TOKEN, { polling: true })
const redditService = new Reddit()

common.setBot(bot)
common.setDatabase(database)

const england = new League([
  'ARSENAL',
  'ASTON VILLA',
  'AVL',
  'BRENTFORD',
  'BRIGHTON',
  'BURNLEY',
  'CHELSEA',
  'CRYSTAL PALACE',
  'EVERTON',
  'FULHAM',
  'LEEDS',
  'LEE',
  'LEICESTER',
  'LIVERPOOL',
  'MAN UTD',
  'MAN UNITED',
  'MAN CITY',
  'MANCHESTER',
  'NEWCASTLE',
  'NORWICH',
  'SHEFFIELD UNITED',
  'SOUTHAMPTON',
  'TOTTENHAM',
  'SPURS',
  'WATFORD',
  'WEST BROM',
  'WEST BROMWICH ALBION',
  'WEST HAM',
  'WEST HAM UNITED',
  'WOLVES',
  'WOLVERHAMPTON WANDERERS'
], 'PREMIER_LEAGUE', BPL_CHAT_ID, 'soccer', {}, redditService)

const worldCup2018 = new League([
  'Argentina',
  'Australia',
  'Belgium',
  'Brazil',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Denmark',
  'Egypt',
  'England',
  'France',
  'Germany',
  'Iceland',
  'Iran',
  'Japan',
  'Mexico',
  'Morocco',
  'Nigeria',
  'Panama',
  'Peru',
  'Poland',
  'Portugal',
  'Russia',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Tunisia',
  'Uruguay'
], 'WORLD_CUP_18', WC_CHAT_ID, 'soccer', {}, redditService)

function cacheGoals (goals) {
  Object.keys(goals).forEach((competition) => {
    console.log(`Load goal cache for ${competition}`)
    if (competition === england.competition) {
      england.setGoals(goals[competition])
    } else if (competition === germany.getCompetitionName()) {
      germany.setCompetitionGoals(goals[competition])
    } else if (competition === worldCup2018.competition) {
      worldCup2018.setGoals(goals[competition])
    }
  })
}

database.syncGoalsCache(cacheGoals)

const fetchJob = new CronJob('0 */1 * * * *', () => {
  console.log('Going to reddit to look for new goals')
  england.checkRedditForGoals(common.storeGoal)
  // germany.checkRedditForGoals(common.storeGoal)
  // worldCup2018.checkRedditForGoals(common.storeGoal)
}, null, false, 'UTC')

fetchJob.start()
