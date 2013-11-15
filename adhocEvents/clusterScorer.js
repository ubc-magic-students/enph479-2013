var EventCandidate = require('./models/EventCandidate.js');
var natural = require('natural'),
	TfIdf = natural.TfIdf;
natural.natural.PorterStemmer.attach();

module.exports = function() {
	var getSentimentScore = function(message, callback) {
		var sentimentRequestJSON = {
			data: [{"text": o.message}];
		};
		var sentimentRequest ={
			hostname: 'www.sentiment140.com',
			path: '/api/bulkClassifyJson?appid="' + require('./credentials.js').sentiment140_key,
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(JSON.stringify(sentimentRequestJSON))
			};
		}
		require('http').request(sentimentRequest, function(res) {
			var body = "";
			console.log('SENTIMENT API STATUS: ' + res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				body += chunk;
			});
			res.on('end', function() {
				var bodyInJSON = JSON.parse(body);
				console.log('SENTIMENT SCORE: ' + bodyInJSON.data[0].polarity);
				callback(bodyInJSON.data[0].polarity);
			});
		}).end(JSON.stringify(sentimentRequestJSON));
	}

	var getWordFrequency = function(tweets) {
		var map = [];
		tweets.forEach(function(tweet) {
			var tokens = tweet.message.tokenizeAndStem();
			tokens.forEach(function(token) {
				if(map[token]) {
					map[token]++;
				} else {
					map[token] = 1;
				}
			});
		});
		return map;
	}

	var filterTweetsWithCommonTheme = function(tweets) {
		var theme = getFrequentHashtag(tweets);
		var relevantTweets {
			geoRelated : [],
			hashtagRelated: [],
			atsRelated: [],
			length: 0
		};

		for (key in tweets) {
			if(Array.isArray(tweets[key])) {
				tweets[key].forEach(function(tweet) {
					//Check the message of each tweet to see if the theme exists.
					if(tweet.message.toLowerCase().indexOf(theme) !== -1) {
						relevantTweets[key].push(tweet);
					}
				});
			}
		}

		relevantTweets.length = relevantTweets.geoRelated.length 
					+ relevantTweets.hashtagRelated.length
					+ relevantTweets.atsRelated.length;

		return relevantTweets;
	}

	var getFrequentHashtag = function(tweets) {
		var map = [];

		for(key in tweets) {
			if(Array.isArray(tweets[key])) {
				tweets[key].forEach(function(tweet) {
					tweet.hashtags.forEach(function(hashtag) {
						if(map[hashtag]) {
							map[hashtag]++;
						} else {
							map[hashtag] = 1;
						}
					});
				});
			}
		}

		var maxFreq = 0;
		var hashtag = null;
		for(key in map) {
			if (map[key] > maxFreq) {
				maxFreq = map[key];
				hashtag = key;
			}
		}
		return hashtag;
	}

	var getUserMentionsFrequency = function(tweets) {
		var map = [];

		for(key in tweets) {
			if(Array.isArray(tweets[key])) {
				tweets[key].forEach(function(tweet) {
					tweet.user_mentions.forEach(function(hashtag) {
						if(map[hashtag]) {
							map[hashtag]++;
						} else {
							map[hashtag] = 1;
						}
					});
				});
			}
		}
		for(key in map) {
			if (map[key] === 1) {
				delete map[key];
			}
		}
		// If there are any users that are mentioned more than once in the candidate, give more points.
		return map;
	}

	return {
		getFrequentHashtag : getFrequentHashtag,
		getUserMentionsFrequency : getUserMentionsFrequency
	}

}();