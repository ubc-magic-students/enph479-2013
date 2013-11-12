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