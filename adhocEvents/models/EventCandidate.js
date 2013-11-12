var mongoose = require('mongoose');
var Tweet = require('./TweetObject.js');

var EventCandidateSchema = mongoose.Schema({
	//***** need to add center lat/long,
	//***** need to add hash tags aggregated,
	//***** need to add user_mentions aggregated
	tweets: {type: [Tweet.schema], default: null},
	createdAt: {type: Date, default: new Date()/*, expires: */}
});

var Candidate = mongoose.model('EventCandidate', EventCandidateSchema);

module.exports = Candidate;