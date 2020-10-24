const firebase = require("firebase")
require('firebase/database')


function Database(config) {
  this.database = firebase.initializeApp(config.firebase).database()
  this.peilRef = this.database.ref(config.root)
}

Database.prototype.syncGoalsCache = function(updateGoalsCache) {
  this.peilRef.on('value', function(snapshot) {
      updateGoalsCache(snapshot.val())
  })
}

Database.prototype.storeGoal = function(goal, competition, goalDate) {
  const dateRef = this.peilRef.child(competition).child("goals").child(goalDate)
  const goalRef = dateRef.child(goal.id)
  goalRef.set(goal)
}

module.exports = exports = {
  Database: Database
}