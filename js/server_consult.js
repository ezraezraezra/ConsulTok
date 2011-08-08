/*
 * Project: ConsulTok
 * Description: E-commerce social shopping web app featuring the OpenTok & ShopSense APIs.
 * 
 * Author: Ezra Velazquez
 * Website: http://ezraezraezra.com
 * Date: July 2011
 * 
 */
var io = require('socket.io').listen(8001);

console.log("server on");

io.sockets.on('connection', function (socket) {
	socket.emit('values', {message: "connected to server" });
	
	socket.on('private_data', function (data) {
		socket.emit('public_data', { product : data });
		socket.broadcast.emit('public_data', {product : data });
	});
	
});