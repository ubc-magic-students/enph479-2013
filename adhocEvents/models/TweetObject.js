var mongoose = require('mongoose');

var tweetObjectSchema = mongoose.Schema({
	id: { type: Number, unique: true },
	createdAt: {type: Date, expires: 30*60},
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

tweetObjectSchema.pre('save', function(next) {
	if(this.isNew && Array.isArray(this.coordinates) && 0 === this.coordinates.length) {
		this.coordinates = undefined;
	}
	if(!this.createdAt) {
		this.createdAt = new Date();
	}
	next();
});

var Tweet = mongoose.model('Tweet', tweetObjectSchema);

module.exports = Tweet;