
var Ua = require('universal-analytics');
var GA;

var GA_TRACKING_ID = process.env.GA_TRACKING_ID;

if(GA_TRACKING_ID){
  GA = Ua(GA_TRACKING_ID);
}

function logBotEvent(action, label, value){
  if(GA)
  {
    GA.event("Bot Event", action, label, value).send();
  }
}

module.exports = exports = {
    logBotEvent: logBotEvent
};
