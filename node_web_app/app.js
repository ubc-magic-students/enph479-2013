/*************************** Setup *********************************/
// Instantiate the application
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , Twit = require('twit')
  , mysql = require('mysql');
server.listen(8090);

// Import credentials for DB and Twitter
var credentials = require('./credentials.js');

// Set application configuration details
app.configure(function () {
    app.set('view engine', 'jade');
    app.set('view options', { layout: true });
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/public'));
    app.use(express.limit('1mb'));
    app.use(express.bodyParser());
});

/*******************Twit*****************************************/

var T = new Twit(credentials.adhoc_twitter_access);
var vancouver = ['-123.27', '49.195', '-123.020', '49.315'];
var stream = T.stream('statuses/filter', { locations: vancouver });

stream.on('tweet', function(tweet) {
  io.sockets.emit('tweet', { data: tweet });
});

/********************** Socket.IO ************************************/

// Create socket.io rooms
io.sockets.on('connection', function (socket) {
});

/*************************** Pages *********************************/

// Tweetfeed Page
app.get('/', function (req, res) {
    res.render('index.jade');
});