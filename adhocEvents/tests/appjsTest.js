//Connect to mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Connected to mongodb database');
});

var Tweet = require('./../models/TweetObject.js');
var EventCandidate = require('./../models/EventCandidate.js');
var assert = require('assert');
var helper = require('./../helpers.js');
var constants = require('./../models/constants.js');

//Clean database
/*(function initialize() {
	Tweet.remove({}, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Removed all docs for tweets.");
		}
	});

	EventCandidate.remove({}, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("Removed all docs for EventCandidate.");
		}
	});

	Tweet.create({
		id: 1, 
		createdAt: new Date(), 
		message: "message 1", 
		coordinates: [-123.11861873, 49.28306049],
		hashtags: ["test1", "test2"],
		user_mentions: ["user1"]
	}, function(err, tweet) {
		if(err) {
			console.log(err);
		} else {
			console.log("saved 1.");
		}
	});

	Tweet.create({
		id: 2, 
		createdAt: new Date(), 
		message: "message 2", 
		coordinates: [-123.11862873, 49.28205049],
		hashtags: ["test2", "test3"],
		user_mentions: ["user2"]
	}, function(err, tweet) {
		if(err) {
			console.log(err);
		} else {
			console.log("saved 2.");
		}
	});

	Tweet.create({
		id: 3, 
		createdAt: new Date(), 
		message: "message 3", 
		coordinates: [-123.11662473, 49.28305239],
		hashtags: ["test1", "test3"],
		user_mentions: ["user2, user3"]
	}, function(err, tweet) {
		if(err) {
			console.log(err);
		} else {
			console.log("saved 3.");
		}
	});

	Tweet.create({
		id: 4, 
		createdAt: new Date(), 
		message: "message 4", 
		coordinates: undefined,
		hashtags: ["test1", "test4"],
		user_mentions: ["user4, user5"]
	}, function(err, tweet) {
		if(err) {
			console.log(err);
		} else {
			console.log("saved 4.");
		}
	});

	Tweet.create({
		id: 5, 
		createdAt: new Date(), 
		message: "message 5", 
		coordinates: undefined,
		hashtags: ["test5"],
		user_mentions: []
	}, function(err, tweet) {
		if(err) {
			console.log(err);
		} else {
			console.log("saved 5.");
		}
	});

})();*/

(function test_findCenter() {
	console.log("Testing test_findCenter");
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
			assert.strictEqual( -123.11795739666667, center[0], "Center lon does not equal the actual value.");
			assert.strictEqual( 49.28272112333334, center[1], "Center lat does not equal the actual value.");
			console.log("Test Successful");
		}
	});
})();
