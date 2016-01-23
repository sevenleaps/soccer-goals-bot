module.exports = exports = {
    handleGoalsMessage: handleGoalsMessage,
    storeGoal: storeGoal,
    setFireBaseRef: setFireBaseRef,
    setBot: setBot
};

var myFirebaseRef;
var bot;

var moment = require('moment');
var Q = require("q");

function setBot(theBot){
  bot = theBot;
}

function setFireBaseRef(firebaseRef){
  myFirebaseRef = firebaseRef;
}

function handleGoalsMessage(msg, goals, command, match){

  var chatId = msg.chat.id;

  if(match && match.length > 0 && match[1] !== "")
  {
    var timePeriod = match[1];
    var filteredGoals = getGoalsForTimePeriod(goals, timePeriod);
    displayGoals(chatId, filteredGoals);
  }
  else {
    var kb = {
        keyboard: [
            [command + ' today'],
            [command + ' yesterday'],
            [command + ' week']
        ],
        one_time_keyboard: true,
        selective : true
    };
    bot.sendMessage(chatId, "When do you want the goals from?", {reply_markup :kb,
                                                                  reply_to_message_id: msg.message_id
                                                                });
  }
}

function convertTimeStampToDateString(timestamp)
{
  var date = moment(timestamp, "X");
  return date.format("YY-MM-DD");
}

function convertTimePeriodToDates(timePeriod) {
  var days = [0];
  if ( timePeriod === 'yesterday') {
    days = [1];
  } else if (timePeriod === 'week') {
    days = [0,1,2,3,4,5,6];
  }
  return days.map(function formatDate(daysAgo) {
    return moment().subtract(daysAgo, 'days').format("YY-MM-DD");
  });
}

function getGoalsForTimePeriod(competitionGoals, timePeriod) {
  var dates = convertTimePeriodToDates(timePeriod);
  var goals = [];

  dates.forEach(function populateGoals(date) {
    var hasGoalsForDate = competitionGoals.goals && competitionGoals.goals[date];
    if (hasGoalsForDate) {
      goals.push.apply(goals, Object.keys(competitionGoals.goals[date]).map(function (goalKey) {
        return competitionGoals.goals[date][goalKey];
      }));
    }
  });
  // sort goals by date
  goals = goals.sort(function sortGoals(goala, goalb){
    return goala.timestamp - goalb.timestamp;
  });

  return goals;
}

function displayGoals(chatId, goals)
{
  var hasGoals = goals.length > 0;
  if (hasGoals) {
    var promise = Q();

    goals.forEach(function(goal){
        promise = promise.then(function(){ return bot.sendMessage(chatId, goal.title + " " + goal.url); }); // or .bind
    });
  } else {
    bot.sendMessage(chatId, "Didn't find any goals for this time period.");
  }
}

function storeGoal(goal, competition, competitionGoals, channel){
  var newGoal = false;
  var goalDate = convertTimeStampToDateString(goal.timestamp);

  if(!competitionGoals || !competitionGoals.goals)
  {
    competitionGoals = {
      goals : {}
    };
  }

  if(!competitionGoals.goals[goalDate])
  {
    competitionGoals.goals[goalDate] = {};
  }

  if(!competitionGoals.goals[goalDate][goal.id]){
    competitionGoals.goals[goalDate][goal.id] = goal;
    newGoal = true;
  }

  if(newGoal){
    if(myFirebaseRef){
      var dateRef = myFirebaseRef.child(competition).child("goals").child(goalDate);

      var goalRef = dateRef.child(goal.id);
      goalRef.set(goal);
    }

    if(channel)
    {
      bot.sendMessage("@" + channel, goal.title + " " + goal.url);
    }
  }
}
