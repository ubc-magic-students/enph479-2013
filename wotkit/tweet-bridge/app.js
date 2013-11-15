var credentials = require('./credentials.js');
var request = require('request');
var async = require('async');
var fs = require('fs');

// Import Twitter data to WoTKit
var Twit = require('twit');
var T = new Twit(credentials.twitter_access);

var vancouver = ['-123.27', '49.195', '-123.020', '49.315'];

var stream = T.stream('statuses/filter', { locations: vancouver });

var sentiment140URLstring = "http://www.sentiment140.com/api/bulkClassifyJson?appId=" + credentials.sentiment140_key;

/*var sentiment;
var precipitation;
var temperature;*/
var tweet;

stream.on('tweet', function (tweet) {

		if (tweet && tweet.text && tweet.coordinates && tweet.coordinates.coordinates) {
			console.log("Tweet text: " + tweet.text);

      /*tweet = new Tweet(tweet.id, tweet.text, tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]);
      tweet.processTweet();*/

      // get sentiment score
      request({
        method: 'POST',
        uri: sentiment140URLstring,
        body: JSON.stringify({"data" : [{ "text" : tweet.text }]})
      }, function(error, response, body) {
      	try {
          sentiment = JSON.parse(body).data[0].polarity;
          console.log("Sentiment: " + sentiment);
      	} catch(err) {
          console.log("Sentiment api error: " + err);
          sentiment = -1;
        }



        request({
          method: 'GET',
          uri: 'http://api.openweathermap.org/data/2.5/weather?lat='+tweet.coordinates.coordinates[1]+'&lon='+tweet.coordinates.coordinates[0]
        }, function(error, response, body) {
          try {
            console.log("Weather: " + body);
            temperature = JSON.parse(body).main.temp;
            console.log("Temperature: " + temperature);
            precipitation = 0;
            if (JSON.parse(body).main.rain){
              if (JSON.parse(body).main.rain["1h"]) {
                precipitation = JSON.parse(body).main.rain["1h"];
              } else if (JSON.parse(body).main.rain["3h"]) {
                precipitation = JSON.parse(body).main.rain["3h"];
              }
            }
            console.log("Precipitation: " + precipitation);
          } catch(err) {
            console.log("Weather api error: " + err);
            temperature = -1;
            precipitation = -1;
          }
          
          request({
            method: 'POST',
            uri: 'http://bennu.magic.ubc.ca/wotkit/api/sensors/tweets-in-vancouver2/data',
            auth: {
              'user': credentials.wotkit_access.user,
              'pass': credentials.wotkit_access.password
            },
            form: {
              value: tweet.id,
              lat: tweet.coordinates.coordinates[1],
              lng: tweet.coordinates.coordinates[0],
              message: tweet.text,
              sentiment: sentiment,
              precipitation: precipitation,
              temperature: temperature
            }
          }, function(error, response, body) {
            console.log("Error: " + error);
          });
        });
      });
	  }
});

stream.on('connect', function(request) {
    console.log("TWITTER CONNECT");
});

stream.on('disconnect', function (disconnectMessage) {
    console.log("TWITTER DISCONNECT MESSAGE: " + JSON.stringify(disconnectMessage));
    stream.start();
});

stream.on('warning', function (warning) {
    console.log("TWITTER WARNING:" + warning);
});

/*function Tweet(id, message, lat, lng) {
  this.id = id;
  this.message = message;
  this.lat = lat;
  this.lng = lng;
  this.sentiment;
  this.precipitation;
  this.temperature;
  var that = this;

  this.processTweet = function() {
    var f1 = function(callback) {
          that.getSentiment(callback);
        };
    var f2 = function(callback) {
          that.getWeather(callback);
        };*/
    /*async.parallel([
        makeSentimentCallbackFunc(function() {return true;}), makeWeatherCallbackFunc(function() {return true;})
    ], function(err, results) {
      console.log("ERR: "+ err);
      console.log("RES: "+results);
      
        that.storeInfo();
      
    });*/

    /*function makeSentimentCallbackFunc() {
      return function (callback) {
        that.getSentiment(callback);
      };
    }

    function makeWeatherCallbackFunc() {
      return function (callback) {
        that.getWeather(callback);
      };
    }*/

    //that.getSentiment(that.getWeather(that.storeInfo));
    /*this.getA(this.getB(function() {return true;}));

  };
  this.getA = function(callback) {
    setTimeout(function() {
      console.log('A');
      callback();
    }, 2000);
  }

  this.getB = function(callback){
    setTimeout(function() {
      console.log('B');
      callback();
    }, 1000);
  }

  this.getSentiment = function(callback) {
    console.log('GET SENTIMENT');
    request({
        method: 'POST',
        uri: sentiment140URLstring,
        body: JSON.stringify({"data" : [{ "text" : this.message}]})
      }, function(error, response, body) {
        this.sentiment = JSON.parse(body).data[0].polarity;
        //console.log("Sentiment: " + this.sentiment);
        callback();
    });
  };

  this.getWeather = function(callback) {
    console.log('GET WEATHER');
    request({
      method: 'GET',
      uri: 'http://api.openweathermap.org/data/2.5/weather?lat='+this.lat+'&lon='+this.lng
    }, function(error, response, body) {
      var weather = JSON.parse(body).main;
      this.temperature = weather.temp;
      //console.log("Temperature: " + this.temperature);
      if (weather.rain){
        if (weather.rain["1h"]) {
          this.precipitation = weather.rain["1h"];
        } else if (weather.rain["3h"]) {
          this.precipitation = weather.rain["3h"];
        }
      } else {
        this.precipitation = 0;
      }
      callback();
      //console.log("Precipitation: " + this.precipitation);
    });
  };

  this.storeInfo = function() {
    console.log('STORING INFO');
    console.log("Sentiment: " + this.sentiment);
    console.log("Temperature: " + this.temperature);
    console.log("Precipitation: " + this.precipitation);
    request({
      method: 'POST',
      uri: 'http://bennu.magic.ubc.ca/wotkit/api/sensors/tweets-in-vancouver2/data',
      auth: {
        'user': credentials.wotkit_access.user,
        'pass': credentials.wotkit_access.password
      },
      form: {
        value: this.id,
        lat: this.lat,
        lng: this.lng,
        message: this.message,
        sentiment: this.sentiment,
        precipitation: this.precipitation,
        temperature: this.temperature
      }
    }, function(error, response, body) {
       console.log("Error: " + error);
       fs.writeFile("log", JSON.stringify(response), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
          }
      }); 
    });
  };
}*/
