var mongoose = require('mongoose');
var Tweet = require('./TweetObject.js');

var EventCandidateSchema = mongoose.Schema({
	center: {type: [Number], index: "2dsphere"},
	//***** need to add hash tags aggregated,
	//***** need to add user_mentions aggregated
	tweets: {type: [Tweet.schema], default: null},
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