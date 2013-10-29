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

// Create socket.io rooms
io.sockets.on('connection', function (socket) {
  socket.on('join hashtagcloud', function (data) {
    socket.join('hashtagcloud');

    // query for cluster tweet ids
    socket.on('get cluster tweets', function(data) {
      var query_string = "SELECT lat, lng FROM ENPH479.tweet_data WHERE id in ("+data.data+")";
      console.log("query_string: " + query_string);
      connection.query(query_string, function(err, rows){
        // There was a error or not?
        if(err != null) {
          console.log("Query error:" + err);
        } else {
          // Shows the result on console window
          //console.log(rows[0].lat);
          socket.emit('return tweet latlng', { data: rows });
        }
      });
    });
  });

  socket.on('join latlong', function(data) {
    socket.join('latlong');

    connection.query("SELECT * from ENPH479.tweet_data", function(err, rows){
        // There was a error or not?
        if(err != null) {
            console.log("Query error:" + err);
        } else {
            // Shows the result on console window
            //console.log(rows[0].lat);
            //io.sockets.in('latlong').emit('tweet latlongs', { data: rows });
        }
      })
    });
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

/********** Cluster Import Process ************/
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


/*connection.end();*/