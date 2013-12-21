var mongoose = require('mongoose');

var HashtagCountSchema = mongoose.Schema({
	hashtags: {type: mongoose.Schema.Types.Mixed, default: null},
	createdAt: {type: Date, expires: 30*60},
	updatedAt: {type: Date}
});

HashtagCountSchema.pre('save', true, function(next, done) {
	next();
	var date = new Date();
	this.updatedAt = date;
	if(!this.createdAt) {
		this.createdAt = date;
	}
	done();
});

module.exports = mongoose.model('HashtagCount', HashtagCountSchema);