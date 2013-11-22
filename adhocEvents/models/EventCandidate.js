var mongoose = require('mongoose');
var constants = require('./constants.js');

var calculateDistance = function(latitude1, longitude1, latitude2, longitude2) {
	var conversion = Math.PI/180;
	var lat1 = latitude1 * conversion;
	var lon1 = longitude1 * conversion;
	var lat2 = latitude2 * conversion;
	var lon2 = longitude2 * conversion;
	var R = constants.earthRadius; // km
	return Math.acos(Math.sin(lat1)*Math.sin(lat2) 
		+ Math.cos(lat1)*Math.cos(lat2) * Math.cos(lon2-lon1)) * R;
}

var findCenter = function(tweets) {
    var latSum = 0;
    var lonSum = 0;
    var count = 0;
    tweets.forEach(function(o) {
      latSum += o.coordinates[1];
      lonSum += o.coordinates[0];
      count++;
    });

    return [lonSum/count, latSum/count];
}

var findCluster = function(tweets) {
	var map = [];
	tweets.forEach(function(tweet) {
		var tmp = [];
		if(tweet.coordinates) {
			tweets.forEach(function(otherTweet) {
				if(otherTweet.coordinates &&  (calculateDistance(tweet.coordinates[1], tweet.coordinates[0], 
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
	center: {type: [Number], index: "2dsphere"},
	theme: {type: String, default: null},
	//***** need to add a map of user_mentions,
	//***** need to distinguish between tweets that contribute to location and tweets that don't.
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
		//console.log(findCenter(cluster));
		if (cluster.length <= 2) {
			this.center = undefined;
		} else {
			this.center = findCenter(cluster);
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