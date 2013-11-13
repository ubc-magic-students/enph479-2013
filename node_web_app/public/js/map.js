$(function() {
  var socketManager = new SocketManager();

  var timeManager = new TimeManager();

  var mapMaker = new MapMaker();
  var map = mapMaker.makeMap();
  var buttonManager = new ButtonManager(mapMaker, map);
  var mapManager = new MapManager(REGIONS, mapMaker, map);

  var tableManager = new TableManager(REGIONS);
  var graphManager = new GraphManager();

  var appManager = new AppManager(REGIONS);

  google.maps.event.addDomListener(window, 'load', function() {
    mediator.publish(EVENTS.INITIALIZE)
  });
});

// The App Manager object orchestrates the operations of the entire application
function AppManager(regions) {
  mediator.installTo(this);

  this.state = STATE.VANCOUVER_ETERNITY;

  this.subscribe(EVENTS.REGION_UPDATE, function(data) {
    mediator.publish(EVENTS.SAVE_REGION_UPDATE, data);
    if (this.state != STATE.VANCOUVER_PLAYBACK) {
      mediator.publish(EVENTS.SHOW_REGION_UPDATE, this.regionIdForRegionView);
    }
  });

  this.regions = regions;
  this.regionIdForRegionView = -1;
}