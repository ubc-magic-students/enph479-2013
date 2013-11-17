 // The Map Manager object manages all map components, including regions and tweets
function MapManager(regions, mapMaker, map) {

  mediator.installTo(this);
  this.registerCallbacks([{
    channel:  EVENTS.INITIALIZE,
    fn:       function() {
                initializeRegions();
              }
  }, {
    channel:  EVENTS.ZOOM_TO_REGION,
    fn:       function(regionId) {
                goToRegion(regionId);
              }
  }, {
    channel:  EVENTS.ZOOM_OUT,
    fn:       function() {
                goToCity();
              }
  }, {
    channel:  EVENTS.REGION_UPDATE,
    fn:       function(data) {
                saveLastUpdated(data);
              }
  }, {
    channel:  EVENTS.SHOW_REGION_UPDATE,
    fn:       function(regionId) {
                showLastUpdated(regionId);
              }
  }, {
    channel:  EVENTS.CALL_FOR_TIMEPLAY,
    fn:       function(speed) {
                goToDisabledCity();
                playbackSpeed = 1000/speed;
              }
  }, {
    channel:  EVENTS.TWEET_UPDATE,
    fn:       function(data) {
                processTweetUpdate(data);
              }
  }, {
    channel:  EVENTS.INITIALIZE_TIMEPLAY,
    fn:       function(data) {
                playback(data[0], data[1], playbackSpeed);

              }
  }, {
    channel:  EVENTS.SHOW_TIMEPLAY,
    fn:       function(time, tableData) {
                showTimeplay(tableData);
              }
  }, {
    channel:  EVENTS.STOP_TIMEPLAY,
    fn:       function() {
                stopTimeplay();
              }
  }]);

  var regionObjects = [];
  var infoWindow = mapMaker.makeInfoWindow();
  var lastUpdated;

  var playbackSpeed;
  var playbackTweets = [];
  var playbackId;

  var initializeRegions = function() {
    regions.forEach(function(element) {
      regionObjects.push(new Region(element, mapMaker, map));
    });

    regionObjects.forEach(function(element) {
      element.showPublicRegion();
    });
  }

  var goToRegion = function(region) {
    map.setCenter(regionObjects[region].regionBoundary.bounds.getCenter());
    map.setZoom(14);
    removeRegions();
    regionObjects[region].showPrivateRegion();
  }

  var goToCity = function() {
    map.setCenter(new google.maps.LatLng(49.255, -123.125));
    map.setZoom(12);
    showRegions();
    enableRegions();
  }

  var goToDisabledCity = function() {
    map.setCenter(new google.maps.LatLng(49.255, -123.125));
    map.setZoom(12);
    disableRegions();
  }

  var enableRegions = function() {
    regionObjects.forEach(function(element) {
      element.addRegionListener();
    });
  }

  var disableRegions = function() {
    regionObjects.forEach(function(element) {
      element.removeRegionListener();
    });
  }

  var showRegions = function() {
    regionObjects.forEach(function(element) {
      element.showPublicRegion();
    });
  }

  var removeRegions = function() {
    regionObjects.forEach(function(element) {
      element.hideRegion();
    });
  }

  var processTweetUpdate = function(data) {
    if (data !== null) {
      var regionTweets = [];
      regions.forEach(function(element) {
        regionTweets.push([]);
      });

      var numRegions = regionTweets.length;
      data.forEach(function(element, index){
        if (element.region >= 0 && element.region < numRegions) {
          regionTweets[element.region].push(element);
        }
      });
      
      // add tweets to each region
      regionTweets.forEach(function(element, index){
        regionObjects[index].createTweets(element, infoWindow);
      });
    }
  }

  var playback = function(regionData, tweetData, speed) {
    var regionLength = regions.length;

    regionObjects.forEach(function(element) {
      element.hideRegionCount();
    });

    function setCharAt(str,index,chr) {
      if(index > str.length-1) return str;
      return str.substr(0,index) + chr + str.substr(index+1);
    }
    
    var arrayPIT;
    playbackId = setInterval(function() {
      var playTweet = [];
      if (regionData.length !== 0) {
        arrayPIT = regionData.splice(0,regionLength);
        arrayPIT[0].timestamp = setCharAt(arrayPIT[0].timestamp, 19, '.');

        mediator.publish(EVENTS.SHOW_TIMEPLAY, new Date(arrayPIT[0].timestamp), arrayPIT);
        
        var tweet_date;
        
        var play_date = new Date(arrayPIT[0].timestamp);

        tweetData.some(function(element, index) {
          tweet_date = new Date(element.timestamp);
          if (play_date > tweet_date) {
            playTweet.push(tweetData.shift());
          } else {
            return true;
          }
        }, this);
        addplaybackTweets(playTweet);
      } else {
        mediator.publish(EVENTS.STOP_TIMEPLAY);
      }
    }, speed);
  }

  var addplaybackTweets = function(tweets) {
    tweets.forEach(function(element, index) {
      var vTweet = new Tweet(new google.maps.LatLng(element.lat, element.lng), element, mapMaker, map, infoWindow, true);
      vTweet.show();
      playbackTweets.push(vTweet);
    }, this);
  };

  var showTimeplay = function(tableData) {
    tableData.forEach(function(element, index) {
      regionObjects[index].changeRegionColor(element.sentiment, element.weather);
    });
  }

  var stopTimeplay = function() {
    clearInterval(playbackId);
    showLastUpdated();
    enableRegions();
  }

  var saveLastUpdated = function(data) {
    lastUpdated = [];
    regionObjects.forEach(function(element, index) {
      lastUpdated.push([data[index].currentSentimentAverage, data[index].currentWeatherAverage, data[index].tweetCount]);
    });
  }

  var showLastUpdated = function(regionId) {
    if (regionId && regionId !== -1) {
      if (lastUpdated) {
        regionObjects[regionId].changeRegionColor(lastUpdated[regionId][0], lastUpdated[regionId][1]);
        regionObjects[regionId].changeRegionCount(lastUpdated[regionId][2]);
      } else {
        regionObjects[regionId].changeRegionColor();
        regionObjects[regionId].changeRegionCount('-');
      }
      
    } else {
      if (lastUpdated) {
        regionObjects.forEach(function(element, index) {
          element.changeRegionColor(lastUpdated[index][0], lastUpdated[index][1]);
          element.changeRegionCount(lastUpdated[index][2]);
        });
      } else {
        regionObjects.forEach(function(element) {
          element.changeRegionColor();
          element.changeRegionCount('-');
        });
      }
    }
  }
}