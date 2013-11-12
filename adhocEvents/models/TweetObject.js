var mongoose = require('mongoose');

var tweetObjectSchema = mongoose.Schema({
	id: { type: Number, unique: true },
	//createdAt: {type: Date, expires: 5, default: new Date()},
	createdAt: {type: Date, default: new Date()},
	message: {type: String, default: null },
	coordinates:  {
		index: '2dsphere',
		type: [Number],
	},
	hashtags: { type: [String], default: null},
	user_mentions: {type: [String], default: null}
});

tweetObjectSchema.index({
	coordinates: '2dsphere'
})

var Tweet = mongoose.model('Tweet', tweetObjectSchema);

module.exports = Tweet;