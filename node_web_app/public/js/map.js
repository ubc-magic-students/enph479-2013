$(function() {
  var regions = [
    {
      name: "West Vancouver",
      id: "0",
      bb: [
            { lat: 49.195, lng: -123.27},
            { lat: 49.315, lng: -123.16772}
          ]
    },
    {
      name: "Central Vancouver",
      id: "1",
      bb: [
            { lat: 49.195, lng: -123.16772},
            { lat: 49.315, lng: -123.05717}
          ]
    },
    {
      name: "East Vancouver",
      id: "2",
      bb: [
            { lat: 49.195, lng: -123.05717},
            { lat: 49.315, lng: -123.020}
          ]
    }
  ];

  var appManager = new AppManager(regions);
  appManager.initializeApp();
});

// The App Manager object orchestrates the operations of the entire application
function AppManager(regions) {
  this.mapManager = new MapManager(regions, this);
  this.tableManager = new TableManager(regions);
  this.tweetManager = new TweetBoxManager();
  this.timeManager = new TimeManager();
  this.socketManager = new SocketManager(this);
  this.regions = regions;
  
  this.initializeApp = function() {
    google.maps.event.addDomListener(window, 'load', this.mapManager.initializeMap());

    this.socketManager.initializeSocketConnections();
    this.socketManager.initializeSocketEvents();
    this.tableManager.initializeDataset();
    this.tableManager.renderTable();
    this.timeManager.initializeTime();
    this.tweetManager.initializeTweet();

    $("#slider").slider();
  }

  this.updateData = function(data) {
    data = $.parseJSON(data);

    // update Time
    this.timeManager.showNow();
    
    // update Table
    this.tableManager.updateTable(data);

    // update Region Counts
    this.mapManager.updateRegionCounts(data);
  }
}

// The SocketManager object manages socket data transfers
function SocketManager(appManager) {
  this.socket = io.connect('http://localhost');

  this.initializeSocketConnections = function() {
    this.socket.emit('join hashtagcloud');
    this.socket.emit('join dbconnect');
  }

  this.initializeSocketEvents = function() {
    this.socket.on('hashtag tweet', function(data) {
      appManager.updateData(data.data);
    });

    /*this.socket.on('dbconnect response', function(data) {
      appManager.mapManager.regionObjects[data.regionId].createTweets(data.data);
    });*/

    this.socket.on('new tweets', function(data) {
      var regionTweets = [];
      appManager.regions.forEach(function(element) {
          regionTweets.push([]);
      }, this);
      
      data.data.forEach(function(element, index){
        regionTweets[element.region].push(element);
      }, this)
      
      // add tweets to each region
      regionTweets.forEach(function(element, index){
        appManager.mapManager.regionObjects[index].createTweets(element);
      }, this);
    });
  }
}

// The TimeManager object manages the time-date display
function TimeManager() {
  this.datetime;

  this.showNow = function() {
    this.datetime = new Date();
    $('#time-date').text('Last Updated: ' + this.datetime.toLocaleTimeString() + ' ' + this.datetime.toLocaleDateString());
  }

  this.initializeTime = function() {
    $('#time-date').text('Not updated');
  }
}

function TweetBoxManager() {
  this.initializeTweet = function() {
    $('#tweet-box').text('No tweets');
  }

  this.showTweet = function(tweet) {
    $('#tweet-box').text(tweet);
  }
}

