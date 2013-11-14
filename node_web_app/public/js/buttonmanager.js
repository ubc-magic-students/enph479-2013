function ButtonManager(mapMaker, map) {
  mediator.installTo(this);
  this.registerCallbacks([{ 
      channel:  EVENTS.INITIALIZE,
      fn:       function () {
                  initializeButtons();
                }
    }, {
      channel:  EVENTS.ZOOM_TO_REGION
      fn:       function() {
                  setRegionEternityState();
                }
    }, {
      channel:  EVENTS.ZOOM_OUT
      fn:       function() {
                  setOverviewEternityState();
                }
    }, {
      channel:  EVENTS.CALL_FOR_TIMEPLAY,
      fn:       function() {
                  setOverviewPreReplayState();
                }
    }, {
      channel:  EVENTS.INITIALIZE_TIMEPLAY,
      fn:       function() {
                  setOverviewReplayState();
                }
    }, {
      channel:  EVENTS.STOP_TIMEPLAY,
      fn:       function() {
                  setOverviewEternityState();
                }
  }]);

  var overviewButton;
  var overviewListener;
  var replayButton;
  var replayListener;

  var initializeButtons = function() {
    var overviewDiv = document.createElement('div');
    overviewButton = mapMaker.makeControl(overviewDiv, 'backbutton', 'Click to set the map to Vancouver', 'Overview');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(overviewDiv);

    var replayDiv = document.createElement('div');
    replayButton = mapMaker.makeControl(replayDiv, 'replaybutton', 'Click to stop replay', 'Stop Replay');
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(replayDiv);

    var divOptions = {
      gmap: map,
      name: '1X',
      title: "Playback at 10 minutes per second",
      id: "1X",
      action: function(){
        mediator.publish(EVENTS.CALL_FOR_TIMEPLAY, 1);
      }
    }
    var optionDiv1 = mapMaker.makeOptionDiv(divOptions);
        
    var divOptions2 = {
      gmap: map,
      name: '2X',
      title: "Playback at 20 minutes per second",
      id: "2X",
      action: function(){
        mediator.publish(EVENTS.CALL_FOR_TIMEPLAY, 2);
      }
    }
    var optionDiv2 = mapMaker.makeOptionDiv(divOptions2);

    var divOptions3 = {
        gmap: map,
        name: '6X',
        title: "Playback at 1 hour per second",
        id: "6X",
        action: function(){
          mediator.publish(EVENTS.CALL_FOR_TIMEPLAY, 6);
        }
    }
    var optionDiv3 = mapMaker.makeOptionDiv(divOptions3);
    
    //put them all together to create the drop down       
    var ddDivOptions = {
      items: [optionDiv1, optionDiv2, optionDiv3],
      id: "myddOptsDiv"
    }
    var dropDownDiv = mapMaker.makeDropDownOptionsDiv(ddDivOptions);               
                
    var dropDownOptions = {
        gmap: map,
        name: 'Replay',
        id: 'ddControl',
        title: 'Replay at the selected speed',
        position: google.maps.ControlPosition.RIGHT_TOP,
        dropDown: dropDownDiv 
    }
    var dropDown1 = mapMaker.makeDropDownControl(dropDownOptions);      

    setOverviewEternityState();
  }

  var setOverviewEternityState = function() {
    $('div#backbutton').css('visibility', 'hidden');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'visible');
    $('div#Replay').next().css('display', 'none');
  }

  var setRegionEternityState = function() {
    $('div#backbutton').css('visibility', 'visible');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'hidden');
    addOverviewButtonClickEvent();
  }

  var setOverviewPreReplayState = function() {
    $('div#backbutton').css('visibility', 'hidden');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'hidden');
    addStopEvent();
  }

  var setOverviewReplayState = function() {
    $('div#replaybutton').css('visibility', 'visible');
  }

  var addStopEvent = function() {
    google.maps.event.removeListener(replayListener);
    replayListener = google.maps.event.addDomListener(replayButton, 'click', function() {
      mediator.publish(EVENTS.STOP_TIMEPLAY);
    });
  }

  var addOverviewButtonClickEvent = function() {
    google.maps.event.removeListener(overviewListener);
    overviewListener = google.maps.event.addDomListener(overviewButton, 'click', function() {
      mediator.publish(EVENTS.ZOOM_OUT);
    });
  }
}
