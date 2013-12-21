var mongoose = require('mongoose');
var constants = require('./constants.js');
var helpers = require('./../helpers.js');

var findClusters = function(tweets) {
	var map = [];
	tweets.forEach(function(tweet) {
		var tmp = [];
		if(tweet.coordinates) {
			tweets.forEach(function(otherTweet) {
				if(otherTweet.coordinates &&  (helpers.calculateDistance(tweet.coordinates[1], tweet.coordinates[0], 
					otherTweet.coordinates[1], otherTweet.coordinates[0])) < constants.maxDistance) {
					tmp.push(otherTweet);
				}
			});
		}
		map.push(tmp);

	});

	/*var maxNumberTweetsIndex = 0;
	var maxNumberTweets = 0;
	map.forEach(function(e, index) {
		if(e.length > maxNumberTweets) {
			maxNumberTweets = e.length;
			maxNumberTweetsIndex = index;
		}
	});

	return map[maxNumberTweetsIndex];*/
	var clusters = [];
	map.forEach(function(e) {
		if(e.length > 2) {
			clusters.push(e);
		}
	});

	return clusters;
	
}

var simplifiedTweetSchema = mongoose.Schema({
	id: { type: Number },
	createdAt: {type: Date },
	message: {type: String, default: null },
	coordinates:  { type: [Number] },
	hashtags: { type: [String], default: null},
	user_mentions: {type: [String], default: null}
});

var EventCandidateSchema = mongoose.Schema({
	//***** Event can be held at several different locations. We should hold multiple centers.
	centers: {type: []},
	theme: {type: String, default: null, unique: true},
	//***** need to add a map of user_mentions,
	//***** need to add a map of words ordered by frequency of appearance
	tweets: {type: [simplifiedTweetSchema], default: null},
	createdAt: {type: Date},
	updatedAt: {type: Date}
});

EventCandidateSchema.pre('save', true, function(next, done) {
	next();
	var date = new Date();
	this.updatedAt = date;
	if(!this.createdAt) {
		this.createdAt = date;
	}
	done();
});

//***** need to remove duplicates
EventCandidateSchema.pre('save', true, function(next, done) {
	next();
	if (this.tweets.length > 2) {
		var clusters = findClusters(this.tweets);
		if (clusters.length === 0) {
			this.centers = undefined
		} else {
			var centers = [];
			clusters.forEach(function (c) {
				var centerCandidate = helpers.findCenter(c);
				if (centers.length === 0) {
					centers.push(centerCandidate);
				} else {
					centers.forEach(function(center) {
						if(helpers.calculateDistance(centerCandidate[1], centerCandidate[0]
							, center[1], center[0]) > constants.maxDistance) {
							centers.push(centerCandidate);
						}
					});				
				}
			});
			this.centers = centers;
		}
	} else {
		this.center = undefined;
	}

	if(this.isNew && Array.isArray(this.center) && 0 === this.center.length) {
		this.center = undefined;
	}

	done();
});

var Candidate = mongoose.model('EventCandidate', EventCandidateSchema);

module.exports = Candidate;