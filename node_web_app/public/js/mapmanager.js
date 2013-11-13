 // The Map Manager object holds a MapMaker and all the Region objects, orchestrating the map operations
function MapManager(regions, mapMaker, map) {
  mediator.installTo(this);

  this.regions = regions;
  this.map = map;
  this.mapMaker = mapMaker;
  this.regionInfos = regions;
  this.regionObjects = [];
  this.infoWindow = this.mapMaker.makeInfoWindow();

  this.playbackSpeed;
  this.playbackTweets = [];
  this.playbackId;

  this.subscribe(EVENTS.INITIALIZE, function() {
    this.initializeRegions();
  });

  this.subscribe(EVENTS.ZOOM_TO_REGION, function(regionId) {
    this.goToRegion(regionId);
  });

  this.subscribe(EVENTS.ZOOM_OUT, function() {
    this.goToCity();
  });

  this.subscribe(EVENTS.CALL_FOR_TIMEPLAY, function() {
    this.goToDisabledCity();
  });

  this.subscribe(EVENTS.TWEET_UPDATE, function(data) {
    this.processTweetUpdate(data);
  });

  this.subscribe(EVENTS.CALL_FOR_TIMEPLAY, function(speed) {
    this.playbackSpeed = 1000/speed;
  });

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function(data) {
    this.playback(data[0], data[1], this.playbackSpeed);
  });

  this.subscribe(EVENTS.STOP_TIMEPLAY, function() {
    clearInterval(this.playbackId);
    this.enableRegions();
  });

  this.initializeRegions = function() {
    this.regionInfos.forEach(function(element) {
      this.regionObjects.push(new Region(element, this.mapMaker, this.map));
    }, this);

    this.regionObjects.forEach(function(element) {
      element.showPublicRegion();
    }, this);
  }

  this.goToRegion = function(region) {
    this.map.setCenter(this.regionObjects[region].regionBoundary.bounds.getCenter());
    this.map.setZoom(14);
    this.removeRegions();
    this.regionObjects[region].showPrivateRegion();
  }

  this.goToCity = function() {
    this.map.setCenter(new google.maps.LatLng(49.255, -123.125));
    this.map.setZoom(12);
    this.showRegions();
    this.enableRegions();
  }

  this.goToDisabledCity = function() {
    this.map.setCenter(new google.maps.LatLng(49.255, -123.125));
    this.map.setZoom(12);
    this.disableRegions();
  }

  this.enableRegions = function() {
    console.log('enableRegions called');
    this.regionObjects.forEach(function(element) {
      element.addRegionListener();
    }, this);
  }

  this.disableRegions = function() {
    this.regionObjects.forEach(function(element) {
      element.removeRegionListener();
    }, this);
  }

  this.showRegions = function() {
    this.regionObjects.forEach(function(element) {
      element.showPublicRegion();
    }, this);
  }

  this.removeRegions = function() {
    this.regionObjects.forEach(function(element) {
      element.hideRegion();
    }, this);
  }

  this.processTweetUpdate = function(data) {
    if (data !== null) {
        var regionTweets = [];
        this.regions.forEach(function(element) {
            regionTweets.push([]);
        }, this);

        var numRegions = regionTweets.length;
        data.forEach(function(element, index){
          if (element.region >= 0 && element.region < numRegions) {
            regionTweets[element.region].push(element);
          }
        }, this);
        
        // add tweets to each region
        regionTweets.forEach(function(element, index){
          this.regionObjects[index].createTweets(element, this.infoWindow);
        }, this);
    }
  }

  this.playback = function(regionData, tweetData, speed) {
    var regionLength = this.regions.length;

    function setCharAt(str,index,chr) {
      if(index > str.length-1) return str;
      return str.substr(0,index) + chr + str.substr(index+1);
    }
    
    var that = this;
    var arrayPIT;
    this.playbackId = setInterval(function() {
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
        that.addplaybackTweets(playTweet);
      }
    }, speed);
  }

  this.addplaybackTweets = function(tweets) {
    tweets.forEach(function(element, index) {
      var vTweet = new Tweet(new google.maps.LatLng(element.lat, element.lng), element, this.mapMaker, this.map, this.infoWindow, true);
      vTweet.show();
      this.playbackTweets.push(vTweet);
    }, this);
  };

}