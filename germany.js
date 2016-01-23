module.exports = exports = {
    checkRedditForGoals: checkRedditForGoals,
    getCompetitionName: getCompetitionName,
    setCompetitionGoals: setCompetitionGoals,
    getCompetitionGoals: getCompetitionGoals,
    setChannelName: setChannelName
};

var reddit = require('redwrap');

var competitionGoals = {};

var COMPETITION = "BUNDESLIGA";

var channelName;

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
  reddit.r('bundesliga').sort('new').from("week").limit("100", function(err, data, res){
  data.data.children.forEach(function (child){
    var linkData = child.data;
    var re = /\d+\-\d+/;
    if(re.test(linkData.title))
    {
      storeGoalFunction({ id : linkData.id,
                  title : linkData.title,
                  url : linkData.url,
                  timestamp : linkData.created_utc}, COMPETITION, competitionGoals, channelName);
    }
  });
});
}
