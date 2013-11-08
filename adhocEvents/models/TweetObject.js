module.exports = function(mongoose) {

	var tweetObjectSchema = mongoose.Schema({
		id: { type: Number, unique: true },
		timestamp: {type: Date, default: new Date()},
		message: {type: String, default: "" },
		longitude: {type: Number, default: -1},
		latitude: {type: Number, default: -1},
		polarity: {type: Number, default: -1},
	});

	var Tweet = mongoose.model('Tweet', tweetObjectSchema);

	var getList = function (callback) {
        Tweet.find().exec(callback);
    };
    
    var create = function (array, callback) {
        Tweet.create(array, callback);
    };
    
    var remove = function (callback) {
        Tweet.remove({}, callback);
    };
    
    var findOne = function (hashtag_name, callback) {
        Tweet.findOne({ hashtag: hashtag_name }, callback);
    };

	return {
		getList: getList,
        create: create,
        remove: remove,
        findOne: findOne,
		Tweet: Tweet
	}
}