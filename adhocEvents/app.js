//Print any exceptions
process.on('uncaughtException', function(err) {
    console.log(err);
});

//Instantiate the application and port number
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , mongoose = require('mongoose')
  , async = require('async');
server.listen(3000);

// Set application configuration details
app.configure(function () {
  app.set('view engine', 'jade');
  app.set('view options', { layout: true });
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
});

//Connect to mongoose
mongoose.connect('mongodb://localhost/test_environment');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Connected to mongodb database');
});

//Create socket.io rooms
io.sockets.on('connection', function (socket) {
  socket.on('join eventDetection', function (data) {
  	console.log('Socket joined. Connect to eventDetection room.')
    socket.join('eventDetection');
  });
});

// Main page
app.get('/', function (req, res) {
    res.render('index.jade');
});

function clearDb() {
  for(var a = 0; a < arguments.length; a++) {
      arguments[a].remove({}, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Removed all docs.");      
      }
    });
  }
}

(function() {
	var HashtagCount = require('./models/HashtagCount.js');
	var Tweet = require('./models/TweetObject.js');
	var credentials = require('./credentials.js');
	var constants = require('./models/constants.js');
	clearDb(HashtagCount, Tweet);

	setInterval(function() {
		var o = {};
		o.map = function() {
			emit(this.hashtag, 1);
		}
		o.reduce = function(k, vals) {
			return vals.length;
		}
		o.out = { replace: 'hashtagCollection'}

		HashtagCount.mapReduce(o, function(err, results) {
			results.find().sort({value: 'desc'}).where('value').gt(1).limit(10).exec(function(err, docs) {
				if(err) {
					console.log(err);
				} else {
					console.log(docs);
					var iterator = function(item, callback) {
						Tweet.find({hashtags: {$in: [item._id]}}, function(err, queryResults) {
							if(err) {
								console.log(err);
							} else {
								var topic = {
									tweets: queryResults,
									hashtag: item._id,
									centers: []
								}
								callback(err, topic);
							}
						});
					}

					async.concat(docs, iterator, function(err, events) {
						if(err) {
							console.log(err);
						} else {
							events.forEach(function(e) {
								console.log("saved Event: " + e.hashtag);
							});
						}
					});



				}
			});
		});
	}, 1000*10);

	//Twitter streaming
	var Twit = require('twit');
	var T = new Twit({
	   consumer_key:         credentials.adhoc_twitter_access.consumer_key,
	   consumer_secret:      credentials.adhoc_twitter_access.consumer_secret,
	   access_token:         credentials.adhoc_twitter_access.access_token,
	   access_token_secret:  credentials.adhoc_twitter_access.access_token_secret
	});

	var stream = T.stream('statuses/filter', {locations: constants.boundary, language: 'en'});

	stream.on('tweet', function(tweet) {
		if(tweet.entities.hashtags.length > 0) {

			var hashtags = [];
			var user_mentions = [];
			tweet.entities.hashtags.forEach(function(h) {
				hashtags.push(h.text.toLowerCase());
				HashtagCount.create({hashtag: h.text.toLowerCase()}, function(err, hashtag) {
					if(err) {
						console.log(err);
					}
				});
			});

			tweet.entities.user_mentions.forEach(function(u) {
	        	user_mentions.push(u.screen_name.toLowerCase());
	        });

	    	console.log("tweet ID: " + tweet.id 
	    		+ " at: " + tweet.created_at 
	        	+ " with message: " + tweet.text
	        	+ " from: " + (tweet.coordinates ? 
	            	[tweet.coordinates.coordinates[0], tweet.coordinates.coordinates[1]] : undefined)
	    		+ " hashtags: " + hashtags
	    		+ " user_mentions: " + user_mentions);

	    	Tweet.create({
	    		id: tweet.id, 
          		createdAt: new Date(tweet.created_at), 
          		message: tweet.text, 
          		coordinates: tweet.coordinates ? 
              		[tweet.coordinates.coordinates[0], tweet.coordinates.coordinates[1]] : undefined,
          		hashtags: hashtags,
          		user_mentions: user_mentions
	    	}, function(err, tweet) {
	    		if(err) {
	    			console.log(err);
	    		} else {

	    		}
	    	});

	    }

	});

})();

