var sys = require('sys')
var exec = require('child_process').exec;
var credentials = require('./credentials.js');

// Import Twitter data to WoTKit
var Twit = require('twit');
var T = new Twit(credentials.twitter_access);

var vancouver = ['-123.27', '49.195', '-123.020', '49.315'];

var stream = T.stream('statuses/filter', { locations: vancouver });

var command;
stream.on('tweet', function (tweet) {
		if (tweet && tweet.text && tweet.coordinates && tweet.coordinates.coordinates) {
			command = "curl --user "+credentials.wotkit_access.user+":"+credentials.wotkit_access.password+" --request POST -d value="+tweet.id+" -d lng="+tweet.coordinates.coordinates[0]+" -d lat="+tweet.coordinates.coordinates[1]+" -d message=\""+tweet.text+"\" 'http://bennu.magic.ubc.ca/wotkit/api/sensors/tweets-in-vancouver/data'";
			child = exec(command, function (error, stdout, stderr) {
				sys.print('stdout: ' + stdout);
				sys.print('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});
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