var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');

module.exports = function() {
	var garbageCollectionInterval = 1000*60;
	var candidateLifeTime = 30*60*1000; //30 minutes

	var initGarbageCollection = function() {
		setTimeout(function() {
			var time = new Date().getTime()-candidateLifeTime;
			EventCandidate.remove({updatedAt: {"$lte": new Date(time) }}, function(err) {
				if(err) {
					console.log("err while garbage collecting for EventCadidates.");
				} else {
					console.log("Garbage collecting for EventCadidates successful.");
				}
			});
		}, garbageCollectionInterval);
	}

	var tweetBelongsToEvent = function(tweet, callback) {
		EventCandidate.find({theme: {$in: tweet.hashtags}}, function(err, results) {
			//*********** Instead of forEach, refer to async.each
			results.forEach(function(result) {
				var tmp = result.tweets;
				tmp.push(tweet);
				result.tweets = tmp;
				result.save(function(err, updatedEventCandidate) {
					if(!err) {
						console.log("successfully updated.");
					}
					callback(err, updatedEventCandidate);
				});
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