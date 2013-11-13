// The Region object holds all the map elements and information specific to a region
function Region(regionInfo, mapMaker, map) {
  var that = this;
  this.map = map;
  this.count = '-';
  this.tweets = [];
  this.regionId = regionInfo.id;
  this.mapMaker = mapMaker;
  this.printCount = true;
  this.printTweets = false;
  this.listenedTo = true;

  this.regionBoundary = this.mapMaker.makeRegionBorder(
    new google.maps.LatLng(regionInfo.bb[0].lat, regionInfo.bb[0].lng),
    new google.maps.LatLng(regionInfo.bb[1].lat, regionInfo.bb[1].lng)
  );

  this.regionListener = google.maps.event.addListener(this.regionBoundary, 'click', function() {
    mediator.publish(EVENTS.ZOOM_TO_REGION, that.regionId);
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
        mediator.publish(EVENTS.ZOOM_TO_REGION, that.regionId);
      });
      this.listenedTo = true;
    }
  }

  this.regionLabel = this.mapMaker.makeRegionLabel(
    regionInfo.name,
    this.regionBoundary.bounds.getCenter()
  );

  this.showPublicRegion = function() {
    this.regionBoundary.setMap(this.map);
    this.regionLabel.setMap(this.map);
    this.tweets.forEach(function(element, index) {
      element.hide();
    }, this);
    this.printCount = true;
    this.printTweets = false;
  }

  this.showPrivateRegion = function() {
    this.regionBoundary.setMap(this.map);
    this.regionLabel.setMap(this.map);
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

  this.createTweets = function(data, infoWindow) {
    var tweet;
    data.forEach(function(element, index) {
      tweet = new Tweet(new google.maps.LatLng(element.lat, element.lng), element, this.mapMaker, this.map, infoWindow, false);
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