$(function() {
  
  var regions = [
    {
      name: "West Vancouver",
      bb: [
            { lat: 49.195, lng: -123.27},
            { lat: 49.315, lng: -123.16772}
          ]
    },
    {
      name: "Central Vancouver",
      bb: [
            { lat: 49.195, lng: -123.16772},
            { lat: 49.315, lng: -123.05717}
          ]
    },
    {
      name: "East Vancouver",
      bb: [
            { lat: 49.195, lng: -123.05717},
            { lat: 49.315, lng: -123.020}
          ]
    }
  ];

  var appManager = new AppManager(regions);
  appManager.initializeApp();

  setInterval(function() {
    appManager.timeManager.showNow();
  }, 1000);
});

// The App Manager object orchestrates the operations of the entire application
function AppManager(regions) {
  this.mapManager = new MapManager(regions);
  this.tableManager = new TableManager();
  this.tweetbox;
  this.timeManager = new TimeManager();
  
  this.initializeApp = function() {
    google.maps.event.addDomListener(window, 'load', this.mapManager.initializeMap());

    // Usage ////////////////////////////////////                        
    var dataset = {
        columnLabel: ['Region', 'Sentiment', 'Weather'],
        rowLabel: ['EV', 'CV', 'WV'],
        value: [[1, 2], [5, 6], [9, 10]]
    };
                        
    var width = 400;
    var height = 300;

    var table = Table().width(width).height(height);

    d3.select('#table')
        .append("svg:svg")
        .datum(dataset)
        .call(table);

    }
}

// The TimeManager object manages the time-date display
function TimeManager() {
  this.datetime;

  this.showNow = function() {
    this.datetime = new Date();
    $('#time-date').text(this.datetime.toLocaleTimeString() + ' ' + this.datetime.toLocaleDateString());
  }
}

function TableManager() {

}

  // The Map Manager object holds a MapMaker and all the Region objects, orchestrating the map operations
  function MapManager(regions) {
    this.map;
    this.regionInfos = regions;
    this.regionObjects = [];
    this.mapMaker = new MapMaker();

    this.initializeMap = function() {
      this.map = this.mapMaker.makeMap();
      this.initializeRegions();
      this.initializeButtons();
    },

    this.initializeRegions = function() {
      this.regionInfos.forEach(function(element) {
        this.regionObjects.push(new Region(element, this));
      }, this);

      this.regionObjects.forEach(function(element) {
        element.showRegion();
      }, this);
    },

    this.initializeButtons = function() {
      var homeControlDiv = document.createElement('div');
      var homeControl = new HomeControl(homeControlDiv, this.map);
      homeControlDiv.index = 1;
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);
    },

    this.showRegions = function() {
      this.regionObjects.forEach(function(element) {
        element.showRegion();
      }, this);
    }

    this.showButtons = function() {
      $('div#backbutton').css('visibility', 'visible');
    },

    this.hideButtons = function() {
      $('div#backbutton').css('visibility', 'hidden');
    },

    this.addButtonClickEvents = function() {
      var that = this;
      $('div#backbutton').click(function() {
        that.map.setCenter(new google.maps.LatLng(49.255, -123.125));
        that.map.setZoom(12);
        that.hideButtons();
        that.showRegions();
      });
    },

    this.goToRegion = function(regionBoundary) {
      this.map.setCenter(regionBoundary.bounds.getCenter());
      this.map.setZoom(12);
    },

    this.removeRegions = function() {
      this.regionObjects.forEach(function(element) {
        element.hideRegion();
      }, this);
    }
  }

