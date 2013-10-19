$(function() {
  
  var map;
  var circles = [];
  var icons = [];

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

  function addIcon(location, icon_path) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: {
        url: icon_path,
      }
    });
    icons.push(marker);
  }

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
    for (var i = 0; i < icons.length; i++) {
      icons[i].setMap(map);
    }
  }


  function clearMap() {
    setAllMap(null);
  }

  function deleteMap() {
    clearMap();
    icons = [];
    circles = [];
  }

  function addNewTweet(tweet) {
    deleteMap();
    //$('div#content').append('<div class="tweetbox">' + tweet + '</div>');
    clusterCollection = $.parseJSON(tweet);
    for (var cluster in clusterCollection) {
      if (clusterCollection.hasOwnProperty(cluster)) {
        //console.log("lat: "+clusterCollection[cluster].centerLat+", long: "+clusterCollection[cluster].centerLong+", rad: "+clusterCollection[cluster].clusterRadius);
        clusterLatLng = new google.maps.LatLng(clusterCollection[cluster].centerLat,clusterCollection[cluster].centerLong);
        addCircle(clusterLatLng, clusterCollection[cluster].clusterRadius);
        if (clusterCollection[cluster].overallSentiment > 2.5) {
          addIcon(clusterLatLng, '/img/smile.jpg');
        } else if (clusterCollection[cluster].overallSentiment < 1.5) {
          addIcon(clusterLatLng, '/img/sad.png');
        } else {
          addIcon(clusterLatLng, '/img/neutral.png');
        }
      }
    }
    setAllMap(map);
  }

  google.maps.event.addDomListener(window, 'load', initialize);
});
  