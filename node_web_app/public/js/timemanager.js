// The TimeManager object manages the time-date display
function TimeManager() {
  mediator.installTo(this);
  this.lastUpdated;

  this.subscribe(EVENTS.INITIALIZE, function () {
      $('#time-date').text('Not updated');
  });

  this.subscribe(EVENTS.SAVE_REGION_UPDATE, function() {
    this.lastUpdated = new Date();
  });

  this.subscribe(EVENTS.SHOW_REGION_UPDATE, function() {
    if (this.lastUpdated !== undefined) {
      $('#time-date').text('Last Updated: ' + this.lastUpdated.toLocaleTimeString() + ' ' + this.lastUpdated.toLocaleDateString());
    } else {
      $('#time-date').text('Not updated');
    }
  });

  this.subscribe(EVENTS.CALL_FOR_TIMEPLAY, function () {
    $('#time-date').text("Going back in time, please stand by...");
  });

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function () {
    $('#time-date').text("Time traveling commencing...");
  });

  this.subscribe(EVENTS.SHOW_TIMEPLAY, function(time, tableData) {
    $('#time-date').text('Playback Time: ' + time);
  });

  this.subscribe(EVENTS.STOP_TIMEPLAY, function() {
    if (this.lastUpdated !== undefined) {
      $('#time-date').text('Last Updated: ' + this.lastUpdated.toLocaleTimeString() + ' ' + this.lastUpdated.toLocaleDateString());
    } else {
      $('#time-date').text('Not updated');
    }
  })
}