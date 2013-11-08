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

//Import data from bennu
var epochNow = new Date().getTime();
var pastTime = 3600000; //2629743000; //1 month in epoch time
var bennuURL = "http://bennu.magic.ubc.ca/wotkit/api/sensors/2013enph479.tweets-in-vancouver/data?start=" + (epochNow - pastTime) + "&end=" + epochNow;
http.get(bennuURL, function(res) {
  var body = "";
    console.log("WOTKIT STATUS: " + res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      var bodyInJSON = JSON.parse(body);
    })
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
  console.log(tweet);
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