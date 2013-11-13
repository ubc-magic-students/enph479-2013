var EVENTS = {
  INITIALIZE: "initialize",
  ZOOM_TO_REGION: "zoomToRegion",
  ZOOM_OUT: "zoomOut",
  REGION_UPDATE: "regionUpdate",
  TWEET_UPDATE: "tweetUpdate",
  SAVE_REGION_UPDATE: "saveUpdate",
  SHOW_REGION_UPDATE: "showUpdate",
  CALL_FOR_TIMEPLAY: "callForTimePlay",
  INITIALIZE_TIMEPLAY: "initializeTimePlay",
  SHOW_TIMEPLAY: "showTimePlay",
  STOP_TIMEPLAY: "stopTimePlay"
};

var SOCKET_ROOMS = {
  TIMEPLAY_FEED: "timeplayFeed",
  REGION_FEED: "regionFeed",
  TWEET_FEED: "tweetFeed"
};

var SOCKET_EVENTS = {
  REGION_UPDATE: "regionUpdate",
  TWEET_UPDATE: "tweetUpdate",
  TIMEPLAY_REQUEST: "timeplayRequest",
  TIMEPLAY_RESPONSE: "timeplayResponse"
};

var STATE = {
  VANCOUVER_ETERNITY: 0,
  REGION_ETERNITY: 1,
  VANCOUVER_PLAYBACK: 2
};