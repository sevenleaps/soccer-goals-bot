var database
var bot

const moment = require('moment')
const Promise = require('bluebird')

const Streamable = require('./streamable.js')

function setBot (theBot) {
  bot = theBot
}

function setDatabase (db) {
  database = db
}

function toDateString (timestamp) {
  return moment(timestamp, 'X').format('YY-MM-DD')
}

const uploadToStreamable = goal => new Promise((resolve, reject) => {
  Streamable.importVideoFromUrl(goal.url, goal.title)
    .then(resp => Streamable.waitForReadyStatus(resp.shortcode), reject)
    .then(video => {
      goal.url = video.url
      resolve(goal)
    }, reject)
    .catch(reject)
})

function storeGoal (goal, competition, competitionGoals, channel) {
  const goalDate = toDateString(goal.timestamp)
  if (!competitionGoals) {
    competitionGoals = {}
  }
  if (!competitionGoals.goals) {
    competitionGoals.goals = {}
  }

  if (!competitionGoals.goals[goalDate]) {
    competitionGoals.goals[goalDate] = {}
  }

  if (!competitionGoals.goals[goalDate][goal.id]) {
    competitionGoals.goals[goalDate][goal.id] = goal

    uploadToStreamable(goal)
      .then(streamableGoal => {
        console.log('Uploaded goal to streamable: ' + goal.title)
        writeToFirebaseAndSendToChannel(streamableGoal, channel, competition, goalDate)
      })
      .catch(() => {
        console.log('Failed to upload goal to streamable: ' + goal.title)
        writeToFirebaseAndSendToChannel(goal, channel, competition, goalDate)
      })
  }
}

var writeToFirebaseAndSendToChannel = (goal, channel, competition, goalDate) => {
  database.storeGoal(goal, competition, goalDate)

  const message = `*${goal.title}*
  ${goal.url}


  [Reddit comments](${goal.redditLink})
  `

  bot.sendMessage(channel, message, { parse_mode: 'Markdown' })
}

module.exports = exports = {
  storeGoal: storeGoal,
  setDatabase: setDatabase,
  setBot: setBot
}
