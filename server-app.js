// Hook Socket.io into Express
var io = require('socket.io')('http://77.68.8.22:3001', { serveClient: false });

//io.listen(3001);

// Socket.io Communication
//var socket = require('./www/js/services/socket.js');
console.log("hey");
console.log(io);
io.sockets.on('connection', function () {
  console.log("hey");
});