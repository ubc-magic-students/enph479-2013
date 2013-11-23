var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');
var async = require('async');

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
		EventCandidate.find({theme: {$in: tweet.hashtags}}, function(err, events) {
			var updatedEvents = [];
			var updateEvents = function(item, cb) {
				var tmp = item.tweets;
				tmp.push(tweet);
				item.tweets = tmp;
				item.save(function(err, updatedEventCandidate) {
					updatedEvents.push(updatedEventCandidate);
					cb(err);
				});
			}

			async.each(events, updateEvents, function(err) {
				if(!err) {
					console.log("All successfully updated.");
				}
				callback(err, updatedEvents);
			});;

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
		tweetBelongsToEvent : tweetBelongsToEvent,
		initGarbageCollection : initGarbageCollection
	}

}();