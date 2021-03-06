// The Region object holds all the map elements and information specific to a region
function Region(regionInfo, mapMaker, map) {  
  var count = '-';
  var tweets = [];

  var printCount = true;
  var printTweets = false;
  var listenedTo = true;

  this.regionBoundary = mapMaker.makeRegionBorder(
    new google.maps.LatLng(regionInfo.bb[0].lat, regionInfo.bb[0].lng),
    new google.maps.LatLng(regionInfo.bb[1].lat, regionInfo.bb[1].lng)
  );

  var regionListener = google.maps.event.addListener(this.regionBoundary, 'click', function() {
    mediator.publish(EVENTS.ZOOM_TO_REGION, regionInfo.id);
  });

  this.removeRegionListener = function() {
    console.log('region listener removed');
    google.maps.event.removeListener(regionListener);
  }

  this.addRegionListener = function() {
    console.log('region listener added');
    google.maps.event.addListener(this.regionBoundary, 'click', function() {
      mediator.publish(EVENTS.ZOOM_TO_REGION, regionInfo.id);
    });
  }

  var regionLabel = mapMaker.makeRegionLabel(
    regionInfo.name,
    this.regionBoundary.bounds.getCenter()
  );

  var regionCountLabel = mapMaker.makeRegionCountLabel('-', this.regionBoundary.bounds.getCenter());

  this.changeRegionCount = function(count) {
    regionCountLabel.setMap(null);
    regionCountLabel = mapMaker.makeRegionCountLabel(count || '-', this.regionBoundary.bounds.getCenter());
    regionCountLabel.setMap(map);
  }

  this.changeRegionColor = function(sentiment, weather) {
    if (sentiment !== undefined && weather !== undefined) {
      // red is positive sentiment, blue is negative
      sentiment = Math.round(sentiment / 4 * 255);
      var color_string = "rgb " + sentiment + " 00 " + new String(255-sentiment);
      rgbColor = tinycolor(color_string);
      hsvColor = rgbColor.toHsl();

      // lighter color is good weather, darker is bad
      if (weather == -1) {
        weather = 5;
      }
      weather = Math.round(weather * 7);
      hsvColor.v = weather + 30;
      var color = tinycolor(hsvColor).toRgbString();
    }
    this.removeRegionListener();
    this.regionBoundary.setMap(null);
    this.regionBoundary = mapMaker.makeRegionBorder(
      new google.maps.LatLng(regionInfo.bb[0].lat, regionInfo.bb[0].lng),
      new google.maps.LatLng(regionInfo.bb[1].lat, regionInfo.bb[1].lng),
      color || null
    );
    this.regionBoundary.setMap(map);
    if (listenedTo == true) {
      this.addRegionListener();
    }
  }

  this.hideRegionCount = function() {
    regionCountLabel.setMap(null);
  }

  this.showPublicRegion = function() {
    this.regionBoundary.setMap(map);
    regionLabel.setMap(map);
    regionCountLabel.setMap(map);
    tweets.forEach(function(element, index) {
      element.hide();
    });
    printCount = true;
    printTweets = false;
    listenedTo = true;
  }

  this.showPrivateRegion = function() {
    this.regionBoundary.setMap(map);
    regionLabel.setMap(map);
    regionCountLabel.setMap(map);
    this.showTweets();
    printCount = true;
    printTweets = true;
    listenedTo = false;
  }

  this.hideRegion = function() {
    this.regionBoundary.setMap(null);
    regionLabel.setMap(null);
    regionCountLabel.setMap(null);
    tweets.forEach(function(element, index) {
      element.hide();
    });
    printCount = false;
    printTweets = false;
    listenedTo = false;
  }

  this.createTweets = function(data, infoWindow) {
    var tweet;
    data.forEach(function(element, index) {
      tweet = new Tweet(new google.maps.LatLng(element.lat, element.lng), element, mapMaker, map, infoWindow, false);
      tweets.push(tweet);
      //console.log('count ' + this.tweets.length);
    });
    if (printTweets == true) {
      this.showTweets();
    } else {
      //console.log('DIDNT PRINT');
    }
  }

  this.showTweets = function() {
    tweets.forEach(function(element, index) {
      element.show();
    });
  }
}