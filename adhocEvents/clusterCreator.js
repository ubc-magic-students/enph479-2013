var async = require('async');
var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');
var constants = require('./models/constants.js');
var helper = require('./helpers.js');

function ClusterCreator() {
	var searchSimilarTweets = function(currentTweet, callback) {
		//Search for other tweets that have similar traits as this currentTweet.
  		async.series({
  			nearThisTweet: function(cb) {
        		// search mongodb for tweets that are near the currentTweet.
        		console.log(currentTweet.coordinates);
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
        						console.log("geoNear: ");
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
    					console.log("sameHashTags: ");
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
    					console.log("sameUserMentions: ");
    					//console.log(result);
    					cb(null, result);
    				}
    			});
    		} 
    	}, function(err, results) {
    		if(err) {
    			console.log(err) 
    		} else {
    			callback(results, currentTweet);
    		}
    	});
	}

	var createEventCandidate = function(queryResults, currentTweet) {
		var tempUnion = helper.union(queryResults.nearThisTweet, queryResults.sameHashTags);
        var possibleEvent = helper.union(tempUnion, queryResults.sameUserMentions);

		//If there are enough tweets in possibleEvent array, save as EventCandidate.
        if (possibleEvent.length >= 2) {
          var center = undefined;
          if (queryResults.nearThisTweet.length > 0) {
            center = helper.findCenter(queryResults.nearThisTweet.concat(currentTweet));
          }
          console.log("center: " + center);
          possibleEvent.push(currentTweet);
          //console.log(possibleEvent);
          EventCandidate.create( {
            center: center,
            tweets: possibleEvent,
            createdAt: new Date()
          }, function(err, newEvent) {
            if(err) {
              console.log(err);
            } else {
              console.log("event candidate saved");
              console.log(newEvent);
            }
          });
        }
	}

	return {
		createEventCandidate : createEventCandidate,
		searchSimilarTweets : searchSimilarTweets
	}

}

module.exports = new ClusterCreator();