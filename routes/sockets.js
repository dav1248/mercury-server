/**
 * Websocket handling for outside communication and front-end.
 * 
 */


var socketio = require('socket.io');
var samplesData = require('../database/samples_model');


var testdata1 = {
	"place": "ici",
	"date": "12.10.18",
	"time": "19:08",
	"concentration": "200"
}

module.exports.listen = function(server){
	io = socketio.listen(server);


	// websocket front-end handling
	io.of('browser').on('connection',function(socket) {
		console.log('user accessing server content');
		
		socket.on('message',function(message){
			console.log('user says: ' + message);
		});
		
		socket.on('query_sys',function(){
			console.log('user queried data');
			//send data through socket
			socket.emit('data',testdata1);
		});
		
		socket.on('disconnect',function(){
				console.log('user disconnected');
		});
	});

	// websocket HTTP handling
	io.of('mercury').on('connection', function(socket) {
		console.log('raspi mercury server connected');
		
		socket.on('data-stream',function(data){
		});
	
	});



	return io;
}

