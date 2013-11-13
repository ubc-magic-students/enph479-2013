// The SocketManager object manages socket data transfers
function SocketManager() {
  mediator.installTo(this);

  this.socket = io.connect('http://localhost');

  this.subscribe(EVENTS.INITIALIZE, function() {
    
    this.socket.on(SOCKET_EVENTS.REGION_UPDATE, function(data) {
      data = $.parseJSON(data.data)
      mediator.publish(EVENTS.REGION_UPDATE, data);
    });

    this.socket.on(SOCKET_EVENTS.TWEET_UPDATE, function(data) {
      mediator.publish(EVENTS.TWEET_UPDATE, data.data);
    });

    this.subscribe(EVENTS.CALL_FOR_TIMEPLAY, function() {
      this.socket.emit(SOCKET_EVENTS.TIMEPLAY_REQUEST);
    });

    this.socket.on(SOCKET_EVENTS.TIMEPLAY_RESPONSE, function(data) {
      mediator.publish(EVENTS.INITIALIZE_TIMEPLAY, data.data);
    });
  });
}