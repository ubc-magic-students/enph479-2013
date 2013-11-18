function SliderManager(regions) {
  mediator.installTo(this);
  var regionData;

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function(data) {
    regionData = JSON.parse(JSON.stringify(data[0]));
    initializeSlider(regionData);
  });

  this.subscribe(EVENTS.SHOW_TIMEPLAY, function(playbackInstance) {
    $("#slider").slider( "value", playbackInstance.indexCounter );
  });

  this.subscribe(EVENTS.STOP_TIMEPLAY, function() {
    destroySlider();
  });

  var initializeSlider = function(regionData) {
    var regionLength = regions.length;
    var regionDataLength = regionData.length;
    var max = regionDataLength / regionLength - 1;
    
    $( "#slider" ).slider({
      min: 0,
      max: max,
      slide: function(event, ui) {
        mediator.publish(EVENTS.TIMEPLAY_JUMP, ui.value);
      }
    });
  };

  var destroySlider = function() {
    $("#slider").slider("destroy");
  }
}