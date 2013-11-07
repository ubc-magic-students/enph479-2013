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
          { lat: 49.21872, lng: -123.10215 }
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
          { lat: 49.26982, lng: -123.14644 },
          { lat: 49.29311, lng: -123.12378 }
      ]
    },
    {
      name: "Business District",
      id: "20",
      bb: [
          { lat: 49.26982, lng: -123.12378 },
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

var VANCOUVER_ETERNITY = 0,
  REGION_ETERNITY = 1,
  VANCOUVER_PLAYBACK = 2;

// The App Manager object orchestrates the operations of the entire application
function AppManager(regions) {
  this.mapManager = new MapManager(regions, this);
  this.tableManager = new TableManager(regions);
  //this.tweetManager = new TweetBoxManager();
  this.timeManager = new TimeManager();
  this.socketManager = new SocketManager(this);
  this.regions = regions;
  this.playbackId;
  this.playbackTweets = [];
  this.playbackSpeed;

  this.state = VANCOUVER_ETERNITY;
  
  this.initializeApp = function() {
    google.maps.event.addDomListener(window, 'load', this.mapManager.initializeMap());

    this.socketManager.initializeSocketConnections();
    this.socketManager.initializeSocketEvents();
    this.tableManager.initializeDataset();
    this.timeManager.initializeTime();
    //this.tweetManager.initializeTweet();

    //this.socketManager.getTimePlay();
    //$("#slider").slider();
  }

  this.changeState = function(state, region) {
    this.state = state;
    if (region !== undefined) {
      this.mapManager.changeState(state, region);
    } else {
      this.mapManager.changeState(state, -1);
    }
    
    if (state === VANCOUVER_PLAYBACK) {
      this.callForPlaybackData();
    } else {
      console.log('clear interval called');
      clearInterval(this.playbackId);
      this.timeManager.showLastUpdated();
      this.tableManager.showLastUpdated();
      this.playbackTweets.forEach(function(element) {
        element.hide();
      }, this);
      this.playbackTweets = [];
    }
  }

  this.callForPlaybackData = function() {
    this.socketManager.getTimePlay();
    this.timeManager.showMessage("Going back in time, please stand by...");
  }

  this.playback = function(regionData, tweetData, speed) {
    this.timeManager.showMessage("Time traveling commencing...");
    //this.changeState(VANCOUVER_PLAYBACK);
    var regionLength = this.regions.length;

    function setCharAt(str,index,chr) {
      if(index > str.length-1) return str;
      return str.substr(0,index) + chr + str.substr(index+1);
    }
    
    var that = this;
    var arrayPIT;
    this.playbackId = setInterval(function() {
      var playTweet = [];
      if (regionData.length !== 0) {
        arrayPIT = regionData.splice(0,regionLength);
        arrayPIT[0].timestamp = setCharAt(arrayPIT[0].timestamp, 19, '.');
        that.tableManager.updatePlayTable(arrayPIT);
        
        that.timeManager.showPlayTime(new Date(arrayPIT[0].timestamp));
        
        var tweet_date;
        
        var play_date = new Date(arrayPIT[0].timestamp);

        tweetData.some(function(element, index) {
          tweet_date = new Date(element.timestamp);
          if (play_date > tweet_date) {
            playTweet.push(tweetData.shift());
          } else {
            return true;
          }
        }, this);
        that.addplaybackTweets(playTweet);
      } else {
        clearInterval(that.playbackId);
        that.changeState(VANCOUVER_ETERNITY);
      }
    }, speed);
  }

  this.addplaybackTweets = function(tweets) {
    tweets.forEach(function(element, index) {
      var vTweet = new VancouverTweet(this, new google.maps.LatLng(element.lat, element.lng), element);
      vTweet.show();
      this.playbackTweets.push(vTweet);
    }, this);
  };

  this.updateData = function(data) {
    console.log('STATE AT UPDATE: ' + this.state);
    data = $.parseJSON(data);

    // update Time
    this.timeManager.saveLastUpdated();
    
    // update Table
    this.tableManager.saveLastUpdated(data);

    if (this.state !== VANCOUVER_PLAYBACK) {
      this.showUpdate();
    }
  }

  this.showUpdate = function() {
    console.log('update shown');
    this.timeManager.showLastUpdated();
    this.tableManager.showLastUpdated();
  }
}

// The SocketManager object manages socket data transfers
function SocketManager(appManager) {
  this.socket = io.connect('http://localhost');

  this.initializeSocketConnections = function() {
    this.socket.emit('join hashtagcloud');
    this.socket.emit('join dbconnect');
    this.socket.emit('join regionrequest');
  }

  this.getTimePlay = function() {
    this.socket.emit('time_play_request');
  };

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
      appManager.playback(data.data[0], data.data[1], appManager.playbackSpeed);
    });
  }
}

