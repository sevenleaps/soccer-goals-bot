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

function checkRedditForGoals(storeGoal)
{
  reddit.r('bundesliga').new().limit("100", function(err, data, res){
  data.data.children.forEach(function (child){
    var linkData = child.data;
    var re = /\d+\-\d+/;

    if(re.test(linkData.title))
    {
      const goal = { id : linkData.id,
        title : linkData.title,
        url : linkData.url,
        redditLink: `https://www.reddit.com${linkData.permalink}`,
        timestamp : linkData.created_utc}

      storeGoal(goal, COMPETITION, competitionGoals, chatId)
    }
  });
});
}
