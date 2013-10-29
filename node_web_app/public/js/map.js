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
    console.log(data.data);
    addNewTweet(data.data);

    function addNewTweet(tweet) {
      deleteMap();
      clusterCollection = $.parseJSON(tweet);
      for (var cluster in clusterCollection) {
        if (clusterCollection.hasOwnProperty(cluster)) {
          //console.log("lat: "+clusterCollection[cluster].centerLat+", long: "+clusterCollection[cluster].centerLong+", rad: "+clusterCollection[cluster].clusterRadius);
          clusterLatLng = new google.maps.LatLng(clusterCollection[cluster].centerLat,clusterCollection[cluster].centerLong);
          addCluster(clusterLatLng, clusterCollection[cluster].clusterRadius, clusterCollection[cluster].overallSentiment);
          //addSentimentIcon(clusterLatLng, clusterCollection[cluster].overallSentiment);
          addWeatherIcon(clusterLatLng, clusterCollection[cluster].weather.icon);
          //console.log("get cluster tweets: " + clusterCollection[cluster].tweetIDs);
          //socket.emit('get cluster tweets', { data: clusterCollection[cluster].tweetIDs });
        }
      }
      setAllMap(map);
    }
  });
  
  function get_random_color() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.round(Math.random() * 15)];
      }
      return color;
  }

  socket.on('return tweet latlng', function(data) {
    var length = data.data.length;
    var pinColor = get_random_color(); // a random blue color that i picked
        for (var i = 0; i < length; i++) {

          var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                      new google.maps.Size(21, 34),
                      new google.maps.Point(0,0),
                      new google.maps.Point(10, 34));

          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.data[i].lat,data.data[i].lng),
            map: map,
            icon: pinImage
          });
          tweetlatlongs.push(marker);
        }
        for (var i = 0; i < tweetlatlongs.length; i++) {
          tweetlatlongs[i].setMap(map);
        }
  });

  var tweetlatlongs=[];

  socket.on('tweet latlongs', function(data) {
    //addTweetLatLongs(data.data);

    function addTweetLatLongs(tweets) {
      var length = tweets.length;
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

  function getColor(sentiment) {
    var red_sentiment = (Math.floor(sentiment / 4.0 * 255)).toString(16);
    console.log('red_sentiment: '+red_sentiment);
    if (red_sentiment === '0') {
      red_sentiment = '00';
    }
    var blue_sentiment = (Math.floor(255 - sentiment / 4.0 * 255)).toString(16);
    if (blue_sentiment === '0') {
      blue_sentiment = '00';
    }
    console.log('blue_sentiment: '+blue_sentiment);
    return red_sentiment + '00' + blue_sentiment;
  }

  function addCluster(location, size, sentiment) {
    color = getColor(sentiment); //'FF0000'
    if (size > 0) {
      var circle = new google.maps.Circle({
        strokeColor: '#'+color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#'+color,
        fillOpacity: 0.35,
        center: location,
        radius: size*111000,
        map: map
      });
      clusters.push(circle);
    } else {
      var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
                      new google.maps.Size(21, 34),
                      new google.maps.Point(0,0),
                      new google.maps.Point(10, 34));
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: pinImage
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
    tweetlatlongs = [];
  }

  google.maps.event.addDomListener(window, 'load', initialize);
});