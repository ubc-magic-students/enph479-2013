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

//Import from bennu
var bennu = require('./bennu.js');
bennu.on('bennu', function(data) {
  //console.log(data);
});


//Import credential information
var credentials = require('./credentials.js');
var Twit = require('twit');
var T = new Twit({
  consumer_key:         credentials.adhoc_twitter_access.consumer_key,
  consumer_secret:      credentials.adhoc_twitter_access.consumer_secret,
  access_token:         credentials.adhoc_twitter_access.access_token,
  access_token_secret:  credentials.adhoc_twitter_access.access_token_secret
});

var stream = T.stream('statuses/filter', {locations: require('./models/boundary.js').boundary});
stream.on('tweet', function(tweet) {
  console.log(new Date(tweet.created_at));
});

function TimeManager(tweetList) {
  var ttl = 5000000; // 5 seconds
  var hash = [];
  var addTimer = function(tweet) {
    setTimeOut(function() {
      //pop from tweetList giving id from tweet
    }, ttl);
  }
}


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