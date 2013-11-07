/*************************** Setup *********************************/
var javaPort = 8080;
var javaServer = require('net').createServer();

// Instantiate the application
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
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

/********** DB Access Process ************/
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


// Create socket.io rooms
io.sockets.on('connection', function (socket) {
  socket.on('join hashtagcloud', function (data) {
    socket.join('hashtagcloud');
  });

  socket.on('join dbconnect', function (data) {
    console.log('JOINED DBCONNECt');
    socket.join('dbconnect');

    var tweetRetriever = new TweetRetriever(connection, socket);
    tweetRetriever.initializeTweets();

    // Gather new tweets from DB every 15 seconds
    setInterval(function() {
      console.log('CHECKING FOR NEW TWEETS...');
      tweetRetriever.checkForNewTweets();
    } ,15000);

    /*var regionRetriever = new RegionRetriever(connection);
      socket.join('regionrequest');
      socket.on('time_play_request', function() {
        regionRetriever.getHistoryData();
      });*/
  });

  socket.on('join regionrequest', function() {
    socket.join('regionrequest');

    var regionRetriever = new RegionRetriever(connection);

    socket.on('time_play_request', function() {
      regionRetriever.getHistoryData();
    });
  });
  
  function TweetRetriever(connection, socket) {
    this.tweets = [];

    this.initializeTweets = function() {
      console.log('INITIALIZING TWEETS...');
      var that = this;
      connection.query("SELECT * from ENPH479.tweet_data", function(err, rows){
        if(err != null) {
          console.log("Query error:" + err);
        } else {
          that.tweets = rows;
          that.sendNewTweets(rows);
        }
      });
    }

    this.checkForNewTweets = function() {
      var date_now = new Date(new Date().getTime() - 60*60*1000);
      var date = new Date(date_now.getTime() - 2*60*1000).toISOString();
      date_now = date_now.toISOString();
      var query = "SELECT * from ENPH479.tweet_data WHERE timestamp BETWEEN '" + date + "' AND '" + date_now + "'";
      var that = this;
      connection.query(query, function(err, rows){
        if(err != null) {
          console.log("Query error:" + err);
        } else {
          console.log('ADDING TO TWEETS...');
          that.addToTweets(rows);
        }
      });
    }

    this.addToTweets = function(rows) {
      if (this.tweets.length != 0)
      {
        var length = this.tweets.length;
        var curr_id = this.tweets[length-1].id;

        var that = this;
        var new_tweets = [];
        rows.forEach(function(element, index) {
          if (element.id > curr_id) {
            this.push(element);
          }
        }, new_tweets);
        console.log("NEWTWEETS: " + new_tweets);
        this.tweets = this.tweets.concat(new_tweets);
        this.sendNewTweets(new_tweets);

        curr_id = this.tweets[this.tweets.length-1].id;
        console.log("new_id: " + curr_id);
      }
    }

    this.sendNewTweets = function(rows) {
      io.sockets.in('dbconnect').emit('new tweets', { data: rows });
    }
  }

  function RegionRetriever(connection) {

    this.getHistoryData = function(hour) {
      if(!hour)
        hour = 24;
      var date_now = new Date(new Date().getTime() );
      var date = new Date(date_now.getTime() - hour*60*60*1000).toISOString();
      date_now = date_now.toISOString();
      console.log("datenow: " + date_now)
      console.log("date: " + date)
      var that = this;
      require('async').series([
        function(callback) {
          var query = "SELECT * from ENPH479.timeplay_data WHERE timestamp BETWEEN '" + date + "' AND '" + date_now + "'";
          connection.query(query, function(err, rows){
            if(err != null) {
              console.log("Query error:" + err);
            } else {
              console.log("row size: " + rows.length)
              callback(null, rows)
            }
          });
        },
        function (callback) {
          var query = "SELECT * from ENPH479.tweet_data WHERE timestamp BETWEEN '" + date + "' AND '" + date_now + "'";
          connection.query(query, function(err, rows){
            if(err != null) {
              console.log("Query error:" + err);
            } else {
              console.log("row size: " + rows.length)
              callback(null, rows)
            }
          });
        }
        ], 
        function(err, results){
          that.sendNewTweets(results);
      });

    }

    this.sendNewTweets = function(rows) {
      io.sockets.in('regionrequest').emit('region history', { data: rows });
    }

  }

});


process.on('uncaughtException', function(err) {
    console.log(err);
});

/*************************** Pages *********************************/

// Map Page
app.get('/map', function (req, res) {
    res.render('map.jade');
});

// Tag Cloud Page
app.get('/', function (req, res) {
    res.render('index.jade');
});

/********** Java Backend Import Process ************/
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
        javaSocket.removeListener('data', firstDataListenner);
    }

javaSocket.on('data', firstDataListenner);

 javaSocket.on('close', function() {
        console.log('Java ' + clientAddress + ' disconnected');
 });
});
 javaServer.listen(javaPort);