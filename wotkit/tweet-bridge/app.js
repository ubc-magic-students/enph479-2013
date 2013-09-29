var sys = require('sys')
var exec = require('child_process').exec;
var credentials = require('./credentials.js');

// Connect to Twitter
var Twit = require('twit');
var T = new Twit(credentials.twitter_access);

var vancouver = ['-123.27', '49.195', '-123.020', '49.315'];

var stream = T.stream('statuses/filter', { locations: vancouver });

var command;
stream.on('tweet', function (tweet) {
		console.log(tweet.text);
		command = "curl --user "+credentials.wotkit_access.user+":"+credentials.wotkit_access.password+" --request POST -d value="+tweet.id+" -d message=\""+tweet.text+"\" 'http://wotkit.sensetecnic.com/api/sensors/tweets-in-vancouver/data'";

		child = exec(command, function (error, stdout, stderr) {
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
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


// WEATHER API
var weather_command="curl --request GET 'http://api.openweathermap.org/data/2.5/weather?q=Vancouver,ca'";

var input_command;

setInterval(function() {
	child = exec(weather_command, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		console.log(stdout);
		input_command = "curl --user "+credentials.wotkit_access.user+":"+credentials.wotkit_access.password+" --request POST -d value=1 -d message=\""+stdout+"\" 'http://wotkit.sensetecnic.com/api/sensors/weather-in-vancouver/data'"
		child = exec(input_command, function (error, stdout, stderr) {
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
	});
}, 5000);

