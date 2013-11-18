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
  , clusterCreator = require('./clusterCreator.js');
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

var Tweet = require('./models/TweetObject.js');
var EventCandidate = require('./models/EventCandidate.js');

clearDb();
//Import from bennu
/*var bennu = require('./bennu.js');
  bennu.on('bennu', function(data) {
  //console.log(data);
});*/


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
console.log("Starting straming from Twitter inside: " + constants.boundary);
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

  //create new tweet entry
  new Tweet(
    {
      id: tweet.id, 
      createdAt: new Date(tweet.created_at), 
      message: tweet.text, 
      coordinates: tweet.coordinates ? 
          [tweet.coordinates.coordinates[0], tweet.coordinates.coordinates[1]] : undefined,
      hashtags: hashtags,
      user_mentions: user_mentions
    }
  ).save(function(err, newTweet) {
    if (err) {
      console.log(err);
    } else {
        console.log("successfully saved tweet: " + newTweet.id);

        //******Before searching tweets, search EventCandidates to check if this tweet can be added to the event candidate.

        clusterCreator.searchSimilarTweets(newTweet, function(err, results) {
          if (err) {
            console.log(err);
          } else {
            clusterCreator.createEventCandidate(results, function(err, eventCandidate) {
              if(err) {
                console.log(err);
              } else {
                console.log("New Event Candidate: ");
                console.log(eventCandidate);
              }
            });
          }
        });
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

function clearDb() {
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
}