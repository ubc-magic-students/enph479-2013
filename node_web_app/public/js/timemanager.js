// The TimeManager object manages the time-date display
function TimeManager() {
  this.lastUpdated;

  this.saveLastUpdated = function() {
    this.lastUpdated = new Date();
  }

  this.showLastUpdated = function() {
    if (this.lastUpdated !== undefined) {
      $('#time-date').text('Last Updated: ' + this.lastUpdated.toLocaleTimeString() + ' ' + this.lastUpdated.toLocaleDateString());
    } else {
      $('#time-date').text('Not updated');
    }
  }

  this.showPlayTime = function(time) {
    $('#time-date').text('Playback Time: ' + time);
  }

  this.initializeTime = function() {
    $('#time-date').text('Not updated');
  }
  
  this.showMessage = function(message) {
    $('#time-date').text(message);
  }
}