$(function() {
  var socketManager = new SocketManager();

  var timeManager = new TimeManager();

  var mapMaker = new MapMaker();
  var map = mapMaker.makeMap();
  var buttonManager = new ButtonManager(mapMaker, map);
  var mapManager = new MapManager(REGIONS, mapMaker, map);

  var tableManager = new TableManager(REGIONS);
  var graphManager = new GraphManager();

  var appManager = new AppManager();

  google.maps.event.addDomListener(window, 'load', function() {
    mediator.publish(EVENTS.INITIALIZE)
  });
});

// The App Manager object orchestrates the operations of the entire application
function AppManager() {
  mediator.installTo(this);

  this.state = STATE.VANCOUVER_ETERNITY;

  this.subscribe(EVENTS.REGION_UPDATE, function(data) {
    if (this.state != STATE.VANCOUVER_PLAYBACK) {
      mediator.publish(EVENTS.SHOW_REGION_UPDATE, this.regionIdForRegionView);
    }
  });

  this.subscribe(EVENTS.ZOOM_TO_REGION, function(regionId) {
    this.regionIdForRegionView = regionId;
  });

  this.subscribe(EVENTS.ZOOM_OUT, function() {
    this.regionIdForRegionView = -1;
  });

  this.regionIdForRegionView = -1;
}