// The Region object holds all the map elements and information specific to a region
function Region(regionInfo, mapManager) {
  var that = this;
  this.count = '0';

  this.regionBoundary = mapManager.mapMaker.makeRegionBorder(
    new google.maps.LatLng(regionInfo.bb[0].lat, regionInfo.bb[0].lng),
    new google.maps.LatLng(regionInfo.bb[1].lat, regionInfo.bb[1].lng)
  );

  this.regionListener = google.maps.event.addListener(this.regionBoundary, 'click', function() {
    mapManager.goToRegion(this);
    mapManager.showButtons();
    mapManager.addButtonClickEvents();
    mapManager.removeRegions();
    that.showRegion();
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
    mapManager.mapMaker.makeCountLabel(
      this.count, 
      new google.maps.LatLng(this.regionBoundary.bounds.getCenter().lat()-0.0125,
        this.regionBoundary.bounds.getCenter().lng())
    );
    this.regionCountLabel.setMap(mapManager.map);
  }

  this.regionCountCircle = mapManager.mapMaker.makeCountCircle(
    new google.maps.LatLng(this.regionBoundary.bounds.getCenter().lat()-0.0125,
      this.regionBoundary.bounds.getCenter().lng())
  );

  this.showRegion = function() {
    this.regionBoundary.setMap(mapManager.map);
    this.regionLabel.setMap(mapManager.map);
    this.regionCountLabel.setMap(mapManager.map);
    this.regionCountCircle.setMap(mapManager.map);
  },

  this.hideRegion = function() {
    this.regionBoundary.setMap(null);
    this.regionLabel.setMap(null);
    this.regionCountLabel.setMap(null);
    this.regionCountCircle.setMap(null);
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
          radius: 400
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



// Table module ////////////////////////////////////
var Table = function module() {
    var opts = {
        width: 100,
        height: 100,
        margins: {top: 0, right: 0, bottom: 0, left: 0}
    };

    function exports(selection) {
        selection.each(function (dataset) {

            //________________________________________________
            // Data
            //________________________________________________
            var columnLabel = dataset.columnLabel;
            var rowLabel = dataset.rowLabel;
            var value = dataset.value;

            //________________________________________________
            // DOM preparation
            //________________________________________________
            // Size
            var chartW = Math.max(opts.width - opts.margins.left - opts.margins.right, 0.1);
            var chartH = Math.max(opts.height - opts.margins.top - opts.margins.bottom, 0.1);

            // SVG
            var parentDiv = d3.select(this).html('');
            var svg = parentDiv.append('svg').attr('width', opts.width).attr('height', opts.height);
            var visSvg = svg.append('g').attr('class', 'vis-group').attr('transform', 'translate(' + opts.margins.left + ',' + opts.margins.top + ')');
            var tableBodySvg = visSvg.append('g').attr('class', 'chart-group');
            var tableHeaderSvg = visSvg.append('g').attr('class', 'chart-group');
            var rowHeaderSvg = tableHeaderSvg.append('g').attr('class', 'row-header');
            var colHeaderSvg = tableHeaderSvg.append('g').attr('class', 'col-header');

            //________________________________________________
            // Table
            //________________________________________________
            var rowHeaderLevelNum = 1;
            var colHeaderLevelNum = 1;
            var cellH = chartH / (value.length + rowHeaderLevelNum);
            var cellW = chartW / (value[0].length + colHeaderLevelNum);

            // Row header
            var rowHeaderCell = rowHeaderSvg.selectAll('rect.row-header-cell')
                .data(rowLabel);
            rowHeaderCell.enter().append('rect')
                .attr({
                    class:'row-header-cell',
                    width:cellW, height:cellH,
                    x: 0,
                    y: function(d, i){return i * cellH + (cellH * colHeaderLevelNum)}
                })
                .style({fill:'#eee', stroke:'silver'});

            // Row header text
            rowHeaderCell.enter().append('text')
                .attr({
                    class:'row-header-content',
                    x: 0,
                    y: function(d, i){return i * cellH + (cellH * colHeaderLevelNum)},
                    dx: cellW/2,
                    dy: cellH/2
                })
                .style({fill:'black', 'text-anchor':'middle'})
                .text(function(d, i){return d;});

            // Col header
            var colHeaderCell = colHeaderSvg.selectAll('rect.col-header-cell')
                .data(columnLabel);
            colHeaderCell.enter().append('rect')
                .attr({
                    class:'col-header-cell',
                    width:cellW, height:cellH,
                    x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                    y: 0
                })
                .style({fill:'#eee', stroke:'silver'});

            // Col header text
            colHeaderCell.enter().append('text')
                .attr({
                    class:'col-header-content',
                    x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                    y: 0,
                    dx: cellW/2,
                    dy: cellH/2
                })
                .style({fill:'black', 'text-anchor':'middle'})
                .text(function(d, i){return d;});

            // Body
            var row = tableBodySvg.selectAll('g.row')
                .data(value);
            row.enter().append('g')
                .attr('class', 'cell row')
                .each(function(pD, pI){
                    // Cells
                    var cell = d3.select(this)
                        .selectAll('rect.cell')
                        .data(pD);
                    cell.enter().append('rect')
                        .attr({
                            class:'cell', width:cellW, height:cellH,
                            x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                            y: function(d, i){return pI * cellH + cellH}
                        })
                        .style({fill:'white', stroke:'silver'});
                    // Text
                    cell.enter().append('text')
                        .attr({
                            class:'cell-content', width:cellW, height:cellH,
                            x: function(d, i){return i * cellW + (cellW * rowHeaderLevelNum)},
                            y: function(d, i){return pI * cellH + cellH},
                            dx: cellW/2,
                            dy: cellH/2
                        })
                        .style({fill:'black', 'text-anchor':'middle'})
                        .text(function(d, i){return d;});
                });
        });
    }

    exports.opts = opts;
    createAccessors(exports, opts);
    return exports;
};
  
// Helper function ////////////////////////////////////                       
var createAccessors = function(visExport) {
    for (var n in visExport.opts) {
        if (!visExport.opts.hasOwnProperty(n)) continue;
        visExport[n] = (function(n) {
            return function(v) {
                return arguments.length ? (visExport.opts[n] = v, this) : visExport.opts[n];
            }
        })(n);
    }
};                        
 


  /*var socket = io.connect('http://localhost');
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

      }
    }
    setAllMap(map);
  }*/

  



        /*var length = clusterCollection[cluster].tweetIDs.length;
        for (var i = 0) {
          clusterCollection[cluster].tweetIDs[i];
        }*/