// The TimeManager object manages the time-date display
function TimeManager() {
  this.lastUpdated;

  this.saveLastUpdated = function() {
    this.lastUpdated = new Date();
  }

  this.showLastUpdated = function() {
    if (this.lastUpdated !== undefined) {
      $('#time-date').text('Last Updated: ' + this.lastUpdated.toLocaleTimeString() + ' ' + this.lastUpdated.toLocaleDateString());
    } else {
      $('#time-date').text('Not updated');
    }
  }

  this.showPlayTime = function(time) {
    $('#time-date').text('Playback Time: ' + time);
  }

  this.initializeTime = function() {
    $('#time-date').text('Not updated');
  }
  
  this.showMessage = function(message) {
    $('#time-date').text(message);
  }
}

/*function TweetBoxManager() {
  this.initializeTweet = function() {
    $('#tweet-box').text('No tweets');
  }

  this.showTweet = function(tweet) {
    $('#tweet-box').text(tweet);
  }
}*/

function TableManager(regions) {
  this.dataset = [];
  this.rowHeader = [];
  this.columnHeader = ['Neighbourhood', 'Sentiment', 'Weather', '# of Tweets'];
  this.lastUpdated = [];

  this.initializeRowHeader = function() {
    regions.forEach(function(element) {
      this.rowHeader.push(element.name);
    }, this);
  }

  this.initializeDataset = function() {
    this.initializeRowHeader();

    //this.lastUpdated.push(this.columnHeader);

    this.rowHeader.forEach(function(element) {
      this.lastUpdated.push([element, '-', '-', '-']);
    }, this);
    this.showLastUpdated();
  }

  this.saveLastUpdated = function(data) {
    this.lastUpdated = [];
    //this.lastUpdated.push(this.columnHeader);
  
    this.rowHeader.forEach(function(element, index) {
      this.lastUpdated.push([element, data[index].currentSentimentAverage, data[index].currentWeatherAverage, data[index].tweetCount]);
    }, this);
  }

  this.showLastUpdated = function() {
    console.log('last updated table data rendered');
    this.renderTable(this.lastUpdated, this.columnHeader);
  }

  this.updatePlayTable = function(data) {
    this.dataset = [];
    //this.dataset.push(['Neighbourhood', 'Sentiment', 'Weather']);
  
    this.rowHeader.forEach(function(element, index) {
      this.dataset.push([element, data[index].sentiment, data[index].weather]);
    }, this);
    this.renderTable(this.dataset, ['Neighbourhood', 'Sentiment', 'Weather']);
  }

  this.renderTable = function(dataset, columnHeader) {
    $("#table").empty();
    var table = d3.select("#table")
              .append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

        thead.append("tr")
          .selectAll("th")
          .data(columnHeader)
          .enter().append("th")
          .attr("class", function(d, i) {
            return i % 2 ? "c_even": "c_odd";
          })
          .text(function(c) {return c;});

        tbody.selectAll("tr")
        .data(dataset)
        .enter().append("tr")
        
        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .attr("class", function(d, i) {
          if (i === 0)
            return "c_odd c_name";
          return i % 2 ? "c_even": "c_odd";
        })
        .text(function(d){return (isNaN(d) ? d : d.toFixed(3));})

  }
}

