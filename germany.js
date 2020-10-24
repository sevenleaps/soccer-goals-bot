const reddit = require('redwrap')

var competitionGoals = {}

const COMPETITION = 'BUNDESLIGA'

var chatId

function getCompetitionName () {
  return COMPETITION
}

function setChatId (id) {
  chatId = id
}

function setCompetitionGoals (goals) {
  competitionGoals = goals
}

function getCompetitionGoals () {
  return competitionGoals
}

function checkRedditForGoals (storeGoal) {
  reddit.r('bundesliga').new().limit('100', (err, data, res) => {
    if (err) {
      console.log(err)
    }
    data.data.children.forEach((child) => {
      const linkData = child.data
      // 0-1
      // 0]-[2
      // 3 - 2
      // 2] - [0
      const re = /\d+]? ?- ?\[?\d+/

      if (re.test(linkData.title)) {
        const goal = {
          id: linkData.id,
          title: linkData.title,
          url: linkData.url,
          redditLink: `https://www.reddit.com${linkData.permalink}`,
          timestamp: linkData.created_utc
        }

        storeGoal(goal, COMPETITION, competitionGoals, chatId)
      }
    })
  })
}

module.exports = exports = {
  checkRedditForGoals: checkRedditForGoals,
  getCompetitionName: getCompetitionName,
  setCompetitionGoals: setCompetitionGoals,
  getCompetitionGoals: getCompetitionGoals,
  setChatId: setChatId
}
