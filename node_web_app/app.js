/*************************** Setup *********************************/
var javaPort = 8080;
var javaServer = require('net').createServer();

// Instantiate the application
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
server.listen(8090);

// Import credentials for DB and Twitter
var credentials = require('./credentials.js');

// Connect to Twitter
var Twit = require('twit');
var T = new Twit(credentials.twitter_access);
var stream = T.stream('statuses/sample');

// Set application configuration details
app.configure(function () {
    app.set('view engine', 'jade');
    app.set('view options', { layout: true });
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/public'));
    app.use(express.limit('1mb'));
    app.use(express.bodyParser());
});

// Create socket.io rooms
io.sockets.on('connection', function (socket) {
  socket.on('join hashtagcloud', function (data) {
    socket.join('hashtagcloud');
  });
});

process.on('uncaughtException', function(err) {
    console.log(err);
});

/*************************** Pages *********************************/

// Tag Cloud Page
app.get('/', function (req, res) {
    res.render('index.jade');
});

/********** Tweets Import and Hashtag Count Calculation ************/
javaServer.on('listening', function () {
   console.log('Server is listening on ' + javaPort);
});

 javaServer.on('error', function (e) {
    console.log('Server error: ' + e.code);
  });

 javaServer.on('close', function () {
   console.log('Server closed');
 });

  javaServer.on('connection', function (javaSocket) {
    var clientAddress = javaSocket.address().address + ':' + javaSocket.address().port;
    console.log('Java ' + clientAddress + ' connected');

    var firstDataListenner = function (data) {
        console.log('Received namespace from java End: ' + data);
        io.sockets.in('hashtagcloud').emit('hashtag tweet', { data: String.fromCharCode.apply(String, data) });
        //javaServer.send(data);
        javaSocket.removeListener('data', firstDataListenner);
    }

javaSocket.on('data', firstDataListenner);

 javaSocket.on('close', function() {
        console.log('Java ' + clientAddress + ' disconnected');
 });
});
 javaServer.listen(javaPort);




var tweet_array = [];

stream.on('tweet', function (tweet) {
    if (tweet && tweet.text) {
        //io.sockets.in('hashtagcloud').emit('hashtag tweet', { data: tweet.text });
    }
});

stream.on('connect', function(request) {
    console.log("TWITTER CONNECT");
});

stream.on('disconnect', function (disconnectMessage) {
    console.log("TWITTER DISCONNECT MESSAGE: " + disconnectMessage);
    stream.start();
});

stream.on('warning', function (warning) {
    console.log("TWITTER WARNING:" + warning);
});