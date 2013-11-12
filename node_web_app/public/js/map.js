$(function() {
  var appManager = new AppManager(REGIONS);
  appManager.initializeApp();
});

var VANCOUVER_ETERNITY = 0,
  REGION_ETERNITY = 1,
  VANCOUVER_PLAYBACK = 2;

// The App Manager object orchestrates the operations of the entire application
function AppManager(regions) {
  this.mapManager = new MapManager(regions, this);
  this.tableManager = new TableManager(regions);
  this.timeManager = new TimeManager();
  this.socketManager = new SocketManager(this);
  this.graphManager = new GraphManager();
  this.regions = regions;
  this.playbackId;
  this.playbackTweets = [];
  this.playbackSpeed;
  this.regionIdForRegionView = -1;

  this.state = VANCOUVER_ETERNITY;
  
  this.initializeApp = function() {
    google.maps.event.addDomListener(window, 'load', this.mapManager.initializeMap());

    this.socketManager.initializeSocketConnections();
    this.socketManager.initializeSocketEvents();
    this.tableManager.initializeDataset();
    //this.timeManager.initializeTime();

    
    mediator.publish('initialize');
  }

  this.changeState = function(state, region) {
    console.log("STATE CHANGE: " + state);
    console.log("REGION CHANGE: " + region);
    this.state = state;
    this.regionIdforRegionView = region;
    if (region !== undefined) {
      this.mapManager.changeState(state, region);
    } else {
      this.mapManager.changeState(state, -1);
    }
    
    if (state === VANCOUVER_PLAYBACK) {
      this.callForPlaybackData();
    } else {
      mediator.publish('showUpdate');
      console.log('clear interval called');
      clearInterval(this.playbackId);
      //this.timeManager.showLastUpdated();
      this.regionIdForRegionView = -1;
      if (state === REGION_ETERNITY) {
        this.justCallForPlaybackData();
        this.regionIdForRegionView = region;
        this.tableManager.showLastUpdatedRegion(region);
      } else {
        this.tableManager.showLastUpdated();
      }
      this.playbackTweets.forEach(function(element) {
        element.hide();
      }, this);
      this.playbackTweets = [];
    }
  }

  this.justCallForPlaybackData = function() {
    this.socketManager.getTimePlay();
  }

  this.callForPlaybackData = function() {
    this.socketManager.getTimePlay();
    mediator.publish('callForTimePlay');
    //this.timeManager.showMessage("Going back in time, please stand by...");
  }

  this.playback = function(regionData, tweetData, speed) {
    mediator.publish('initializeTimePlay');
    //this.timeManager.showMessage("Time traveling commencing...");
    //this.changeState(VANCOUVER_PLAYBACK);
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
        that.tableManager.updatePlayTable(arrayPIT);

        mediator.publish('showTimePlay', new Date(arrayPIT[0].timestamp));
        
        //that.timeManager.showPlayTime(new Date(arrayPIT[0].timestamp));
        
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
      } else {
        clearInterval(that.playbackId);
        that.changeState(VANCOUVER_ETERNITY);
      }
    }, speed);
  }

  this.addplaybackTweets = function(tweets) {
    tweets.forEach(function(element, index) {
      var vTweet = new VancouverTweet(this, new google.maps.LatLng(element.lat, element.lng), element);
      vTweet.show();
      this.playbackTweets.push(vTweet);
    }, this);
  };

  this.updateData = function(data) {
    console.log('STATE AT UPDATE: ' + this.state);
    data = $.parseJSON(data);

    mediator.publish('saveUpdate');

    // update Time
    //this.timeManager.saveLastUpdated();
    
    // update Table
    this.tableManager.saveLastUpdated(data);

    if (this.state !== VANCOUVER_PLAYBACK) {
      this.showUpdate();
      mediator.publish('showUpdate');
    }
  }

  this.showUpdate = function() {
    console.log('update shown');
    //this.timeManager.showLastUpdated();
    if(this.state === REGION_ETERNITY) {
      this.tableManager.showLastUpdatedRegion(this.regionIdForRegionView);
    } else { 
      this.tableManager.showLastUpdated();
    }
  }

  this.updateRegionGraph = function(data) {
    this.graphManager.updateRegionGraph(data, this.regionIdforRegionView);
  }
}