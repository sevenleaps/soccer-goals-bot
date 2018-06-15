module.exports = exports = {
    checkRedditForGoals: checkRedditForGoals,
    getCompetitionName: getCompetitionName,
    setCompetitionGoals: setCompetitionGoals,
    getCompetitionGoals: getCompetitionGoals,
    setChannelName: setChannelName
};

var reddit = require('redwrap');

var competitionGoals = {};

var COMPETITION = "WORLD_CUP_18";

var channelName;

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

function setChannelName(channel){
  channelName = channel;
}

function setCompetitionGoals(goals){
  competitionGoals = goals;
}

function getCompetitionGoals(){
  return competitionGoals;
}

function checkRedditForGoals(storeGoalFunction)
{
  reddit.r('soccer').new().limit("100", function(err, data, res){
  data.data.children.forEach(function (child){
    var linkData = child.data;
    if(linkData.link_flair_text == "Media") {
      var re = /\d+\]?\-\[?\d+/;
      if(re.test(linkData.title))
      {
        if(checkForTeam(linkData.title)){

          var goal = { id : linkData.id,
                      title : linkData.title,
                      url : linkData.url,
                      timestamp : linkData.created_utc};
          storeGoalFunction(goal, COMPETITION, competitionGoals, channelName);
        }
      }
    }
  });
});
}

function checkForTeam(linkText){
  return WC_TEAMS.some(function (team) {
    return (linkText.toUpperCase().indexOf(team.toUpperCase()) > 0)
  });
}
