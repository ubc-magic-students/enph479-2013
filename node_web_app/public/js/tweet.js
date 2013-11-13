// The Tweet object holds all the tweet information
function Tweet(pos, tweetObject, mapMaker, map, infoWindow, expiring) {
  this.mapMaker = mapMaker;
  this.map = map;

  this.marker = this.mapMaker.makeTweetMarker(pos);
  this.message = tweetObject.message;
  this.timestamp = new Date(tweetObject.timestamp);
  this.sentiment = tweetObject.sentimentPolarity;
  this.weather = tweetObject.weatherScore;
  this.infoContent = '<div class="bubble-info">' 
              + '<dl>'
              + '<dt>' + this.timestamp + '</dt>'
              + '<dd>' + this.message + '</dd>' + '</br>'
              + '<dt>Sentiment Score: ' + this.sentiment + ' | Weather Score: ' + this.weather.toFixed(3) + '</dt>'
              + '</dl>'
              + '</div>';
  this.infowindow = infoWindow;
  var that = this;
  this.listener = google.maps.event.addListener(this.marker, 'click', function() {
      that.infowindow.close();
      that.infowindow.setContent(that.infoContent);
      that.infowindow.open(that.map, that.marker)
  }, this);
  this.show = function() {
    this.marker.setMap(this.map);
    if (expiring) {
      setTimeout(function() {
        that.hide();
      }, 2000);
    }
  }
  this.hide = function() {
    this.marker.setMap(null);
  }
}