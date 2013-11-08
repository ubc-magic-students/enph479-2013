$(function () {
	var socket = io.connect('http://localhost');
	socket.emit('join eventDetection');

	socket.on('new tweet', function(data) {
		$('body').append('<div>' + data.data + '</div>');
	});
});