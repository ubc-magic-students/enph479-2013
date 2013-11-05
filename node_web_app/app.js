/*************************** Setup *********************************/
var javaPort = 8080;
var javaServer = require('net').createServer();

// Instantiate the application
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  //, mysql = require('mysql');
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
  });


  /*socket.on('join latlong', function(data) {
    socket.join('latlong');

    connection.query("SELECT * from ENPH479.tweet_data", function(err, rows){
        // There was a error or not?
        if(err != null) {
            console.log("Query error:" + err);
        } else {
            // Shows the result on console window
            console.log(rows[0].lat);
            io.sockets.in('latlong').emit('tweet latlongs', { data: rows });
        }
      })
  })*/
});

// fake a socket connection for now
/*setInterval(function () {
  io.sockets.in('hashtagcloud').emit('hashtag tweet', { data: String.fromCharCode.apply(String, data) });
}, 15000);*/


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
/*javaServer.on('listening', function () {
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
 javaServer.listen(javaPort);*/

/* Testing backend by Chris.*/
var interval = 5000;
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to db")
});

var tweetObject = mongoose.Schema({
  id: { type: Number, unique: true },
  timestamp: {type: String, default: new Date().toString()},
  message: {type: String, default: "" },
  longitude: {type: Number, default: -1},
  latitude: {type: Number, default: -1},
  polarity: {type: Number, default: -1},
  weather: {type: Number, default: -1}
})

var Tweet = mongoose.model('Tweet', tweetObject)

setInterval(function() {
  var epochNow = new Date().getTime();
  var testURL = "http://bennu.magic.ubc.ca/wotkit/api/sensors/2013enph479.tweets-in-vancouver/data?start=" + (epochNow - interval) + "&end=" + epochNow;
  console.log(testURL);
  require('http').get(testURL, function(res) {
    var body = "";
    console.log("WOTKIT STATUS: " + res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    })
    res.on('end', function() {
      var bodyInJSON = JSON.parse(body)
      console.log(bodyInJSON)
      bodyInJSON.forEach(function(o) {
        // Sentiment request
        var sentimentRequestJSON = {
          data: [{"text": o.message}]
        }
        var sentimentRequest ={
          hostname: 'www.sentiment140.com',
          path: '/api/bulkClassifyJson?appid="' + require('./credentials.js').sentiment140_key,
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(JSON.stringify(sentimentRequestJSON))
          }
        }

        require('http').request(sentimentRequest, function(res) {
          var body = ""
          console.log('SENTIMENT API STATUS: ' + res.statusCode)
          res.setEncoding('utf8')
          res.on('data', function(chunk) {
            body += chunk
          })
          res.on('end', function() {
            var bodyInJSON = JSON.parse(body)
            new Tweet( {
              id: o.id,
              timestamp: o.timestamp,
              message: o.message,
              longitude: o.lng,
              latitude: o.lat,
              polarity: bodyInJSON.data[0].polarity
            }).save(function(err, tweet) {
                if(err) {
                  console.log("error while saving tweet")
                }
                console.log("Successfully saved Tweet " + o.id)
             })
          })
        }).end(JSON.stringify(sentimentRequestJSON))

        //Weather Request
        var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + o.lat + '&lon=' + o.lng
        require('http').get(weatherURL, function(res) {
          var body = "";
          console.log("WEATHER STATUS: " + res.statusCode);
          res.setEncoding('utf8');
          res.on('data', function(chunk) {
            body += chunk;
          })
          res.on('end', function() {
            var parsedWeather = JSON.parse(body);
            console.log(parsedWeather)
            console.log("temp: " + (parsedWeather.main.temp - 273.0))
            if (parsedWeather.rain) {
              console.log("precipitaion: " + parsedWeather.rain['3h'])
            }
            
          })
        })

      })
    })
  })
  
}, interval);



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

