function SliderManager() {
  mediator.installTo(this);

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function() {
    initializeSlider();
  });

  var initializeSlider = function(data) {
    data[0]
    $( "#slider" ).slider();
  };
}