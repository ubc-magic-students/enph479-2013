$(function() {
  
  var map;
  var clusters = [];
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
  socket.emit('join latlong');

  socket.on('hashtag tweet', function(data) {
    addNewTweet(data.data);
  });

  var tweetlatlongs=[];

  socket.on('tweet latlongs', function(data) {
    //addTweetLatLongs(data.data);

    function addTweetLatLongs(tweets) {
      var length = tweets.length;
      console.log('sup');
        for (var i = 0; i < length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(tweets[i].lat,tweets[i].lng),
            map: map,
            icon: {
              url: '/img/neutral.png',
            }
          });
          tweetlatlongs.push(marker);
        }
        for (var i = 0; i < icons.length; i++) {
          tweetlatlongs[i].setMap(map);
        }
      }
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

  function addSentimentIcon(location, sentiment) {
    if (sentiment > 2.5) {
      addIcon(location, '/img/smile.jpg');
    } else if (sentiment < 1.5) {
      addIcon(location, '/img/sad.png');
    } else {
      addIcon(location, '/img/neutral.png');
    }
  }

  function addWeatherIcon(location, weather_icon) {
    var icon_string = "http://openweathermap.org/img/w/"+weather_icon+".png";
    addIcon(location, icon_string);
  }

  function addCluster(location, size) {
    if (size > 0) {
      var circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        center: location,
        radius: size*111000,
        map: map
      });
      clusters.push(circle);
    } else {
      var marker = new google.maps.Marker({
        position: location,
        map: map
      });
      clusters.push(marker);
    }
  }

  function setAllMap(map) {
    for (var i = 0; i < clusters.length; i++) {
      clusters[i].setMap(map);
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
    clusters = [];
  }

  function addNewTweet(tweet) {
    deleteMap();
    clusterCollection = $.parseJSON(tweet);
    for (var cluster in clusterCollection) {
      if (clusterCollection.hasOwnProperty(cluster)) {
        //console.log("lat: "+clusterCollection[cluster].centerLat+", long: "+clusterCollection[cluster].centerLong+", rad: "+clusterCollection[cluster].clusterRadius);
        clusterLatLng = new google.maps.LatLng(clusterCollection[cluster].centerLat,clusterCollection[cluster].centerLong);
        addCluster(clusterLatLng, clusterCollection[cluster].clusterRadius);
        //addSentimentIcon(clusterLatLng, clusterCollection[cluster].overallSentiment);
        addWeatherIcon(clusterLatLng, clusterCollection[cluster].weather.icon);
        /*var length = clusterCollection[cluster].tweetIDs.length;
        for (var i = 0) {
          clusterCollection[cluster].tweetIDs[i];
        }*/
      }
    }
    setAllMap(map);
  }

  google.maps.event.addDomListener(window, 'load', initialize);
});