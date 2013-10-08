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
			command = "curl --user "+credentials.wotkit_access.user+":"+credentials.wotkit_access.password+" --request POST -d value="+tweet.id+" -d lng="+tweet.coordinates.coordinates[0]+" -d lat="+tweet.coordinates.coordinates[1]+" -d message=\""+tweet.text+"\" 'http://wotkit.sensetecnic.com/api/sensors/tweets-in-vancouver/data'";
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


// Import Weather data to WoTKit
var weather_command="curl --request GET 'http://api.openweathermap.org/data/2.5/weather?q=Vancouver,ca'";

var input_command;

setInterval(function() {
	child = exec(weather_command, function (error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		var obj = JSON.parse(stdout);
		input_command = "curl --user "+credentials.wotkit_access.user+":"+credentials.wotkit_access.password+" --request POST -d value=1 -d lat="+obj.coord.lat+" -d lng="+obj.coord.lon+" -d message=\""+stdout+"\" 'http://wotkit.sensetecnic.com/api/sensors/weather-in-vancouver/data'"
		child = exec(input_command, function (error, stdout, stderr) {
			/*sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}*/
		});
	});
}, 5000);

// Export WoTKit weather data

var end_time;
var start_time;
setInterval(function() {

		end_time = new Date().getTime();
		start_time = end_time - 10000;
		var export_command = "curl --request GET 'http://wotkit.sensetecnic.com/api/sensors/2013enph479.weather-in-vancouver/data?start=" + start_time + "&end=" + end_time + "' >> output.txt";
		sys.print('export_command: ' + export_command + "\n");
		child = exec(export_command, function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
		});
}, 5000);