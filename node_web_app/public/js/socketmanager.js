// The SocketManager object manages socket data transfers
function SocketManager(appManager) {
  this.socket = io.connect('http://localhost');

  this.initializeSocketConnections = function() {
    this.socket.emit('join hashtagcloud');
    this.socket.emit('join dbconnect');
    this.socket.emit('join regionrequest');
  }

  this.getTimePlay = function() {
    this.socket.emit('time_play_request');
  };

  this.initializeSocketEvents = function() {
    this.socket.on('hashtag tweet', function(data) {
      appManager.updateData(data.data);
    });

    this.socket.on('new tweets', function(data) {
      if (data !== null) {
        var regionTweets = [];
        appManager.regions.forEach(function(element) {
            regionTweets.push([]);
        }, this);

        var numRegions = regionTweets.length;
        data.data.forEach(function(element, index){
          if (element.region >= 0 && element.region < numRegions) {
            regionTweets[element.region].push(element);
          }
        }, this);
        
        // add tweets to each region
        regionTweets.forEach(function(element, index){
          appManager.mapManager.regionObjects[index].createTweets(element);
        }, this);
      }
    });

    this.socket.on('region history', function(data) {
      if (appManager.state === VANCOUVER_PLAYBACK) {
        appManager.playback(data.data[0], data.data[1], appManager.playbackSpeed);
      } else if (appManager.state == REGION_ETERNITY) {
        appManager.updateRegionGraph(data.data[0]);
        console.log(data);
      }
    });
  }
}