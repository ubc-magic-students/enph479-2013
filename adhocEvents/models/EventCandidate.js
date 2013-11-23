var mongoose = require('mongoose');
var constants = require('./constants.js');
var helpers = require('./../helpers.js');

var findCluster = function(tweets) {
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

	var maxNumberTweetsIndex = 0;
	var maxNumberTweets = 0;
	map.forEach(function(e, index) {
		if(e.length > maxNumberTweets) {
			maxNumberTweets = e.length;
			maxNumberTweetsIndex = index;
		}
	});

	return map[maxNumberTweetsIndex];
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
	center: {type: [Number], index: "2dsphere"},
	theme: {type: String, default: null},
	//***** need to add a map of user_mentions,
	//***** need to add a map of words ordered by frequency of appearance
	tweets: {type: [simplifiedTweetSchema], default: null},
	createdAt: {type: Date},
	updatedAt: {type: Date}
});

EventCandidateSchema.index({
	center: '2dsphere'
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

EventCandidateSchema.pre('save', true, function(next, done) {
	next();
	if (this.tweets.length > 2) {
		var cluster = findCluster(this.tweets);
		//console.log(cluster);
		//console.log(helpers.findCenter(cluster));
		if (cluster.length <= 2) {
			this.center = undefined;
		} else {
			this.center = helpers.findCenter(cluster);
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