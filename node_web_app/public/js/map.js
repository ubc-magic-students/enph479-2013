$(function() {
  
  var map;
  var markers = [];

  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(49.25, -123.1),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  }

  var socket = io.connect('http://localhost');
  socket.emit('join hashtagcloud');

  socket.on('hashtag tweet', function(data) {
    addNewTweet(data.data);
  });

  var clusterLatLng;

  function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);
  }

  function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }


  function clearMarkers() {
    setAllMap(null);
  }

  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  function addNewTweet(tweet) {
    deleteMarkers();
    //$('div#content').append('<div class="tweetbox">' + tweet + '</div>');
    clusterCollection = $.parseJSON(tweet);
    for (var cluster in clusterCollection) {
      if (clusterCollection.hasOwnProperty(cluster)) {
        console.log("lat: "+clusterCollection[cluster].centerLat+", long: "+clusterCollection[cluster].centerLong);
        clusterLatLng = new google.maps.LatLng(clusterCollection[cluster].centerLat,clusterCollection[cluster].centerLong);
        addMarker(clusterLatLng);
        //console.log("MARKER MADE");
      }
    }
    setAllMap(map);
    console.log("MARKERS ON MAP");
  }

  google.maps.event.addDomListener(window, 'load', initialize);
});
  