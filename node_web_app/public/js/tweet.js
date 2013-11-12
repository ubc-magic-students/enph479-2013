// The Tweet object holds all the tweet information
function Tweet(region, pos, tweetObject) {
  this.marker = region.mapManager.mapMaker.makeTweetMarker(pos);
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
  this.infowindow = region.mapManager.infowindow;
  var that = this;
  this.listener = google.maps.event.addListener(this.marker, 'click', function() {
      that.infowindow.close();
      that.infowindow.setContent(that.infoContent);
      that.infowindow.open(region.mapManager.map, that.marker)
      //region.mapManager.appManager.tweetManager.showTweet(that.message);
  }, this);
  this.show = function() {
    this.marker.setMap(region.mapManager.map);
  }
  this.hide = function() {
    this.marker.setMap(null);
  }
}

// The VancouverTweet object holds all the tweet information
function VancouverTweet(appManager, pos, tweetObject) {
  this.marker = appManager.mapManager.mapMaker.makeTweetMarker(pos);
  this.message = tweetObject.message;
  this.timestamp = new Date(tweetObject.timestamp);
  this.sentiment = tweetObject.sentimentPolarity;
  this.weather = tweetObject.weatherScore;
  this.infoContent = '<div class="bubble-info">' 
              + '<dl>'
              + '<dt>' + this.timestamp + '</dt>'
              + '<dd>' + this.message + '</dd>'
              + '<dt>Sentiment Score: ' + this.sentiment + ' | Weather Score: ' + this.weather.toFixed(3) + '</dt>'
              + '</dl>'
              + '</div>';
  this.infowindow = appManager.mapManager.infowindow;
  var that = this;
  this.listener = google.maps.event.addListener(this.marker, 'click', function() {
      that.infowindow.close();
      that.infowindow.setContent(that.infoContent);
      that.infowindow.open(appManager.mapManager.map, that.marker)
      //region.mapManager.appManager.tweetManager.showTweet(that.message);
  }, this);
  this.show = function() {
    this.marker.setMap(appManager.mapManager.map);
    setTimeout(function() {
      that.hide();
    }, 2000);
  }
  this.hide = function() {
    this.marker.setMap(null);
  }
}