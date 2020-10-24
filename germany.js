module.exports = exports = {
    checkRedditForGoals: checkRedditForGoals,
    getCompetitionName: getCompetitionName,
    setCompetitionGoals: setCompetitionGoals,
    getCompetitionGoals: getCompetitionGoals,
    setChatId: setChatId
};

var reddit = require('redwrap');

var competitionGoals = {};

var COMPETITION = "BUNDESLIGA";

var chatId

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

function checkRedditForGoals(storeGoalFunction)
{
  reddit.r('bundesliga').new().limit("100", function(err, data, res){
  data.data.children.forEach(function (child){
    var linkData = child.data;
    var re = /\d+\-\d+/;
    if(re.test(linkData.title))
    {
      storeGoalFunction({ id : linkData.id,
                  title : linkData.title,
                  url : linkData.url,
                  timestamp : linkData.created_utc}, COMPETITION, competitionGoals, chatId)
    }
  });
});
}
