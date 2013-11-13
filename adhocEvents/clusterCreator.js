var async = require('async');
var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');
var constants = require('./models/constants.js');
var helpers = require('./helpers.js');

module.exports = function() {

    var minNumTweets = 5;

    var setMinNumTweets = function(num) {
        minNumTweets = num;
    };

    var createEventCandidate = function(queryResults, center, callback) {
        var tempUnion = helpers.union(queryResults.nearThisTweet, queryResults.sameHashTags);
        var possibleEvent = helpers.union(tempUnion, queryResults.sameUserMentions);

        //If there are enough tweets in possibleEvent array, save as EventCandidate.
        if (possibleEvent.length >= minNumTweets) {
          EventCandidate.create( {
            center: center,
            tweets: possibleEvent,
            createdAt: new Date()
          }, function(err, newEvent) {
            if(!err) {
              console.log("event candidate saved");
            }
              //console.log(newEvent);
              callback(err, newEvent);
            
          });
        }
    }

	var searchSimilarTweets = function(currentTweet, callback) {
		//Search for other tweets that have similar traits as this currentTweet.
  		async.series({
  			nearThisTweet: function(cb) {
        		// search mongodb for tweets that are near the currentTweet.
        		if (currentTweet.coordinates) {
        			Tweet.find()
        				.near('coordinates', {
        					center: currentTweet.coordinates, 
        					spherical: true, 
        					maxDistance: constants.maxDistance/constants.earthRadius,
        					distanceMultiplier: constants.earthRadius
        				}).exec(function(err, result) {
        					if(err) {
        						console.log(err);
        					} else {
        						//console.log("geoNear: ");
        						//console.log(result);
        						cb(null, result);
        					}

        				})
        		} else {
        			cb(null, []);
        		}
    		},
    		sameHashTags: function(cb) {
    			console.log(currentTweet.hashtags);
    			Tweet.find({ hashtags: {$in : currentTweet.hashtags}}, function(err, result) {
    				if(err) {
    					console.log(err);
    				} else {
    					//console.log("sameHashTags: ");
    					//console.log(result);
    					cb(null, result);
    				}
    			});
    		},
    		sameUserMentions: function(cb) {
    			Tweet.find({ user_mentions: {$in : currentTweet.user_mentions}}, function(err, result) {
    				if(err) {
    					console.log(err);
    				} else {
    					//console.log("sameUserMentions: ");
    					//console.log(result);
    					cb(null, result);
    				}
    			});
    		} 
    	}, function(err, results) {
            //console.log(results);
            var center = undefined;
            if (results.nearThisTweet.length > 0) {
                center = helpers.findCenter(results.nearThisTweet);
            }
            callback(err, center, results);
    	});
	}

	return {
		searchSimilarTweets : searchSimilarTweets,
        createEventCandidate : createEventCandidate,
        setMinNumTweets : setMinNumTweets
	}

}();