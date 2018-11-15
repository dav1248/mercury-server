var io = require('socket.io').listen(server);


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
});


// MQTT handling
var mqtt = require('mqtt');
var options = {port: 12541, username: 'pyklkptk',password: 'ZU46noxaEg5Q'}
var client  = mqtt.connect('mqtt://m15.cloudmqtt.com',options)

client.on('connect', function () {
	console.log('server successfully connected to mqtt broker');
    client.subscribe('init');
})


client.on('message', function(topic, message){
	
	content = message.toString();

	
	switch (topic){
		case 'init':
			console.log('init message: ' + content);
			break;
		default:
			break;
	}
});

