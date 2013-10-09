$(function () {

  // join the appropriate hashtag room
  var socket = io.connect('http://www.realtimetagcloud.com');
  socket.emit('join tweetfeed', { hashtag: hashtag_name });
  
  var tweet_array = []; // buffer array to hold tweets until they're displayed

  socket.on('tweet', function(data) {
      tweet_array.push(data.tweet);
      if (tweet_array.length == 1) {  // when the buffer gets it's first tweet,
        addNewTweet();                // call a recursive function that displays 
      }                               // tweets until the buffer is empty
  });

  socket.on('close', function () {
	window.location.replace('/');
  });
  
  // fade out the oldest tweet and slide up the remaining tweets
  function removeOldTweet(callback) {
    var height = "-=" + $('div.tweetbox').first()[0].offsetHeight + "px";
    $('div.tweetbox').first().animate({ opacity: 0 }, 1000, function() {
      $(this).slideUp(500, function() {
        $(this).remove();
        callback();
      });
    });
  }
  
  // fade in the newest tweet, and call the display function if the buffer isn't empty
  function addNewTweet() {
    var tweet = tweet_array[0];
    $('div#content').append('<div class="tweetbox">' + tweet + '</div>');
    handleTweetfeed();
  }
  
  function handleTweetfeed() {
    if ($('body')[0].clientHeight > $(window).height()) {
        removeOldTweet(function () {
            handleTweetfeed();
        });
    } else {
        $('div.tweetbox').last().animate({ opacity: 1 }, 1000, function() {
          tweet_array.shift();
          if (tweet_array.length > 0) {
            addNewTweet();
          }
        });
    }
  }

  // hashtag header pulses until a tweet is displayed
  (function pulse() {
    $('header').delay(500).fadeTo('slow', 0).delay(500).fadeTo('slow', 1, function () {
        if ($('div.tweetbox').length === 0) {
            pulse();
        }
    });
  })();
});