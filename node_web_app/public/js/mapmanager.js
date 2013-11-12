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