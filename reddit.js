const reddit = require('redwrap')

class Reddit {
  constructor () {
    // 0-1
    // 0]-[2
    // 3 - 2
    // 2] - [0
    this.scoreRegex = /\d+]? ?- ?\[?\d+/
  }

  hasTeam (title, teams) {
    return teams.some((team) => title.toUpperCase().indexOf(team) > 0)
  }

  hasScore (title) {
    return this.scoreRegex.test(title)
  }

  retriveGoals (subReddit, teams, processGoals) {
    const self = this
    reddit.r(subReddit).new().limit('100', function (err, data, res) {
      if (err) {
        console.log(err)
      }
      const goals = data.data.children.filter((child) => {
        const post = child.data
        return post.link_flair_text === 'Media' && self.hasScore(post.title) && self.hasTeam(post.title, teams)
      }).map((child) => {
        const post = child.data
        return {
          id: post.id,
          title: post.title,
          url: post.url,
          redditLink: `https://www.reddit.com${post.permalink}`,
          timestamp: post.created_utc
        }
      })

      processGoals(goals)
    })
  }
}

module.exports = exports = {
  Reddit: Reddit
}