function ButtonManager(mapManager) {
  this.mapManager = mapManager;
  this.overviewButton;
  this.overviewListener;
  this.replayButton;
  this.replayListener;
  var that = this;

  this.initializeButtons = function() {
    var overviewDiv = document.createElement('div');
    var homeControl = new HomeControl(overviewDiv, this.mapManager.map, this);
    overviewDiv.index = 1;
    this.mapManager.map.controls[google.maps.ControlPosition.LEFT_TOP].push(overviewDiv);

    var replayDiv = document.createElement('div');
    var replayControl = new ReplayControl(replayDiv, this.mapManager.map, this);
    replayDiv.index = 1;
    this.mapManager.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(replayDiv);

    var divOptions = {
            gmap: this.mapManager.map,
            name: '1X',
            title: "Playback at 10 minutes per second",
            id: "1X",
            action: function(){
              that.mapManager.appManager.playbackSpeed = 1000;
              that.mapManager.appManager.changeState(VANCOUVER_PLAYBACK);
            }
        }
        var optionDiv1 = new optionDiv(divOptions);
        
        var divOptions2 = {
            gmap: this.mapManager.map,
            name: '2X',
            title: "Playback at 20 minutes per second",
            id: "2X",
            action: function(){
              that.mapManager.appManager.playbackSpeed = 500;
              that.mapManager.appManager.changeState(VANCOUVER_PLAYBACK);
            }
        }
        var optionDiv2 = new optionDiv(divOptions2);

        var divOptions3 = {
            gmap: this.mapManager.map,
            name: '6X',
            title: "Playback at 1 hour per second",
            id: "6X",
            action: function(){
              that.mapManager.appManager.playbackSpeed = 166.67;
              that.mapManager.appManager.changeState(VANCOUVER_PLAYBACK);
            }
        }
        var optionDiv3 = new optionDiv(divOptions3);
        
        //put them all together to create the drop down       
        var ddDivOptions = {
          items: [optionDiv1, optionDiv2, optionDiv3],
          id: "myddOptsDiv"           
        }
        //alert(ddDivOptions.items[1]);
        var dropDownDiv = new dropDownOptionsDiv(ddDivOptions);               
                
        var dropDownOptions = {
            gmap: this.mapManager.map,
            name: 'Replay',
            id: 'ddControl',
            title: 'Replay at the selected speed',
            position: google.maps.ControlPosition.RIGHT_TOP,
            dropDown: dropDownDiv 
        }
        var dropDown1 = new dropDownControl(dropDownOptions);      


    this.changeState(VANCOUVER_ETERNITY);
  }

  this.changeState = function(state, region) {
      //console.log(state);
      switch(state) {
        case VANCOUVER_ETERNITY:
          this.setOverviewEternityState();
          break;
        case REGION_ETERNITY:
          this.setRegionEternityState();
          break;
        case VANCOUVER_PLAYBACK:
          this.setOverviewReplayState();
          break;
        default:
          console.log(state);
          break;
      }
  }

  this.setOverviewEternityState = function() {
    $('div#backbutton').css('visibility', 'hidden');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'visible');
    $('div#Replay').next().css('display', 'none');
    this.addPlayEvent();
  }

  this.setOverviewReplayState = function() {
    $('div#backbutton').css('visibility', 'hidden');
    $('div#replaybutton').css('visibility', 'visible');
    $('div#Replay').parent().css('visibility', 'hidden');
    this.addStopEvent();
  }

  this.setRegionEternityState = function() {
    $('div#backbutton').css('visibility', 'visible');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'hidden');
    this.addOverviewButtonClickEvent();
  }

  this.addPlayEvent = function() {
    var that = this;
    google.maps.event.removeListener(this.replayListener);
    this.replayListener = google.maps.event.addDomListener(this.replayButton, 'click', function() {
      that.mapManager.appManager.changeState(VANCOUVER_PLAYBACK);
    });
    /*$('div#replaybutton').off('click');
    $('div#replaybutton').click(function() {
      that.mapManager.appManager.changeState(VANCOUVER_PLAYBACK);
    });*/
  }

  this.addStopEvent = function() {
    var that = this;
    google.maps.event.removeListener(this.replayListener);
    this.replayListener = google.maps.event.addDomListener(this.replayButton, 'click', function() {
      that.mapManager.appManager.changeState(VANCOUVER_ETERNITY);
    });
    /*$('div#replaybutton').off('click');
    $('div#replaybutton').click(function() {
      that.mapManager.appManager.changeState(VANCOUVER_ETERNITY);
    });*/
  }

  this.addOverviewButtonClickEvent = function() {
    var that = this;
    google.maps.event.removeListener(this.overviewListener);
    this.overviewListener = google.maps.event.addDomListener(this.overviewButton, 'click', function() {
      that.mapManager.infowindow.close();
      that.mapManager.appManager.changeState(VANCOUVER_ETERNITY);
    });
    /*$('div#backbutton').off('click');
    $('div#backbutton').click(function() {
      that.mapManager.appManager.changeState(VANCOUVER_ETERNITY);
    });*/
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
    this.infowindow = new google.maps.InfoWindow({
      maxWidth: 300
    });

    this.initializeMap = function() {
      this.map = this.mapMaker.makeMap();
      this.initializeRegions();
      this.buttonManager.initializeButtons();
    }

    this.initializeRegions = function() {
      this.regionInfos.forEach(function(element) {
        this.regionObjects.push(new Region(element, this));
      }, this);

      this.regionObjects.forEach(function(element) {
        element.showPublicRegion();
      }, this);
    }

    this.changeState = function(state, region) {
      switch(state) {
        case VANCOUVER_ETERNITY:
          this.goToCity();
          break;
        case REGION_ETERNITY:
          this.goToRegion(region);
          break;
        case VANCOUVER_PLAYBACK:
          this.goToDisabledCity();
          break;
        default:
          console.log("ERROR");
          break;
      }
      this.buttonManager.changeState(state, region);
    }

    this.goToRegion = function(region) {
      this.map.setCenter(this.regionObjects[region].regionBoundary.bounds.getCenter());
      this.map.setZoom(14);
      this.removeRegions();
      this.regionObjects[region].showPrivateRegion();
    }

    this.goToCity = function() {
      this.map.setCenter(new google.maps.LatLng(49.255, -123.125));
      this.map.setZoom(12);
      this.showRegions();
      this.enableRegions();
    }

    this.goToDisabledCity = function() {
      this.map.setCenter(new google.maps.LatLng(49.255, -123.125));
      this.map.setZoom(12);
      this.disableRegions();
    }

    this.enableRegions = function() {
      console.log('enableRegions called');
      this.regionObjects.forEach(function(element) {
        element.addRegionListener();
      }, this);
    }

    this.disableRegions = function() {
      this.regionObjects.forEach(function(element) {
        element.removeRegionListener();
      }, this);
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
  this.listenedTo = true;

  this.regionBoundary = mapManager.mapMaker.makeRegionBorder(
    new google.maps.LatLng(regionInfo.bb[0].lat, regionInfo.bb[0].lng),
    new google.maps.LatLng(regionInfo.bb[1].lat, regionInfo.bb[1].lng)
  );

  this.regionListener = google.maps.event.addListener(this.regionBoundary, 'click', function() {
    that.mapManager.appManager.changeState(REGION_ETERNITY, that.regionId);
  });

  this.removeRegionListener = function() {
    if (this.listenedTo === true) {
      console.log('listener removed');
      google.maps.event.removeListener(this.regionListener);
      this.listenedTo = false;
    }
  }

  this.addRegionListener = function() {
    if (this.listenedTo === false) {
      google.maps.event.addListener(this.regionBoundary, 'click', function() {
        that.mapManager.appManager.changeState(REGION_ETERNITY, that.regionId);
      });
      this.listenedTo = true;
    }
  }

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
      tweet = new Tweet(this, new google.maps.LatLng(element.lat, element.lng), element);
      this.tweets.push(tweet);
      //console.log('count ' + this.tweets.length);
    }, this);
    if (this.printTweets == true) {
      this.showTweets();
    } else {
      //console.log('DIDNT PRINT');
    }
  }

  this.showTweets = function() {
    this.tweets.forEach(function(element, index) {
      element.show();
    });
  }
}


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

    var mapDiv = document.getElementById("map-canvas");
    google.maps.event.addDomListener(mapDiv,'click', function() {
      $("#myddOptsDiv").css('display', 'none');
    });
    
    return new google.maps.Map(mapDiv,mapOptions);
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
      pixelOffset = new google.maps.Size(-35, 5);
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
function HomeControl(controlDiv, map, buttonManager) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.id = 'backbutton';
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '1px';
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
  controlText.innerHTML = 'Overview';
  controlUI.appendChild(controlText);

  buttonManager.overviewButton = controlUI;
}

