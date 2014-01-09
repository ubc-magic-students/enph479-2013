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

app.get('/graph', function(req, res) {
  res.render('graph.jade');
});

  var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    database: 'ENPH479',
    user : 'root',
    password : ''
  });

  connection.connect(function(err){
    if(err != null) {
      console.log('Error connecting to mysql:' + err+'\n');
    }
  });

/********** DB Import Process **********************/
io.sockets.on('connection', function (socket) {

  // Get all tweets in DB when app starts
  DBRetriever.initializeTweets(function(err, result) {
    //console.log(result);
    io.sockets.in('map').emit(SOCKET_EVENTS.TWEET_UPDATE, { data: result });
  });

  // Get new tweets from DB every 150 seconds
  setInterval(function() {
    DBRetriever.checkForNewTweets(function(err, result) {
      io.sockets.in('map').emit(SOCKET_EVENTS.TWEET_UPDATE, { data: result });
    });
  } ,150000);

  // Get timeplay data when user requests it
  socket.on(SOCKET_EVENTS.TIMEPLAY_REQUEST, function() {
    DBRetriever.getTimeplayData(function(err, result) {
      io.sockets.in('map').emit(SOCKET_EVENTS.TIMEPLAY_RESPONSE, { data: result });
    });
  });

  socket.on('join graph', function(data) {
    socket.leave('map');
    socket.join('graph');

    connection.query("SELECT sentimentPolarity, weatherScore FROM ENPH479.tweet_data", function(err, rows) {
      // There was a error or not?
      if(err != null) {
          console.log("Query error:" + err);
      } else {
        // Shows the result on console window
        io.sockets.in('graph').emit('return graph points', { data: rows });
      }
    });
  });

  socket.on('join map', function(data) {
    socket.leave('graph');
    socket.join('map');
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
    io.sockets.in('map').emit(SOCKET_EVENTS.REGION_UPDATE, { data: String.fromCharCode.apply(String, data) });
    javaSocket.removeListener('data', firstDataListener);
  }

  javaSocket.on('data', firstDataListener);

  javaSocket.on('close', function() {
    console.log('Java ' + clientAddress + ' disconnected');
  });
});

javaServer.listen(javaPort);