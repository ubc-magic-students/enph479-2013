function PlaybackManager(regions) {
  mediator.installTo(this);

  var playbackInstances = [];
  var playbackInstancesLength;

  var playbackSpeed;
  var playbackTweets = [];
  var playbackId;

  this.subscribe(EVENTS.CALL_FOR_TIMEPLAY, function(speed) {
    playbackSpeed = 1000/speed;
  });

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function(data) {
    processPlayback(data[0], data[1]);
  });

  this.subscribe(EVENTS.STOP_TIMEPLAY, function() {
    stopPlayback();
  });

  var processPlayback = function(regionData, tweetData) {
    playbackInstances = [];
    playbackInstancesLength = 0;
    var regionLength = regions.length;

    var arrayPIT;
    var indexCounter = 0;

    var tweet_date;
    var play_date;

    while (regionData.length !== 0) {
      playbackInstances[indexCounter] = {};
      playbackInstances[indexCounter].regionData = regionData.splice(0, regionLength);
      playbackInstances[indexCounter].timestamp = (new Date(setCharAt(playbackInstances[indexCounter].regionData[0].timestamp, 19, '.'))).toLocaleString();
      playbackInstances[indexCounter].tweets = [];
      play_date = new Date(playbackInstances[indexCounter].timestamp);
      tweetData.some(function(element, index) {
        tweet_date = new Date(element.timestamp);
        if (play_date > tweet_date) {
          playbackInstances[indexCounter].tweets.push(tweetData.shift());
        } else {
          return true;
        }
      });
      indexCounter++;
    }
    playbackInstancesLength = playbackInstances.length;

    //play playback
    playbackCounter = 0;
    playbackId = setInterval(function() {
      if (playbackCounter <= playbackInstancesLength) {
        mediator.publish(EVENTS.SHOW_TIMEPLAY, playbackInstances[playbackCounter]);
        playbackCounter++;
      } else {
        mediator.publish(EVENTS.STOP_TIMEPLAY);
      }
    }, playbackSpeed);
  }

  var stopPlayback = function() {
    clearInterval(playbackId);
  }

  function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
  }
}