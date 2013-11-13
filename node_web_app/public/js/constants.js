var EVENTS = {
  INITIALIZE: "initialize",                   // when the application starts
  ZOOM_TO_REGION: "zoomToRegion",             // when the user clicks on a region to zoom in
  ZOOM_OUT: "zoomOut",                        // when the user clicks on the Overview button to zoom out
  REGION_UPDATE: "regionUpdate",              // when new region data is received
  TWEET_UPDATE: "tweetUpdate",                // when new tweets are received
  SHOW_REGION_UPDATE: "showUpdate",           // when new region data is shown
  CALL_FOR_TIMEPLAY: "callForTimePlay",       // when user requests playback
  INITIALIZE_TIMEPLAY: "initializeTimePlay",  // when playback data is receeved
  SHOW_TIMEPLAY: "showTimePlay",              // when playback data is shown
  STOP_TIMEPLAY: "stopTimePlay"               // when playback is stopped
};

var SOCKET_EVENTS = {
  REGION_UPDATE: "regionUpdate",              // when new region data is received
  TWEET_UPDATE: "tweetUpdate",                // when new tweets are received
  TIMEPLAY_REQUEST: "timeplayRequest",        // when user requests playback
  TIMEPLAY_RESPONSE: "timeplayResponse"       // playback data is received
};

var STATE = {
  VANCOUVER_ETERNITY: 0,                      // Zoomed-out overview of Vancouver
  REGION_ETERNITY: 1,                         // Zoomed-in view of region
  VANCOUVER_PLAYBACK: 2                       // Playback mode of Vancouver
};