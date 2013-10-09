$(function () {

  var socket = io.connect('http://localhost');
  socket.emit('join hashtagcloud');

  socket.on('hashtag tweet', function(data) {
    addNewTweet(data.data);
  });

  function addNewTweet(tweet) {
    $('div#content').append('<div class="tweetbox">' + tweet + '</div>');
  }
});