var express = require('express');
var router = express.Router();
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



router.get('',function(req, res){
	res.render('index.ejs',{items:[]});	
});

router.get('/get-data', function(req, res, next){
	UserData.find()
		.then(function(doc){
			res.render('index.ejs',{items:doc});	
			console.log(doc);
	});	
	
});

router.post('/insert', function(req, res, next){
	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};
	
	var data = new UserData(item); // we can do this because item has same struct as schema
	data.save(); // stores it into the database
	
	
	res.redirect('/');
});

router.post('/update', function(req, res, next){

	
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

router.post('/delete', function(req, res, next){
	
	var id = req.body.id;
	
	UserData.findByIdAndRemove(id).exec(); // because not fetching any callback, need to exec

	res.redirect('/');
});



module.exports = router;