function TableManager(regions) {
  this.dataset = [];
  this.rowHeader = [];
  this.columnHeader = ['', 'Sentiment', 'Weather'];

  this.initializeRowHeader = function() {
    regions.forEach(function(element) {
      this.rowHeader.push(element.name);
    }, this);
  }

  this.initializeDataset = function() {
    this.initializeRowHeader();

    this.dataset.push(this.columnHeader);

    this.rowHeader.forEach(function(element) {
      this.dataset.push([element, '-', '-']);
    }, this);
  }

  this.updateDataset = function(data) {
    this.dataset = [];
    this.dataset.push(this.columnHeader);

    this.rowHeader.forEach(function(element, index) {
      this.dataset.push([element, data[index].currentSentimentAverage, data[index].currentWeatherAverage]);
    }, this);
  }

  this.updateTable = function(data) {
    this.updateDataset(data);
    this.renderTable();
  }

  this.renderTable = function() {
    $("#table").empty();
    d3.select("#table")
        .append("table")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        
        .selectAll("tr")
        .data(this.dataset)
        .enter().append("tr")
        
        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "10px")
        .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")}) 
        .on("mouseout", function(){d3.select(this).style("background-color", "white")}) 
        .text(function(d){return d;})
        .style("font-size", "12px")
        .style("text-align", "center");
  }
}

  // The Map Manager object holds a MapMaker and all the Region objects, orchestrating the map operations
  function MapManager(regions, appManager) {
    this.map;
    this.regionInfos = regions;
    this.regionObjects = [];
    this.mapMaker = new MapMaker();
    this.appManager = appManager;

    this.initializeMap = function() {
      this.map = this.mapMaker.makeMap();
      this.initializeRegions();
      this.initializeButtons();
    }

    this.initializeRegions = function() {
      this.regionInfos.forEach(function(element) {
        this.regionObjects.push(new Region(element, this));
      }, this);

      this.regionObjects.forEach(function(element) {
        element.showPublicRegion();
      }, this);
    }

    this.initializeButtons = function() {
      var homeControlDiv = document.createElement('div');
      var homeControl = new HomeControl(homeControlDiv, this.map);
      homeControlDiv.index = 1;
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);
    }

    this.showRegions = function() {
      this.regionObjects.forEach(function(element) {
        element.showPublicRegion();
      }, this);
    }

    this.showButtons = function() {
      $('div#backbutton').css('visibility', 'visible');
    }

    this.hideButtons = function() {
      $('div#backbutton').css('visibility', 'hidden');
    }

    this.addButtonClickEvents = function() {
      var that = this;
      $('div#backbutton').click(function() {
        that.map.setCenter(new google.maps.LatLng(49.255, -123.125));
        that.map.setZoom(12);
        that.hideButtons();
        that.removeRegions();
        that.showRegions();
      });
    }

    this.goToRegion = function(regionBoundary) {
      this.map.setCenter(regionBoundary.bounds.getCenter());
      this.map.setZoom(12);
    }

    this.removeRegions = function() {
      this.regionObjects.forEach(function(element) {
        element.hideRegion();
      }, this);
    }

    this.updateRegionCounts = function(data) {
      this.regionObjects.forEach(function(element, index) {
        element.updateCountLabel(data[index].tweetCount);
      }, this);
    }
  }

// The Region object holds all the map elements and information specific to a region
function Region(regionInfo, mapManager) {
  var that = this;
  this.count = '-';
  this.tweets = [];
  this.regionId = regionInfo.id;
  this.mapManager = mapManager;
  this.printCount = true;
  this.printTweets = false;

  this.regionBoundary = mapManager.mapMaker.makeRegionBorder(
    new google.maps.LatLng(regionInfo.bb[0].lat, regionInfo.bb[0].lng),
    new google.maps.LatLng(regionInfo.bb[1].lat, regionInfo.bb[1].lng)
  );

  this.regionListener = google.maps.event.addListener(this.regionBoundary, 'click', function() {
    mapManager.goToRegion(this);
    mapManager.showButtons();
    mapManager.addButtonClickEvents();
    mapManager.removeRegions();
    that.showPrivateRegion();
  });

  this.regionLabel = mapManager.mapMaker.makeRegionLabel(
    regionInfo.name,
    this.regionBoundary.bounds.getCenter()
  );

  this.regionCountLabel = mapManager.mapMaker.makeCountLabel(
    this.count, 
    new google.maps.LatLng(this.regionBoundary.bounds.getCenter().lat()-0.0125,
      this.regionBoundary.bounds.getCenter().lng())
  );

  this.updateCountLabel = function(count) {
    this.count = count;
    //console.log("count: " + count);
    this.regionCountLabel.setMap(null);
    this.regionCountLabel = mapManager.mapMaker.makeCountLabel(
      this.count,
      new google.maps.LatLng(this.regionBoundary.bounds.getCenter().lat()-0.0125,
        this.regionBoundary.bounds.getCenter().lng())
    );
    if (this.printCount == true) {
      this.regionCountLabel.setMap(mapManager.map);
    }
  }

  this.regionCountCircle = mapManager.mapMaker.makeCountCircle(
    new google.maps.LatLng(this.regionBoundary.bounds.getCenter().lat()-0.0125,
      this.regionBoundary.bounds.getCenter().lng())
  );

  this.showPublicRegion = function() {
    this.regionBoundary.setMap(mapManager.map);
    this.regionLabel.setMap(mapManager.map);
    this.regionCountLabel.setMap(mapManager.map);
    this.regionCountCircle.setMap(mapManager.map);
    this.printCount = true;
    this.printTweets = false;
  }

  this.showPrivateRegion = function() {
    this.regionBoundary.setMap(mapManager.map);
    this.regionLabel.setMap(mapManager.map);
    this.regionCountLabel.setMap(mapManager.map);
    this.regionCountCircle.setMap(mapManager.map);
    this.showTweets();
    this.printCount = true;
    this.printTweets = true;
  }

  this.hideRegion = function() {
    this.regionBoundary.setMap(null);
    this.regionLabel.setMap(null);
    this.regionCountLabel.setMap(null);
    this.regionCountCircle.setMap(null);
    this.tweets.forEach(function(element, index) {
      element.hide();
    }, this);
    this.printCount = false;
    this.printTweets = false;
  }

  this.createTweets = function(data) {
    var tweet;
    data.forEach(function(element, index) {
      tweet = new Tweet(this, new google.maps.LatLng(element.lat, element.lng), element.message);
      this.tweets.push(tweet);
      console.log('count ' + this.tweets.length);
    }, this);
    if (this.printTweets == true) {
      this.showTweets();
    } else {
      console.log('DIDNT PRINT');
    }
  }

  this.showTweets = function() {
    this.tweets.forEach(function(element, index) {
      element.show();
    });
  }
}


