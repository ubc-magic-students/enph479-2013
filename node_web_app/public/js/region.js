// The Region object holds all the map elements and information specific to a region
function Region(regionInfo, mapManager) {
  var that = this;
  this.count = '-';
  this.tweets = [];
  this.regionId = regionInfo.id;
  this.mapManager = mapManager;
  this.printCount = true;
  this.printTweets = false;
  this.listenedTo = true;

  this.regionBoundary = mapManager.mapMaker.makeRegionBorder(
    new google.maps.LatLng(regionInfo.bb[0].lat, regionInfo.bb[0].lng),
    new google.maps.LatLng(regionInfo.bb[1].lat, regionInfo.bb[1].lng)
  );

  this.regionListener = google.maps.event.addListener(this.regionBoundary, 'click', function() {
    that.mapManager.appManager.changeState(REGION_ETERNITY, that.regionId);
  });

  this.removeRegionListener = function() {
    if (this.listenedTo === true) {
      console.log('listener removed');
      google.maps.event.removeListener(this.regionListener);
      this.listenedTo = false;
    }
  }

  this.addRegionListener = function() {
    if (this.listenedTo === false) {
      google.maps.event.addListener(this.regionBoundary, 'click', function() {
        that.mapManager.appManager.changeState(REGION_ETERNITY, that.regionId);
      });
      this.listenedTo = true;
    }
  }

  this.regionLabel = mapManager.mapMaker.makeRegionLabel(
    regionInfo.name,
    this.regionBoundary.bounds.getCenter()
  );

  this.showPublicRegion = function() {
    this.regionBoundary.setMap(mapManager.map);
    this.regionLabel.setMap(mapManager.map);
    this.tweets.forEach(function(element, index) {
      element.hide();
    }, this);
    this.printCount = true;
    this.printTweets = false;
  }

  this.showPrivateRegion = function() {
    this.regionBoundary.setMap(mapManager.map);
    this.regionLabel.setMap(mapManager.map);
    this.showTweets();
    this.printCount = true;
    this.printTweets = true;
  }

  this.hideRegion = function() {
    this.regionBoundary.setMap(null);
    this.regionLabel.setMap(null);
    this.tweets.forEach(function(element, index) {
      element.hide();
    }, this);
    this.printCount = false;
    this.printTweets = false;
  }

  this.createTweets = function(data) {
    var tweet;
    data.forEach(function(element, index) {
      tweet = new Tweet(this, new google.maps.LatLng(element.lat, element.lng), element);
      this.tweets.push(tweet);
      //console.log('count ' + this.tweets.length);
    }, this);
    if (this.printTweets == true) {
      this.showTweets();
    } else {
      //console.log('DIDNT PRINT');
    }
  }

  this.showTweets = function() {
    this.tweets.forEach(function(element, index) {
      element.show();
    });
  }
}