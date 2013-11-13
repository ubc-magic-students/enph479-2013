//Connect to mongoose
var mongoose = require('mongoose');


var Tweet = require('./../models/TweetObject.js');
var EventCandidate = require('./../models/EventCandidate.js');
var helper = require('./../helpers.js');
var constants = require('./../models/constants.js');
var async = require('async');


exports.setUp =function (callback) {
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
	db.once('open', function() {
		console.log('Connected to mongodb database');
	});

	async.series([
		function(cb) {
			Tweet.remove({}, function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("Removed all docs for tweets.");
					cb(null, null);
				}
			});
		},

		function(cb) {
			EventCandidate.remove({}, function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("Removed all docs for EventCandidate.");
					cb(null, null);
				}
			});
		},

		function(cb) {
			var objects = [
			{
				id: 1, 
				createdAt: new Date(), 
				message: "message 1", 
				coordinates: [-123.11861873, 49.28306049],
				hashtags: ["test1", "test2"],
				user_mentions: ["user1"]
			},
			{
				id: 2, 
				createdAt: new Date(), 
				message: "message 2", 
				coordinates: [-123.11862873, 49.28205049],
				hashtags: ["test2", "test3"],
				user_mentions: ["user2"]
			},
			{
				id: 3, 
				createdAt: new Date(), 
				message: "message 3", 
				coordinates: [-123.11662473, 49.28305239],
				hashtags: ["test1", "test3"],
				user_mentions: ["user2, user3"]
			},
			{
				id: 4, 
				createdAt: new Date(), 
				message: "message 4", 
				coordinates: undefined,
				hashtags: ["test1", "test4"],
				user_mentions: ["user4, user5"]
			},
			{
				id: 5, 
				createdAt: new Date(), 
				message: "message 5", 
				coordinates: undefined,
				hashtags: ["test5"],
				user_mentions: []
			}];
			Tweet.create(objects, function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("Objects are saved.");
					cb(null, null);
				}
			});
		}

		], 
		function(err, results) {
			console.log("Database is initialized.");
			callback();
		});
}

exports.tearDown = function(callback) {
	mongoose.disconnect(function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Database disconnected.");
			callback();
		}
	});
}

exports.test_findCenter = function(test) {
	Tweet.find()
	.near('coordinates', {
		center: [-123.11862873, 49.28305049], 
		spherical: true, 
		maxDistance: 50/constants.earthRadius,
		distanceMultiplier: constants.earthRadius
	}).exec(function(err, result) {
		if(err) {
			console.log(err);
		} else {
			var center = helper.findCenter(result)
			test.strictEqual( -123.11795739666667, center[0], "Center lon does not equal the actual value.");
			test.strictEqual( 49.28272112333334, center[1], "Center lat does not equal the actual value.");
			test.done();
		}
	});
}

exports.test_clusterCreator = function(test) {
	var clusterCreator = require('./../clusterCreator.js');
	clusterCreator.setMinNumTweets(3);
	Tweet.findOne({id: 1}, function(err, result) {
		if(err) {
			console.log(err);
		} else {
			clusterCreator.searchSimilarTweets(result, function(err, center, results) {
				if(err) {
					console.log(err);
				}
				test.strictEqual( -123.11795739666667, center[0], "Center lon does not equal the actual value.");
				test.strictEqual( 49.28272112333334, center[1], "Center lat does not equal the actual value.");

				clusterCreator.createEventCandidate(results, center, function(err, result) {
					test.strictEqual(4, result.tweets.length, "Tweets array does not match the size.");
					var array = [];
					result.tweets.forEach(function(o) {
						array.push(o.id);
					});
					array.forEach(function(e) {
						test.notStrictEqual(-1, array.indexOf(e), "indexOf returned -1.");
					})
					test.done();
				});
			});
		}
	});
}

