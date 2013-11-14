// The TimeManager object manages the time-date display / message box
function TimeManager() {

  // Add event handlers to the Time Manager
  mediator.installTo(this);
  this.registerCallbacks([{ 
      channel:  EVENTS.INITIALIZE,
      fn:       function () {
                  $('#time-date').text('Not updated');
                }
    }, {
      channel:  EVENTS.REGION_UPDATE,
      fn:       function() {
                  lastUpdated = new Date();
                }
    }, {
      channel:  EVENTS.SHOW_REGION_UPDATE,
      fn:       function() {
                  showLastUpdated();
                }
    }, {
      channel:  EVENTS.CALL_FOR_TIMEPLAY,
      fn:       function() {
                  $('#time-date').text("Going back in time, please stand by...");
                }
    }, {
      channel:  EVENTS.INITIALIZE_TIMEPLAY,
      fn:       function() {
                  $('#time-date').text("Time traveling commencing...");
                }
    }, {
      channel:  EVENTS.SHOW_TIMEPLAY,
      fn:       function(time, tableData) {
                  $('#time-date').text('Playback Time: ' + time);
                }
    }, {
      channel:  EVENTS.STOP_TIMEPLAY,
      fn:       function() {
                  showLastUpdated();  
                }
  }]);

  var lastUpdated;  // stores the time of the last region data update

  var showLastUpdated = function() {
    if (lastUpdated !== undefined) {
      $('#time-date').text('Last Updated: ' + lastUpdated.toLocaleTimeString() +
        ' ' + lastUpdated.toLocaleDateString());
      } else {
        $('#time-date').text('Not updated');
      }
  }
}