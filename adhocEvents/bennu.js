var EventEmitter = require('events').EventEmitter;

module.exports = new EventEmitter();

var getData = function(timeStart, timeNow) {
	var now = new Date().getTime();
	var start = now - 3600000; //2629743000; //1 month in epoch time
	if(timeStart && timeNow) {
		now = timeNow;
		start = timeStart;
	}
	var bennuURL = "http://bennu.magic.ubc.ca/wotkit/api/sensors/2013enph479.tweets-in-vancouver/data?start=" + start + "&end=" + now;
	require('http').get(bennuURL, function(res) {
		var body = "";
   		console.log("WOTKIT STATUS: " + res.statusCode);
   		res.setEncoding('utf8');
   		res.on('data', function(chunk) {
   			body += chunk;
	 	});
   		res.on('end', function() {
 			var bodyInJSON = JSON.parse(body);
   			//console.log(bodyInJSON);
   			module.exports.emit('bennu', bodyInJSON);
   		})
	});
}

getData();