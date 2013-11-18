var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');

module.exports = function() {
	var garbageCollectionInterval = 1000*60;
	var candidateLifeTime = 30*60*1000; //30 minutes
	setTimeout(function() {
		var now = new Date().getTime()-candidateLifeTime;
		EventCandidate.remove({updatedAt: {"$lte": new Date(now) }}, function(err) {
			if(err) {
				console.log("err while garbage collecting for EventCadidates.");
			} else {
				console.log("Garbage collecting for EventCadidates successful.");
			}
		});
	}, garbageCollectionInterval);

	var tweetBelongsToEvent = function(tweet, callback) {
		EventCandidate.find({}, function(err, results) {
			results.forEach(function(result) {
				if(result.center 
					&& (helpers.calculateDistance(tweet.coordinates[1], tweet.coordinates[0]
						, result.center[1], result.center[0]) < constants.maxDistance)
					&& tweetContainsTheme(result.theme, tweet)) {
					//***** append current tweet into geoRelated
				} else if(tweetContainsTheme(result.theme, tweet)) {
					//***** append current tweet into hashtagRelated
				}
			});
		});
	}

	var tweetContainsTheme = function(theme, tweet) {
		tweet.hashtags.forEach(function(h) {
			if(theme === h) {
				return true;
			}
		});
		return false;
	}

	return {
		tweetBelongsToEvent : tweetBelongsToEvent
	}

}();