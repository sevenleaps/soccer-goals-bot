const reddit = require('redwrap')

class League {
  constructor (teams, competition, chatId, subReddit, goals) {
    this.teams = teams
    this.competition = competition
    this.chatId = chatId
    this.subReddit = subReddit
    this.goals = goals
  }

  setGoals (goals) {
    this.goals = goals
  }

  isTeamPresent (linkText) {
    return this.teams.some((team) => linkText.toUpperCase().indexOf(team) > 0)
  }

  checkRedditForGoals (storeGoal) {
    const self = this
    reddit.r(self.subReddit).new().limit('100', function (err, data, res) {
      if (err) {
        console.log(err)
      }
      data.data.children.forEach(function (child) {
        var linkData = child.data
        if (linkData.link_flair_text === 'Media') {
          // 0-1
          // 0]-[2
          // 3 - 2
          // 2] - [0
          const re = /\d+]? ?- ?\[?\d+/
          if (re.test(linkData.title)) {
            if (self.isTeamPresent(linkData.title)) {
              const goal = {
                id: linkData.id,
                title: linkData.title,
                url: linkData.url,
                redditLink: `https://www.reddit.com${linkData.permalink}`,
                timestamp: linkData.created_utc
              }

              storeGoal(goal, self.competition, self.goals, self.chatId)
            }
          }
        }
      })
    })
  }
}

module.exports = exports = {
  League: League
}