// The Tweet object holds all the tweet information
function Tweet(region, pos, text) {
  this.marker = region.mapManager.mapMaker.makeTweetMarker(pos);
  this.message = text;
  var that = this;
  this.listener = google.maps.event.addListener(this.marker, 'click', function() {
      region.mapManager.appManager.tweetManager.showTweet(that.message);
  }, this);
  this.show = function() {
    this.marker.setMap(region.mapManager.map);
  }
  this.hide = function() {
    this.marker.setMap(null);
  }
}

// The MapMaker object holds all the configuration information for generating map elements
function MapMaker() {
  this.makeMap = function() {
    var mapOptions = {
      center: new google.maps.LatLng(49.255, -123.125),
      zoom: 12,
      disableDefaultUI: true,
      scrollwheel: false,
      draggable: false,
      disableDoubleClickZoom: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    return new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  }

  this.makeTweetMarker = function(pos) {
    return new google.maps.Marker({
        position: pos
    });
  }

  this.makeRegionBorder = function(sw, ne) {
    return new google.maps.Rectangle({
      strokeColor: '#FF0000',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0,
      bounds: new google.maps.LatLngBounds(sw,ne)
    });
  }

  this.makeRegionLabel = function(name, pos) {
    var labelOptions = {
           content: name
          ,boxStyle: {
             border: "1px solid black"
            ,textAlign: "center"
            ,fontSize: "8pt"
            ,width: "55px"
           }
          ,disableAutoPan: true
          ,pixelOffset: new google.maps.Size(-25, 0)
          ,position: pos
          ,closeBoxURL: ""
          ,isHidden: false
          ,pane: "mapPane"
          ,enableEventPropagation: true
        };
    return new InfoBox(labelOptions);
  }

  this.makeCountLabel = function(count, pos) {
    labelOptions = {
             content: count
            ,boxStyle: {
              textAlign: "center"
              ,fontSize: "10pt"
              ,width: "10px"
             }
            ,disableAutoPan: true
            ,pixelOffset: new google.maps.Size(-5, -10)
            ,position: pos
            ,closeBoxURL: ""
            ,isHidden: false
            ,pane: "mapPane"
            ,enableEventPropagation: true
          };
    return new InfoBox(labelOptions);
  }

  this.makeCountCircle = function(pos) {
    return new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          center: pos,
          radius: 450
    });
  }
}

// The HomeControl object holds the configuration for generating the Overview button
function HomeControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.id = 'backbutton';
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.style.visibility = 'hidden';
  controlUI.title = 'Click to set the map to Vancouver';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Overview</b>';
  controlUI.appendChild(controlText);
}