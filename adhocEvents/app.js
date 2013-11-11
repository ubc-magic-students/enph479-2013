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
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Connected to mongodb database');
});

var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');

//Import from bennu
var bennu = require('./bennu.js');
  bennu.on('bennu', function(data) {
  //console.log(data);
});


//Import credential information
var credentials = require('./credentials.js');
var constants = require('./models/constants.js');

//Twitter streaming
var Twit = require('twit');
var T = new Twit({
  consumer_key:         credentials.adhoc_twitter_access.consumer_key,
  consumer_secret:      credentials.adhoc_twitter_access.consumer_secret,
  access_token:         credentials.adhoc_twitter_access.access_token,
  access_token_secret:  credentials.adhoc_twitter_access.access_token_secret
});

var stream = T.stream('statuses/filter', {locations: constants.boundary});
stream.on('tweet', function(tweet) {
  console.log("tweet ID: " + tweet.id 
    + " at: " + tweet.created_at 
    + " with message: " + tweet.text
    + " from: " + (tweet.coordinates ? 
          [tweet.coordinates.coordinates[0], tweet.coordinates.coordinates[1]] : undefined));
  
  //Get hashtag and user_mentions from the tweet
  var hashtags = [];
  var user_mentions = [];
  if(tweet.entities.hashtags.length !== 0) {
    tweet.entities.hashtags.forEach(function(h) {
      hashtags.push(h.text.toLowerCase());
    })
  }
  if(tweet.entities.user_mentions.length !==0) {
    tweet.entities.user_mentions.forEach(function(u) {
      user_mentions.push(u.screen_name.toLowerCase());
    })
  }
  //******Before searching tweets, search EventCandidates to check if this tweet can be added to the event candidate.

  //Search for other tweets that have similar traits as this tweet.
  async.series({
      nearThisTweet: function(cb) {
        // search mongodb for tweets that are near the current tweet.
        if (tweet.coordinates) {
          /*Tweet.geoNear(
            tweet.coordinates.coordinates, 
              { 
                spherical: true,
                maxDistance: constants.maxDistance/constants.earthRadius,
                distanceMultiplier: constants.earthRadius
              }, function(err, result, stats) {
                console.log(result);
            })*/
          Tweet.find()
            .near('coordinates', {
                center: tweet.coordinates.coordinates, 
                spherical: true, 
                maxDistance: constants.maxDistance/constants.earthRadius,
                distanceMultiplier: constants.earthRadius
            }).exec(function(err, result) {
              if(err) {
                console.log(err);
              } else {
                console.log("geoNear: ");
                console.log(result);
                cb(null, result);
              }
            })
        }
      },
      sameHashTags: function(cb) {
        Tweet.find({ hashtags: {$in : hashtags}}, function(err, result) {
          if(err) {
            console.log(err);
          } else {
            console.log("sameHashTags: ");
            console.log(result);
            cb(null, result);
          }
        });
      },
      sameUserMentions: function(cb) {
        Tweet.find({ user_mentions: {$in : user_mentions}}, function(err, result) {
          if(err) {
            console.log(err);
          } else {
            console.log("sameUserMentions: ");
            console.log(result);
            cb(null, result);
          }
        });
      }
    }, 
    function(err, results) {
      if(err) {
        console.log(err);
      } else {
        //merge three queries together to EventCandidate
        var tempUnion = union(results.nearThisTweet, results.sameHashTags);
        var possibleEvent = union(tempUnion, results.sameUserMentions);
        //If there are enough tweets in possibleEvent array, save as EventCandidate.
        if (possibleEvent.length >= 2) {
          //***** Before saving the event candidate, calculate center lat/long
          EventCandidate.create( {
            tweets: possibleEvent,
            createdAt: new Date()
          }, function(err, newEvent) {
            if(err) {
              console.log(err);
            } else {
              console.log("event candidate saved");
              console.log(newEvent);
            }
          })
        }

      }
  });

  Tweet.create(
    {
      id: tweet.id, 
      createdAt: new Date(tweet.created_at), 
      message: tweet.text, 
      coordinates: tweet.coordinates ? 
          [tweet.coordinates.coordinates[0], tweet.coordinates.coordinates[1]] : undefined,
      hashtags: hashtags,
      user_mentions: user_mentions

    }, function(err, newTweet) {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully saved tweet: " + newTweet.id);
      }
    });
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

//Helper functions
function union(arr1, arr2) {
  var union = arr1.concat(arr2);
  for(var i = 0; i < arr1.length; i++) {
    for(var j = arr1.length; j < union.length; j++) {
      if (union[i].id === union[j].id) {
        union.splice(i,1);
      }
    }
  }
  return union;
}