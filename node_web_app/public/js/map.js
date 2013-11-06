$(function() {
  var regions = [
    {
      name: "UBC",
      id: "0",
      bb: [
        { lat: 49.23083, lng: -123.26660 },
        { lat: 49.27632, lng: -123.21476 }
      ]
    },
    {
      name: "West Point Grey",
      id: "1",
      bb: [
        { lat: 49.25795, lng: -123.21476 },
        { lat: 49.27632, lng: -123.18592 }
      ]
    },
    {
      name: "Kitsilano",
      id: "2",
      bb: [
        { lat: 49.25795, lng: -123.18592 },
        { lat: 49.27632, lng: -123.14610 }
      ]
    },
    {
      name: "Fairview",
      id: "3",
      bb: [
            { lat: 49.25795, lng: -123.14610 },
            { lat: 49.26982, lng: -123.11520 }
          ]
    },
    {
      name: "Mount Pleasant",
      id: "4",
      bb: [
            { lat: 49.25795, lng: -123.11520 },
            { lat: 49.26982, lng: -123.07777 }
          ]
    },
    {
      name: "Dunbar",
      id: "5",
      bb: [
            { lat: 49.21939, lng: -123.21476 },
            { lat: 49.25795, lng: -123.17081 }
          ]
    },
    {
      name: "Arbutus",
      id: "6",
      bb: [
          { lat: 49.23441, lng: -123.17081 },
          { lat: 49.25795, lng: -123.15399 }
      ]
    },
    {
      name: "Shaughnessy",
      id: "7",
      bb: [
          { lat: 49.23441, lng: -123.15399 },
          { lat: 49.25795, lng: -123.13923 }
      ]
    },
    {
      name: "South Cambie",
      id: "8",
      bb: [
          { lat: 49.23441, lng: -123.13923 },
          { lat: 49.25795, lng: -123.1152 }
      ]
    },
    {
      name: "Riley Park",
      id: "9",
      bb: [
          { lat: 49.23441, lng: -123.1152 },
          { lat: 49.25795, lng: -123.09082 }
      ]
    },
    {
      name: "Kensington",
      id: "10",
      bb: [
          { lat: 49.23441, lng: -123.09082 },
          { lat: 49.25795, lng: -123.05683 }
      ]
    },
    {
      name: "Renfrew",
      id: "11",
      bb: [
          { lat: 49.23441, lng: -123.05683 },
          { lat: 49.25795, lng: -123.02422 }
      ]
    },
    {
      name: "Kerrisdale",
      id: "12",
      bb: [
          { lat: 49.20324, lng: -123.17081 },
          { lat: 49.23441, lng: -123.14026 }
      ]
    },
    {
      name: "Oakridge",
      id: "13",
      bb: [
          { lat: 49.21872, lng: -123.14026 },
          { lat: 49.23441, lng: -123.10215 }
      ]
    },
    {
      name: "Marpole",
      id: "14",
      bb: [
          { lat: 49.19965, lng: -123.14026 },
          { lat: 49.23441, lng: -123.10215 }
      ]
    },
    {
      name: "Sunset",
      id: "15",
      bb: [
          { lat: 49.20324, lng: -123.10215 },
          { lat: 49.23441, lng: -123.07777 }
      ]
    },
    {
      name: "Victoria",
      id: "16",
      bb: [
          { lat: 49.20324, lng: -123.07777 },
          { lat: 49.23441, lng: -123.05511 }
      ]
    },
    {
      name: "Killarney",
      id: "17",
      bb: [
          { lat: 49.20324, lng: -123.05511 },
          { lat: 49.23441, lng: -123.02422 }
      ]
    },
    {
      name: "Stanley Park",
      id: "18",
      bb: [
          { lat: 49.29311, lng: -123.16017 },
          { lat: 49.31371, lng: -123.11794 }
      ]
    },
    {
      name: "West End",
      id: "19",
      bb: [
          { lat: 49.27632, lng: -123.14644 },
          { lat: 49.29311, lng: -123.12378 }
      ]
    },
    {
      name: "Business District",
      id: "20",
      bb: [
          { lat: 49.27632, lng: -123.12378 },
          { lat: 49.29311, lng: -123.10181 }
      ]
    },
    {
      name: "Downtown Eastside",
      id: "21",
      bb: [
          { lat: 49.26982, lng: -123.10181 },
          { lat: 49.28953, lng: -123.07777 }
      ]
    },
    {
      name: "Grandview",
      id: "22",
      bb: [
          { lat: 49.25795, lng: -123.07777 },
          { lat: 49.29334, lng: -123.05683 }
      ]
    },
    {
      name: "East Hastings",
      id: "23",
      bb: [
          { lat: 49.25795, lng: -123.05683 },
          { lat: 49.29334, lng: -123.02422 }
      ]
    },
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

  this.regionState = -1; // -1 = Vancouver, 0 => Everything Else is a RegionId
  this.timeState = 0; // 0 = Eternity, 1 = Playback
  
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

  this.changeState = function(stateChange) {
    if (stateChange.regionState !== undefined) {
      this.regionState = stateChange.regionState;
    }
    if (stateChange.timeState !== undefined) {
      this.timeState = stateChange.timeState;
    }
    this.mapManager.changeState(this.timeState, this.regionState);
  }

  this.updateData = function(data) {
    
    data = $.parseJSON(data);

    // update Time
    this.timeManager.showNow();
    
    // update Table
    this.tableManager.updateTable(data);
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

    this.socket.on('new tweets', function(data) {
      if (data !== null) {
        var regionTweets = [];
        appManager.regions.forEach(function(element) {
            regionTweets.push([]);
        }, this);

        var numRegions = regionTweets.length;
        data.data.forEach(function(element, index){
          if (element.region >= 0 && element.region < numRegions) {
            regionTweets[element.region].push(element);
          }
        }, this);
        
        // add tweets to each region
        regionTweets.forEach(function(element, index){
          appManager.mapManager.regionObjects[index].createTweets(element);
        }, this);
      }
    });

    this.socket.on('region history', function(data) {
      data.data.forEach(function(row) {
        console.log("region history: " + row.timestamp);
      })
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
  this.columnHeader = ['', 'Sentiment', 'Weather', '# of Tweets'];

  this.initializeRowHeader = function() {
    regions.forEach(function(element) {
      this.rowHeader.push(element.name);
    }, this);
  }

  this.initializeDataset = function() {
    this.initializeRowHeader();

    this.dataset.push(this.columnHeader);

    this.rowHeader.forEach(function(element) {
      this.dataset.push([element, '-', '-', '-']);
    }, this);
  }

  this.updateDataset = function(data) {
    this.dataset = [];
    this.dataset.push(this.columnHeader);
  
    this.rowHeader.forEach(function(element, index) {
      this.dataset.push([element, data[index].currentSentimentAverage, data[index].currentWeatherAverage, data[index].tweetCount]);
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
        .style("padding", "5px")
        .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")}) 
        .on("mouseout", function(){d3.select(this).style("background-color", "white")}) 
        .text(function(d){return d;})
        .style("font-size", "12px")
        .style("text-align", "center");
  }
}

function ButtonManager(mapManager) {
  this.replayButton;
  this.overviewButton;
  this.mapManager = mapManager;

  this.initializeButtons = function() {
    var overviewDiv = document.createElement('div');
    var homeControl = new HomeControl(overviewDiv, mapManager.map);
    overviewDiv.index = 1;
    mapManager.map.controls[google.maps.ControlPosition.LEFT_TOP].push(overviewDiv);
    this.overviewButton = $(overviewDiv);

    var replayDiv = document.createElement('div');
    var replayControl = new ReplayControl(replayDiv, mapManager.map);
    replayDiv.index = 1;
    mapManager.map.controls[google.maps.ControlPosition.TOP_LEFT].push(replayDiv);
    this.replayButton = $(replayDiv);
  }

  this.initializeEvents = function() {
    this.changeState(0, -1);
  }

  this.changeState = function(timeState, regionState) {

      if (timeState === 0 && regionState === -1) {
        this.setOverviewEternityState();
      } else if (timeState === 0 && regionState !== -1) {
        this.setRegionEternityState();
      } else if (timeState === 1 && regionState === -1) {
        this.setOverviewReplayState();
      } else if (timeState === 1 && regionState !== -1) {
        this.setRegionReplayState();
      }
  }

  this.setOverviewEternityState = function() {
    this.overviewButton.hide();
    this.replayButton.text('Replay');
    this.addPlayEvent();
  }

  this.setOverviewReplayState = function() {
    this.overviewButton.hide();
    this.replayButton.text('Stop Replay');
    this.addStopEvent();
  }

  this.setRegionEternityState = function() {
    this.overviewButton.show();
    this.replayButton.text('Replay');
    this.addOverviewButtonClickEvent();
    this.addPlayEvent();
  }

  this.setRegionReplayState = function() {
    this.overviewButton.show();
    this.replayButton.text('Stop Replay');
    this.addOverviewButtonClickEvent();
    this.addStopEvent();
  }

  this.addPlayEvent = function() {
    var that = this;
    this.replayButton.off('click');
    this.replayButton.click(function() {
      var stateChange = { timeState: 1 };
      that.mapManager.appManager.changeState(stateChange);
    });
  }

  this.addStopEvent = function() {
    var that = this;
    this.replayButton.off('click');
    this.replayButton.click(function() {
      var stateChange = { timeState: 0 };
      that.mapManager.appManager.changeState(stateChange);
    });
  }

  this.addOverviewButtonClickEvent = function() {
    var that = this;    
    this.overviewButton.off('click');
    this.overviewButton.click(function() {
      var stateChange = { regionState: -1 };
      that.mapManager.appManager.changeState(stateChange);
    });
  }
}

  // The Map Manager object holds a MapMaker and all the Region objects, orchestrating the map operations
  function MapManager(regions, appManager) {
    this.map;
    this.regionInfos = regions;
    this.regionObjects = [];
    this.mapMaker = new MapMaker();
    this.appManager = appManager;
    this.buttonManager = new ButtonManager(this);

    this.initializeMap = function() {
      this.map = this.mapMaker.makeMap();
      this.initializeRegions();
      this.buttonManager.initializeButtons();
      this.buttonManager.initializeEvents();
    }

    this.changeState = function(timeState, regionState) {

      if (timeState === 0 && regionState === -1) {
        this.goToCity();
      } else if (timeState === 0 && regionState !== -1) {
        this.goToRegion(regionState);
      } else if (timeState === 1 && regionState === -1) {
      } else if (timeState === 1 && regionState !== -1) {
      }
      this.buttonManager.changeState(timeState, regionState);
    }

    this.initializeRegions = function() {
      this.regionInfos.forEach(function(element) {
        this.regionObjects.push(new Region(element, this));
      }, this);

      this.regionObjects.forEach(function(element) {
        element.showPublicRegion();
      }, this);
    }

    this.goToRegion = function(currentRegion) {
      console.log(currentRegion);
      console.log(this.regionObjects);
      this.map.setCenter(this.regionObjects[currentRegion].regionBoundary.bounds.getCenter());
      this.map.setZoom(14);
      this.removeRegions();
      this.regionObjects[currentRegion].showPrivateRegion();
    }

    this.goToCity = function() {
      this.map.setCenter(new google.maps.LatLng(49.255, -123.125));
      this.map.setZoom(12);
      this.showRegions();
    }

    this.showRegions = function() {
      this.regionObjects.forEach(function(element) {
        element.showPublicRegion();
      }, this);
    }

    this.removeRegions = function() {
      this.regionObjects.forEach(function(element) {
        element.hideRegion();
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
    /*mapManager.goToRegion(this);
    mapManager.showButtons();
    mapManager.addButtonClickEvents();
    mapManager.removeRegions();
    that.showPrivateRegion();*/
    var stateChange = { regionState: that.regionId };
    that.mapManager.appManager.changeState(stateChange);
  });

  this.regionLabel = mapManager.mapMaker.makeRegionLabel(
    regionInfo.name,
    this.regionBoundary.bounds.getCenter()
  );

  this.showPublicRegion = function() {
    this.regionBoundary.setMap(mapManager.map);
    this.regionLabel.setMap(mapManager.map);
    this.tweets.forEach(function(element, index) {
      element.hide();
    }, this);
    this.printCount = true;
    this.printTweets = false;
  }

  this.showPrivateRegion = function() {
    this.regionBoundary.setMap(mapManager.map);
    this.regionLabel.setMap(mapManager.map);
    this.showTweets();
    this.printCount = true;
    this.printTweets = true;
  }

  this.hideRegion = function() {
    this.regionBoundary.setMap(null);
    this.regionLabel.setMap(null);
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

  this.makeRegionLabel = function(name, pos, flag) {
    var pixelOffset = new google.maps.Size(-25, -25);
    var width = "55px";
    if (name == "Shaughnessy") {
      width = "75px";
    }
    if (name == "Marpole") {
      pixelOffset =  new google.maps.Size(-25, -5);
    } 
    var labelOptions = {
           content: name
          ,boxStyle: {
             border: "1px solid black"
            ,textAlign: "center"
            ,fontSize: "8pt"
            ,width: width
           }
          ,disableAutoPan: true
          ,pixelOffset: pixelOffset
          ,position: pos
          ,closeBoxURL: ""
          ,isHidden: false
          ,pane: "mapPane"
          ,enableEventPropagation: true
        };
    return new InfoBox(labelOptions);
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

// The ReplayControl object holds the configuration for generating the Replay button
function ReplayControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.id = 'replaybutton';
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to replay the last 24 hours';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Replay</b>';
  controlUI.appendChild(controlText);
}