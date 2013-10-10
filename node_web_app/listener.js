var javaPort = 8080;
var sIOPort = 8081;
var javaServer = require('net').createServer();
var browserServer = require('socket.io').listen(sIOPort);

console.log('=====================================================');
console.log('JamesS237 Timetablr Node.js/Java Communication Module');
console.log('=====================================================');

console.log('Socket.IO version: ' + require('socket.io').version);

javaServer.on('listening', function () {
    console.log('Server is listening on ' + javaPort);
});

javaServer.on('error', function (e) {
    console.log('Server error: ' + e.code);
});

javaServer.on('close', function () {
    console.log('Server closed');
});

javaServer.on('connection', function (javaSocket) {
    var clientAddress = javaSocket.address().address + ':' + javaSocket.address().port;
    console.log('Java ' + clientAddress + ' connected');

    var firstDataListenner = function (data) {
            console.log('Received namespace from java: ' + data);
            console.log(data);
            javaSocket.removeListener('data', firstDataListenner);
            createNamespace(data, javaSocket);
    }

    javaSocket.on('data', firstDataListenner);

    javaSocket.on('close', function() {
            console.log('Java ' + clientAddress + ' disconnected');
    });
});

javaServer.listen(javaPort);

function createNamespace(namespaceName, javaSocket) {
    var browserConnectionListenner = function (browserSocket) {
            console.log('Browser Connected');
            var javaSocketDataListenner = function(data) {
                    console.log('Data received from java socket and sent to browser: ' + data);
                    browserSocket.emit('m', data + '\r\n');
            }

            var javaSocketClosedListenner = function() {
                    console.log('The java socket that was providing data has been closed, removing namespace');
                    browserSocket.disconnect();
                    browserServer.of('/' + namespaceName).removeListener('connection', browserConnectionListenner);
                    javaSocket.removeListener('data', javaSocketDataListenner);
                    javaSocket.removeListener('close', javaSocketClosedListenner);
            }

            javaSocket.on('close', javaSocketClosedListenner);
            javaSocket.on('data', javaSocketDataListenner);

            browserSocket.on('disconnect', function () {
                    console.log('Browser Disconnected');
                    javaSocket.removeListener('data', javaSocketDataListenner);
                    javaSocket.removeListener('close', javaSocketClosedListenner);
            });
    }

    var namespace = browserServer.of('/' + namespaceName).on('connection', browserConnectionListenner);
}