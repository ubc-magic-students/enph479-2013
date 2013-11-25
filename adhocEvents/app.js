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
  , clusterCreator = require('./clusterCreator.js')
  , clusterUpdater = require('./clusterUpdater.js')
  , twitter_text = require('twitter-text');
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
var EventCandidate = require('./model    });
    tweets.push(tweet);
  });s/EventCandidate.js');

clearDb();
//Import from bennu
var bennu = require('./bennu.js');
  bennu.on('bennu', function(data) {
  //console.log(data);
  var tweets = [];
  data.forEach(function(d) {
    var tweet = new Tweet( {
      id: d.value,
      createdAt: new Date(d.timestamp),
      message: d.message,
      coordinates: [d.lng, d.lat],
      hashtags: twitter_text.extractHashtags(d.message),
      user_mentions: twitter_text.extractMentions(d.message)
    });
    tweets.push(tweet);
  });

  var containsHashtag = function(thishashtags, otherhashtags) {
    thishashtags.forEach(function(h) {
      if(otherhashtags.indexOf(h) !== -1)
        return true;
    });
    return false;
  }

  var containsUserMentions = function(thisUserMentions, otherUserMentions) {
    thisUserMentions.forEach(function(u) {
      if(otherUserMentions.indexOf(u) !== -1)
        return true;
    });
    return false;
  }

  tweets.forEach(function(thisTweet) {
    var eventCandidate = [];
    tweets.forEach(function(otherTweet) {
      var dist = helpers.calculateDistance(thisTweet.coordinates[0], thisTweet.coordinates[1], otherTweet.coordinates[0], otherTweet.coordinates[1])
      if (dist <= constants.maxDistance || containsHashtag(thisTweet.hashtags, otherTweet.hashtags)
          || constainsUserMentions(thisTweet.user_mentions, otherTweet.user_mentions)) {
        eventCandidate.push(otherTweet);
      }
    });
    clusterCreator.createEventCandidate(eventCandidate, function(err, newEvent) {
      if(err) {
        console.log(err);
      } else {
        console.log(newEvent);
      }
    })
  });
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

var stream = T.stream('statuses/filter', {locations: constants.boundary, language: 'en'});
clusterUpdater.initGarbageCollection();
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
  console.log("hashtags: " + hashtags);
  console.log("user_mentions: " + user_mentions);

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
        clusterUpdater.tweetBelongsToEvent(newTweet, function(err, updatedEvents) {
          if(err) {
            console.log(err);
          } else {
            if (updatedEvents.length === 0) {
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
            } else {
              // send updated events to front end?
              console.log(updatedEvents);
            }
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