var express = require('express');
var mqtt = require('mqtt');
var app = express();
var path = require('path');
var url = require('url');
var http = require('http');
var mongo = require('mongodb');
var assert = require('assert');

var url_db = 'mongodb://localhost:27017/test';

var testdata1 = {
	"place": "moncul",
	"date" : "13.14.15",
	"time" : "17:15",
	"concentration" : "1000"
};

// server init
app.get('',function(req, res){
		res.render('index.ejs',{items:[]});
});

app.get('/get-data', function(req, res, next){
	 
	 var resultArray = [];
	 mongo.connect(url_db,function(err, db){
		assert.equal(null,err);
		var cursor = db.collection('user-data').find();
		cursor.forEach(function(doc,err){
				assert(null,err);
				resultsArray.push(doc);
				
			
		},function(){ //rendering view once sure that we are done fetching data, hence callback after comma
				db.close();
				res.render('index.ejs',{items: resultArray});
		}); 
	 });
});

app.post('/insert', function(req, res, next){
	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};
	
	mongo.connect(url_db,function(err,db){
		assert.equal(null,err);
		db.collection('user-data').insertOne(item,function(err,res){
				assert.equal(null,err);
				console.log('Item inserted');
				db.close();
		});
	});
	
	//res.render('index.ejs',{items:[item]});
});

app.post('/update', function(req, res, next){
	
});

app.post('/delete', function(req, res, next){
	
});

app.use(express.static(path.join(__dirname,'public')));




var server = app.listen(8080,function(){
		console.log('server listening on port 8080');
});

var io = require('socket.io').listen(server);



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


