function ButtonManager(mapMaker, map) {
  mediator.installTo(this);

  this.mapMaker = mapMaker;
  this.map = map;

  this.overviewButton;
  this.overviewListener;
  this.replayButton;
  this.replayListener;
  var that = this;

  this.subscribe(EVENTS.INITIALIZE, function() {
    this.initializeButtons();
  });

  this.subscribe(EVENTS.ZOOM_TO_REGION, function() {
    this.setRegionEternityState();
  });

  this.subscribe(EVENTS.ZOOM_OUT, function() {
    this.setOverviewEternityState();
  });

  this.subscribe(EVENTS.CALL_FOR_TIMEPLAY, function() {
    this.setOverviewPreReplayState();
  });

  this.subscribe(EVENTS.INITIALIZE_TIMEPLAY, function() {
    this.setOverviewReplayState();
  });

  this.subscribe(EVENTS.STOP_TIMEPLAY, function() {
    this.setOverviewEternityState();
  });

  this.initializeButtons = function() {
    var overviewDiv = document.createElement('div');
    this.overviewButton = this.mapMaker.makeControl(overviewDiv, 'backbutton', 'Click to set the map to Vancouver', 'Overview');
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(overviewDiv);

    var replayDiv = document.createElement('div');
    this.replayButton = this.mapMaker.makeControl(replayDiv, 'replaybutton', 'Click to stop replay', 'Stop Replay');
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(replayDiv);

    var divOptions = {
            gmap: this.map,
            name: '1X',
            title: "Playback at 10 minutes per second",
            id: "1X",
            action: function(){
              mediator.publish(EVENTS.CALL_FOR_TIMEPLAY, 1);
            }
        }
        var optionDiv1 = new optionDiv(divOptions);
        
        var divOptions2 = {
            gmap: this.map,
            name: '2X',
            title: "Playback at 20 minutes per second",
            id: "2X",
            action: function(){
              mediator.publish(EVENTS.CALL_FOR_TIMEPLAY, 2);
            }
        }
        var optionDiv2 = new optionDiv(divOptions2);

        var divOptions3 = {
            gmap: this.map,
            name: '6X',
            title: "Playback at 1 hour per second",
            id: "6X",
            action: function(){
              mediator.publish(EVENTS.CALL_FOR_TIMEPLAY, 6);
            }
        }
        var optionDiv3 = new optionDiv(divOptions3);
        
        //put them all together to create the drop down       
        var ddDivOptions = {
          items: [optionDiv1, optionDiv2, optionDiv3],
          id: "myddOptsDiv"
        }
        //alert(ddDivOptions.items[1]);
        var dropDownDiv = new dropDownOptionsDiv(ddDivOptions);               
                
        var dropDownOptions = {
            gmap: this.map,
            name: 'Replay',
            id: 'ddControl',
            title: 'Replay at the selected speed',
            position: google.maps.ControlPosition.RIGHT_TOP,
            dropDown: dropDownDiv 
        }
        
        var dropDown1 = new dropDownControl(dropDownOptions);      


    this.setOverviewEternityState();
  }

  this.setOverviewEternityState = function() {
    $('div#backbutton').css('visibility', 'hidden');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'visible');
    $('div#Replay').next().css('display', 'none');
  }

  this.setRegionEternityState = function() {
    $('div#backbutton').css('visibility', 'visible');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'hidden');
    this.addOverviewButtonClickEvent();
  }

  this.setOverviewPreReplayState = function() {
    $('div#backbutton').css('visibility', 'hidden');
    $('div#replaybutton').css('visibility', 'hidden');
    $('div#Replay').parent().css('visibility', 'hidden');
    this.addStopEvent();
  }

  this.setOverviewReplayState = function() {
    $('div#replaybutton').css('visibility', 'visible');
  }

  this.addStopEvent = function() {
    var that = this;
    google.maps.event.removeListener(this.replayListener);
    this.replayListener = google.maps.event.addDomListener(this.replayButton, 'click', function() {
      mediator.publish(EVENTS.STOP_TIMEPLAY);
    });
  }

  this.addOverviewButtonClickEvent = function() {
    var that = this;
    google.maps.event.removeListener(this.overviewListener);
    this.overviewListener = google.maps.event.addDomListener(this.overviewButton, 'click', function() {
      mediator.publish(EVENTS.ZOOM_OUT);
    });
  }
}

   /************
   Classes to set up the drop-down control
   ************/
          
    function optionDiv(options){
      var control = document.createElement('DIV');
      control.className = "dropDownItemDiv";
      control.title = options.title;
      control.id = options.id;
      control.innerHTML = options.name;
      google.maps.event.addDomListener(control,'click',options.action);
      return control;
     }
     
     function dropDownOptionsDiv(options){
      //alert(options.items[1]);
        var container = document.createElement('DIV');
        container.className = "dropDownOptionsDiv";
        container.id = options.id;
        
        for(i=0; i<options.items.length; i++){
          //alert(options.items[i]);
          container.appendChild(options.items[i]);
        }
        
        //for(item in options.items){
          //container.appendChild(item);
          //alert(item);
        //}        
    return container;         
      }
     
     function dropDownControl(options){
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
        })          
      }

