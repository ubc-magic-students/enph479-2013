module.exports = function(mongoose) {
    var HashtagCountSchema = new mongoose.Schema({
        hashtag: String,
        count: Number,
        count_change: { type: Number, default: 0 }
    });
    
    var HashtagCount = mongoose.model('HashtagCount', HashtagCountSchema);
    
    var getList = function (callback) {
        HashtagCount.find().exec(callback);
    };
    
    var create = function (array, callback) {
        HashtagCount.create(array, callback);
    };
    
    var remove = function (callback) {
        HashtagCount.remove({}, callback);
    };
    
    var findOne = function (hashtag_name, callback) {
        HashtagCount.findOne({ hashtag: hashtag_name }, callback);
    };
    
    return {
        getList: getList,
        create: create,
        remove: remove,
        findOne: findOne,
        HashtagCount: HashtagCount
    }
}