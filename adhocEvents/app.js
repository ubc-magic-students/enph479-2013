//Print any exceptions
process.on('uncaughtException', function(err) {
    console.log(err);
});

//Instantiate the application and port number
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , mongoose = require('mongoose')
server.listen(3000);

//Import credential information
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