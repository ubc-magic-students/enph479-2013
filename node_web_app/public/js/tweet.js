// The Tweet object holds all the tweet information
function Tweet(pos, tweetObject, mapMaker, map, infoWindow, expiring) {

  var marker = mapMaker.makeTweetMarker(pos);
  var message = tweetObject.message;
  var timestamp = new Date(tweetObject.timestamp);
  var sentiment = tweetObject.sentimentPolarity;
  var weather = tweetObject.weatherScore;
  var infoContent = '<div class="bubble-info">' 
              + '<dl>'
              + '<dt>' + timestamp + '</dt>'
              + '<dd>' + message + '</dd>' + '</br>'
              + '<dt>Sentiment Score: ' + sentiment + ' | Weather Score: ' + weather.toFixed(3) + '</dt>'
              + '</dl>'
              + '</div>';

  var listener = google.maps.event.addListener(marker, 'click', function() {
      infowindow.close();
      infowindow.setContent(infoContent);
      infowindow.open(map, marker)
  });
  this.show = function() {
    marker.setMap(map);
    if (expiring) {
      setTimeout(function() {
        that.hide();
      }, 2000);
    }
  }
  this.hide = function() {
    marker.setMap(null);
  }
}