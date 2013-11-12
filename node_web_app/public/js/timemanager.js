// The TimeManager object manages the time-date display
function TimeManager() {
  mediator.installTo(this);
  this.lastUpdated;

  /*this.saveLastUpdated = function() {
    this.lastUpdated = new Date();
  }*/

  /*this.showLastUpdated = function() {
    if (this.lastUpdated !== undefined) {
      $('#time-date').text('Last Updated: ' + this.lastUpdated.toLocaleTimeString() + ' ' + this.lastUpdated.toLocaleDateString());
    } else {
      $('#time-date').text('Not updated');
    }
  }*/

  /*this.showPlayTime = function(time) {
    $('#time-date').text('Playback Time: ' + time);
  }*/

  /*this.initializeTime = function() {
    $('#time-date').text('Not updated');
  }*/
  
  /*this.showMessage = function(message) {
    $('#time-date').text(message);
  }*/

  this.subscribe('initialize', function () {
    $('#time-date').text('Not updated');
  });

  this.subscribe('saveUpdate', function() {
    this.lastUpdated = new Date();
  });

  this.subscribe('showUpdate', function() {
    if (this.lastUpdated !== undefined) {
      $('#time-date').text('Last Updated: ' + this.lastUpdated.toLocaleTimeString() + ' ' + this.lastUpdated.toLocaleDateString());
    } else {
      $('#time-date').text('Not updated');
    }
  });

  this.subscribe('callForTimePlay', function () {
    $('#time-date').text("Going back in time, please stand by...");
  });

  this.subscribe('initializeTimeplay', function () {
    $('#time-date').text("Time traveling commencing...");
  });

  this.subscribe('showTimePlay', function(arg) {
    $('#time-date').text('Playback Time: ' + arg);
  });
}