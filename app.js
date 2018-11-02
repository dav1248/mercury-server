var express = require('express');
var mqtt = require('mqtt');
var app = express();
var path = require('path');
var url = require('url');
var http = require('http');
var assert = require('assert');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// mongoose init
mongoose.connect('mongodb://localhost:27017/test',function(err, res){
	if (err) {
			console.log('ERROR connecting to test database: ' + err);
	} else {
			console.log('Connected to test database');
	}
});
var Schema = mongoose.Schema; // defines how mongoose with write the data in the database
var userDataSchema = new Schema({
	title: {type: String, required: true},
	content: String,
	author: String
}, {collection: 'user-data'});  // javascript object defining the schema
var UserData = mongoose.model('UserData',userDataSchema); // instance of model, called document


var testdata1 = {
	"place": "moncul",
	"date" : "13.14.15",
	"time" : "17:15",
	"concentration" : "1000"
};

// server init
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json()); // support json encoded bodies

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.get('',function(req, res){
	res.render('index.ejs',{items:[]});	
	
});

app.get('/get-data', function(req, res, next){
	UserData.find()
		.then(function(doc){
			res.render('index.ejs',{items:doc});	
			console.log(doc);
	});	
	
});

app.post('/insert', function(req, res, next){
	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};
	
	var data = new UserData(item); // we can do this because item has same struct as schema
	data.save(); // stores it into the database
	
	
	res.redirect('/');
});

app.post('/update', function(req, res, next){

	
	var id = req.body.id;
	
	UserData.findById(id,function(err, doc){
		if (err){
			console.error('error, no entry found');
		}
		doc.title = req.body.title;
		doc.content = req.body.content;
		doc.author = req.body.author;
		doc.save();
	});
	
	res.redirect('/');
});

app.post('/delete', function(req, res, next){
	
	var id = req.body.id;
	
	UserData.findByIdAndRemove(id).exec(); // because not fetching any callback, need to exec

	res.redirect('/');
});


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


