/*************************** Setup *********************************/

var SOCKET_EVENTS = {
  REGION_UPDATE: "regionUpdate",
  TWEET_UPDATE: "tweetUpdate",
  TIMEPLAY_REQUEST: "timeplayRequest",
  TIMEPLAY_RESPONSE: "timeplayResponse"
};

// Instantiate the application
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , mysql = require('mysql')
  , DBRetriever = require('./retriever')(mysql);
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

/*************************** Pages *********************************/

// Map Page
app.get('/map', function (req, res) {
    res.render('map.jade');
});

// Tweet Feed Page
app.get('/', function (req, res) {
    res.render('index.jade');
});

/********** DB Import Process **********************/
io.sockets.on('connection', function (socket) {

  // Get all tweets in DB when app starts
  DBRetriever.initializeTweets(function(err, result) {
    console.log(result);
    io.sockets.emit(SOCKET_EVENTS.TWEET_UPDATE, { data: result });
  });


  // Get new tweets from DB every 150 seconds
  setInterval(function() {
    DBRetriever.checkForNewTweets(function(err, result) {
      io.sockets.emit(SOCKET_EVENTS.TWEET_UPDATE, { data: result });
    });
  } ,150000);

  // Get timeplay data when user requests it
  socket.on(SOCKET_EVENTS.TIMEPLAY_REQUEST, function() {
    DBRetriever.getTimeplayData(function(err, result) {
      io.sockets.emit(SOCKET_EVENTS.TIMEPLAY_RESPONSE, { data: result });
    });
  });
});

/********** Java Backend Import Process ************/

var javaPort = 8080;
var javaServer = require('net').createServer();

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

  var firstDataListener = function (data) {
    console.log('Received namespace from java End: ' + data);
    io.sockets.emit(SOCKET_EVENTS.REGION_UPDATE, { data: String.fromCharCode.apply(String, data) });
    javaSocket.removeListener('data', firstDataListener);
  }

  javaSocket.on('data', firstDataListener);

  javaSocket.on('close', function() {
    console.log('Java ' + clientAddress + ' disconnected');
  });
});

javaServer.listen(javaPort);