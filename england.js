const reddit = require('redwrap')

var competitionGoals = {};

const COMPETITION = "PREMIER_LEAGUE";

var chatId;

const BPL_TEAMS = [
  "ARSENAL",
  "ASTON VILLA",
  "AVL",
  "BRIGHTON",
  "BURNLEY",  
  "CHELSEA",
  "CRYSTAL PALACE",
  "EVERTON",
  "FULHAM",
  "LEEDS",
  "LEE",
  "LEICESTER",
  "LIVERPOOL",
  "MAN UTD",
  "MAN UNITED",
  "MAN CITY",
  "MANCHESTER",
  "NEWCASTLE",
  "SHEFFIELD UNITED",
  "SOUTHAMPTON",
  "TOTTENHAM",
  "SPURS",
  "WEST BROM",
  "WEST BROMWICH ALBION",
  "WEST HAM",
  "WEST HAM UNITED",
  "WOLVES",
  "WOLVERHAMPTON WANDERERS"
];

function getCompetitionName(){
  return COMPETITION;
}

function setChatId(id){
  chatId = id;
}

function setCompetitionGoals(goals){
  competitionGoals = goals;
}

function getCompetitionGoals(){
  return competitionGoals;
}

function checkRedditForGoals(storeGoal) {
  reddit.r('soccer').new().limit("100", function(err, data, res){
  data.data.children.forEach(function (child){
    var linkData = child.data;
    if(linkData.link_flair_text == "Media") {

      // 0-1
      // 0]-[2
      // 3 - 2
      // 2] - [0
      const re = /\d+\]?\ ?\-\ ?\[?\d+/
      if(re.test(linkData.title)) {
        if(checkForBplTeam(linkData.title)){

          var goal = { id : linkData.id,
                      title : linkData.title,
                      url : linkData.url,
                      timestamp : linkData.created_utc}

          storeGoal(goal, COMPETITION, competitionGoals, chatId)
        }
      }
    }
  })
})
}

function checkForBplTeam(linkText){
  return BPL_TEAMS.some((team) => linkText.toUpperCase().indexOf(team) > 0)
}

module.exports = exports = {
  checkRedditForGoals: checkRedditForGoals,
  getCompetitionName: getCompetitionName,
  setCompetitionGoals: setCompetitionGoals,
  getCompetitionGoals: getCompetitionGoals,
  setChatId: setChatId
}
