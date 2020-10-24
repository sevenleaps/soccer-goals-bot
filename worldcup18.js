module.exports = exports = {
    checkRedditForGoals: checkRedditForGoals,
    getCompetitionName: getCompetitionName,
    setCompetitionGoals: setCompetitionGoals,
    getCompetitionGoals: getCompetitionGoals,
    setChatId: setChatId
};

var reddit = require('redwrap');

var competitionGoals = {};

var COMPETITION = "WORLD_CUP_18";

var chatId;

var WC_TEAMS = [
  "Argentina",
  "Australia",
  "Belgium",
  "Brazil",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Denmark",
  "Egypt",
  "England",
  "France",
  "Germany",
  "Iceland",
  "Iran",
  "Japan",
  "Mexico",
  "Morocco",
  "Nigeria",
  "Panama",
  "Peru",
  "Poland",
  "Portugal",
  "Russia",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tunisia",
  "Uruguay"
];

function getCompetitionName(){
  return COMPETITION;
}

function setChatId(id){
  chatId = id
}

function setCompetitionGoals(goals){
  competitionGoals = goals;
}

function getCompetitionGoals(){
  return competitionGoals;
}

function checkRedditForGoals(storeGoalFunction) {
  reddit.r('soccer').new().limit("100", (err, data, res) => {
    data.data.children.forEach((child) => {
      const linkData = child.data;
      if(linkData.link_flair_text == "Media") {
      // 0-1
      // 0]-[2
      // 3 - 2
      // 2] - [0
      const re = /\d+\]?\ ?\-\ ?\[?\d+/
        if(re.test(linkData.title)){
          if(checkForTeam(linkData.title)){

            var goal = { id : linkData.id,
                        title : linkData.title,
                        url : linkData.url,
                        timestamp : linkData.created_utc};
            storeGoalFunction(goal, COMPETITION, competitionGoals, chatId)
          }
        }
      }
    })
  })
}

function checkForTeam(linkText){
  return WC_TEAMS.some((team) => linkText.toUpperCase().indexOf(team.toUpperCase()) > 0)
}
