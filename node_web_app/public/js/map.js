$(function() {
  
  var map;
  var circles = [];

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

  function addCircle(location, size) {
    var circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      center: location,
      radius: size*10000,
      map: map
    });
    circles.push(circle);
  }

  function setAllMap(map) {
    for (var i = 0; i < circles.length; i++) {
      circles[i].setMap(map);
    }
  }


  function clearCircles() {
    setAllMap(null);
  }

  function deleteCircles() {
    clearCircles();
    circles = [];
  }

  function addNewTweet(tweet) {
    deleteCircles();
    //$('div#content').append('<div class="tweetbox">' + tweet + '</div>');
    clusterCollection = $.parseJSON(tweet);
    for (var cluster in clusterCollection) {
      if (clusterCollection.hasOwnProperty(cluster)) {
        console.log("lat: "+clusterCollection[cluster].centerLat+", long: "+clusterCollection[cluster].centerLong+", rad: "+clusterCollection[cluster].clusterRadius);
        clusterLatLng = new google.maps.LatLng(clusterCollection[cluster].centerLat,clusterCollection[cluster].centerLong);
        addCircle(clusterLatLng, clusterCollection[cluster].clusterRadius);
      }
    }
    setAllMap(map);
    console.log("CIRCLES ON MAP");
  }

  google.maps.event.addDomListener(window, 'load', initialize);
});
  