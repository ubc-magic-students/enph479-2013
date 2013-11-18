function PlaybackManager(regions) {
  mediator.installTo(this);

  var playbackInstances = [];
  var playbackInstancesLength;

  var playbackSpeed;
  var playbackTweets = [];
  var playbackId;

  var currentPlaybackInstance = 0;

  this.subscribe(EVENTS.CALL_FOR_TIMEPLAY, function(speed) {
    playbackSpeed = 1000/speed;
  });

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function(data) {
    var data = JSON.parse(JSON.stringify(data));
    processPlayback(data[0], data[1]);
  });

  this.subscribe(EVENTS.STOP_TIMEPLAY, function() {
    stopPlayback();
  });

  this.subscribe(EVENTS.PAUSE_TIMEPLAY, function() {
    pausePlayback();
  });

  this.subscribe(EVENTS.RESUME_TIMEPLAY, function() {
    resumePlayback();
  });

  this.subscribe(EVENTS.TIMEPLAY_JUMP, function(playbackInstanceCounter) {
    currentPlaybackInstance = playbackInstanceCounter;
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
      playbackInstances[indexCounter].indexCounter = indexCounter;
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
    playPlayback();
  }

  var playPlayback = function() {
    playbackId = setInterval(function() {
      if (currentPlaybackInstance <= playbackInstancesLength) {
        mediator.publish(EVENTS.SHOW_TIMEPLAY, playbackInstances[currentPlaybackInstance]);
        currentPlaybackInstance++;
      } else {
        stopPlayback();
      }
    }, playbackSpeed);
  };

  var stopPlayback = function() {
    clearInterval(playbackId);
    mediator.publish(EVENTS.STOP_TIMEPLAY);
    currentPlaybackInstance = 0;
  }

  var pausePlayback = function() {
    clearInterval(playbackId);
  };

  var resumePlayback = function() {
    playPlayback();
  };

  function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
  }
}