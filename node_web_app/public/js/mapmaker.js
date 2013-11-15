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

  this.makeRegionBorder = function(sw, ne, fillColor) {
    return new google.maps.Rectangle({
      strokeColor: '#000000',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: fillColor || '#FF0000',
      fillOpacity: (fillColor ? 0.5 : 0),
      bounds: new google.maps.LatLngBounds(sw,ne)
    });
  }

  this.makeRegionLabel = function(name, pos) {
    var pixelOffset = new google.maps.Size(-25, -25);
    var width = "55px";
    if (name == "Shaughnessy") {
      width = "75px";
      pixelOffset = new google.maps.Size(-35, -45);
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
  };

  this.makeRegionCountLabel = function(number, pos) {
    var pixelOffset = new google.maps.Size(-10, 10);
    var width = "20px";
    var labelOptions = {
           content: number
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
  };

  this.makeInfoWindow = function() {
    return new google.maps.InfoWindow({
      maxWidth: 300
    });
  };

  this.makeControl = function(controlDiv, id, title, text) {
    controlDiv.style.padding = '5px';
    controlDiv.index = 1;

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.id = id;
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.style.visibility = 'hidden';
    controlUI.title = title;
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = text;
    controlUI.appendChild(controlText);

    return controlUI;
  };

  this.makeOptionDiv = function(options) {
    var control = document.createElement('DIV');
    control.className = "dropDownItemDiv";
    control.title = options.title;
    control.id = options.id;
    control.innerHTML = options.name;
    google.maps.event.addDomListener(control,'click',options.action);
    return control;
  }

  this.makeDropDownOptionsDiv = function(options) {
    var container = document.createElement('DIV');
    container.className = "dropDownOptionsDiv";
    container.id = options.id;
      
    for(i=0; i<options.items.length; i++){
      container.appendChild(options.items[i]);
    }
    return container;   
  }

  this.makeDropDownControl = function(options) {
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
    });
  }
}