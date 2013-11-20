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
		/*EventCandidate.find({}, function(err, results) {
			results.forEach(function(result) {
				var isSameTheme = tweetContainsTheme(result.theme, tweet);
				if (isSameTheme === true) {

				}
			});
		});*/
		EventCandidate.find({theme: {$in: tweet.hashtags}}, function(err, results) {
			results.forEach(function(result) {
				var tmp = result.tweets;
				tmp.push(tweet);
				result.tweets = tmp;
				//****** find out if one tweet can be added to more than one event. MongoDb may throw an error and if it does, I need to modify things.
				result.save(function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log("successfully updated.");
						callback(err, result);
					}
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