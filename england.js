module.exports = exports = {
    checkRedditForGoals: checkRedditForGoals,
    getCompetitionName: getCompetitionName,
    setCompetitionGoals: setCompetitionGoals,
    getCompetitionGoals: getCompetitionGoals,
    setChannelName: setChannelName
};

var reddit = require('redwrap');

var competitionGoals = {};

var COMPETITION = "PREMIER_LEAGUE";

var channelName;

var BPLTEAMS = [
  "ASTON VILLA",
  "ARSENAL",
  "BOURNEMOUTH",
  "CHELSEA",
  "CRYSTAL PALACE",
  "EVERTON",
  "LEICESTER",
  "LIVERPOOL",
  "MAN UTD",
  "MAN UNITED",
  "MAN CITY",
  "MANCHESTER",
  "NEWCASTLE",
  "NORWICH",
  "SOUTHAMPTON",
  "STOKE",
  "SUNDERLAND",
  "SWANSEA",
  "TOTTENHAM",
  "SPURS",
  "WATFORD",
  "WEST BROM",
  "WEST HAM"
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
  reddit.r('soccer').sort('new').from("week").limit("100", function(err, data, res){
  data.data.children.forEach(function (child){
    var linkData = child.data;
    if(linkData.link_flair_text == "Media") {
      var re = /\d+\-\d+/;
      if(re.test(linkData.title))
      {
        if(checkForBplTeam(linkData.title)){

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

function checkForBplTeam(linkText){
  var bplTeam = false;
  BPLTEAMS.forEach(function (team){
    if(linkText.toUpperCase().indexOf(team) > 0)
    {
      bplTeam = true;
      return;
    }
  });

  return bplTeam;
}
