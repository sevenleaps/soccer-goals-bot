class League {
  constructor (teams, competition, chatId, subReddit, goals, redditService) {
    this.teams = teams
    this.competition = competition
    this.chatId = chatId
    this.subReddit = subReddit
    this.goals = goals
    this.redditService = redditService
  }

  setGoals (goals) {
    this.goals = goals
  }

  isTeamPresent (linkText) {
    return this.teams.some((team) => linkText.toUpperCase().indexOf(team) > 0)
  }

  checkRedditForGoals (storeGoal) {
    const self = this
    self.redditService.retriveGoals(
      self.subReddit,
      self.teams,
      goals => goals.forEach(goal => storeGoal(goal, self.competition, self.goals, self.chatId)))
  }
}

module.exports = exports = {
  League: League
}
