var mongoose = require('mongoose');
var Tweet = require('./TweetObject.js');

var EventCandidateSchema = mongoose.Schema({
	center: {type: [Number], index: "2dsphere"},
	//***** need to add a map of hash tags,
	//***** need to add a map of user_mentions,
	//***** need to distinguish between tweets that contribute to location and tweets that don't.
	//***** need to add a map of words ordered by frequency of appearance
	tweets: 
		{
			geoRelated: {type: [Tweet.schema], default: null},
			hashtagRelated: {type: [Tweet.schema], default: null},
			atsRelated: {type: [Tweet.schema], default: null}
		},
	createdAt: {type: Date, default: new Date()/*, expires: */}
});

EventCandidateSchema.pre('save', function(next) {
	if(this.isNew && Array.isArray(this.center) && 0 === this.center.length) {
		this.center = undefined;
	}
	next();
});

var Candidate = mongoose.model('EventCandidate', EventCandidateSchema);

module.exports = Candidate;