var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');
var async = require('async');

module.exports = function() {
	var garbageCollectionInterval = 1000*60;
	var candidateLifeTime = 30*60*1000; //30 minutes

	var initGarbageCollection = function() {
		setInterval(function() {
			var time = new Date().getTime()-candidateLifeTime;
			EventCandidate.remove({updatedAt: {"$lte": new Date(time) }}, function(err) {
				if(err) {
					console.log("err while garbage collecting for EventCadidates.");
				} else {
					console.log("Garbage collecting for EventCadidates successful.");
				}
			});
		}, garbageCollectionInterval);
		console.log("Initializing garbage collection.");
	}

	var tweetBelongsToEvent = function(tweet, callback) {
		EventCandidate.find({theme: {$in: tweet.hashtags}}, function(err, events) {
			if(events) {
				var updatedEvents = [];
				var updateEvents = function(item, cb) {
					var tmp = item.tweets;
					tmp.push(tweet);
					item.tweets = tmp;
					item.save(function(err, updatedEventCandidate) {
						if(err) {
							cb(err)
						} else {
							updatedEvents.push(updatedEventCandidate);
							cb(null);
						}
					});
				}

				async.each(events, updateEvents, function(err) {
					callback(err, updatedEvents);
				});
			}
		});
	}

	return {
		tweetBelongsToEvent : tweetBelongsToEvent,
		initGarbageCollection : initGarbageCollection
	}

}();