// The ReplayControl object holds the configuration for generating the Replay button
function ReplayControl(controlDiv, map, buttonManager) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.id = 'replaybutton';
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '1px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.style.visibility = 'hidden';
  controlUI.title = 'Click to replay the last 24 hours';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = 'Stop Replay';
  controlUI.appendChild(controlText);

  buttonManager.replayButton = controlUI;
}

   /************
   Classes to set up the drop-down control
   ************/
          
    function optionDiv(options){
      var control = document.createElement('DIV');
      control.className = "dropDownItemDiv";
      control.title = options.title;
      control.id = options.id;
      control.innerHTML = options.name;
      google.maps.event.addDomListener(control,'click',options.action);
      return control;
     }
     
     function dropDownOptionsDiv(options){
      //alert(options.items[1]);
        var container = document.createElement('DIV');
        container.className = "dropDownOptionsDiv";
        container.id = options.id;
        
        for(i=0; i<options.items.length; i++){
          //alert(options.items[i]);
          container.appendChild(options.items[i]);
        }
        
        //for(item in options.items){
          //container.appendChild(item);
          //alert(item);
        //}        
    return container;         
      }
     
     function dropDownControl(options){
        var container = document.createElement('DIV');
        container.className = 'container';
        
        var control = document.createElement('DIV');
        control.className = 'dropDownControl';
        control.innerHTML = options.name;
        control.id = options.name;
        var arrow = document.createElement('IMG');
        arrow.src = "http://maps.gstatic.com/mapfiles/arrow-down.png";
        arrow.className = 'dropDownArrow';
        control.appendChild(arrow);           
        container.appendChild(control);    
        container.appendChild(options.dropDown);
        
        options.gmap.controls[options.position].push(container);
        google.maps.event.addDomListener(container,'click',function(event){
          event.stopPropagation();
          (document.getElementById('myddOptsDiv').style.display == 'block') ? document.getElementById('myddOptsDiv').style.display = 'none' : document.getElementById('myddOptsDiv').style.display = 'block';
        })          
      }
