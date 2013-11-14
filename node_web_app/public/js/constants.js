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

var REGIONS = [
  {
    name: "UBC",
    id: "0",
    bb: [
      { lat: 49.23083, lng: -123.26660 },
      { lat: 49.27632, lng: -123.21476 }
    ]
  },
  {
    name: "West Point Grey",
    id: "1",
    bb: [
      { lat: 49.25795, lng: -123.21476 },
      { lat: 49.27632, lng: -123.18592 }
    ]
  },
  {
    name: "Kitsilano",
    id: "2",
    bb: [
      { lat: 49.25795, lng: -123.18592 },
      { lat: 49.27632, lng: -123.14610 }
    ]
  },
  {
    name: "Fairview",
    id: "3",
    bb: [
          { lat: 49.25795, lng: -123.14610 },
          { lat: 49.26982, lng: -123.11520 }
        ]
  },
  {
    name: "Mount Pleasant",
    id: "4",
    bb: [
          { lat: 49.25795, lng: -123.11520 },
          { lat: 49.26982, lng: -123.07777 }
        ]
  },
  {
    name: "Dunbar",
    id: "5",
    bb: [
          { lat: 49.21939, lng: -123.21476 },
          { lat: 49.25795, lng: -123.17081 }
        ]
  },
  {
    name: "Arbutus",
    id: "6",
    bb: [
        { lat: 49.23441, lng: -123.17081 },
        { lat: 49.25795, lng: -123.15399 }
    ]
  },
  {
    name: "Shaughnessy",
    id: "7",
    bb: [
        { lat: 49.23441, lng: -123.15399 },
        { lat: 49.25795, lng: -123.13923 }
    ]
  },
  {
    name: "South Cambie",
    id: "8",
    bb: [
        { lat: 49.23441, lng: -123.13923 },
        { lat: 49.25795, lng: -123.1152 }
    ]
  },
  {
    name: "Riley Park",
    id: "9",
    bb: [
        { lat: 49.23441, lng: -123.1152 },
        { lat: 49.25795, lng: -123.09082 }
    ]
  },
  {
    name: "Kensington",
    id: "10",
    bb: [
        { lat: 49.23441, lng: -123.09082 },
        { lat: 49.25795, lng: -123.05683 }
    ]
  },
  {
    name: "Renfrew",
    id: "11",
    bb: [
        { lat: 49.23441, lng: -123.05683 },
        { lat: 49.25795, lng: -123.02422 }
    ]
  },
  {
    name: "Kerrisdale",
    id: "12",
    bb: [
        { lat: 49.20324, lng: -123.17081 },
        { lat: 49.23441, lng: -123.14026 }
    ]
  },
  {
    name: "Oakridge",
    id: "13",
    bb: [
        { lat: 49.21872, lng: -123.14026 },
        { lat: 49.23441, lng: -123.10215 }
    ]
  },
  {
    name: "Marpole",
    id: "14",
    bb: [
        { lat: 49.19965, lng: -123.14026 },
        { lat: 49.21872, lng: -123.10215 }
    ]
  },
  {
    name: "Sunset",
    id: "15",
    bb: [
        { lat: 49.20324, lng: -123.10215 },
        { lat: 49.23441, lng: -123.07777 }
    ]
  },
  {
    name: "Victoria",
    id: "16",
    bb: [
        { lat: 49.20324, lng: -123.07777 },
        { lat: 49.23441, lng: -123.05511 }
    ]
  },
  {
    name: "Killarney",
    id: "17",
    bb: [
        { lat: 49.20324, lng: -123.05511 },
        { lat: 49.23441, lng: -123.02422 }
    ]
  },
  {
    name: "Stanley Park",
    id: "18",
    bb: [
        { lat: 49.29311, lng: -123.16017 },
        { lat: 49.31371, lng: -123.11794 }
    ]
  },
  {
    name: "West End",
    id: "19",
    bb: [
        { lat: 49.26982, lng: -123.14644 },
        { lat: 49.29311, lng: -123.12378 }
    ]
  },
  {
    name: "Business District",
    id: "20",
    bb: [
        { lat: 49.26982, lng: -123.12378 },
        { lat: 49.29311, lng: -123.10181 }
    ]
  },
  {
    name: "Downtown Eastside",
    id: "21",
    bb: [
        { lat: 49.26982, lng: -123.10181 },
        { lat: 49.28953, lng: -123.07777 }
    ]
  },
  {
    name: "Grandview",
    id: "22",
    bb: [
        { lat: 49.25795, lng: -123.07777 },
        { lat: 49.29334, lng: -123.05683 }
    ]
  },
  {
    name: "East Hastings",
    id: "23",
    bb: [
        { lat: 49.25795, lng: -123.05683 },
        { lat: 49.29334, lng: -123.02422 }
    ]
  }
];