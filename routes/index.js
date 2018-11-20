var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');



// mongoose init
mongoose.connect('mongodb://localhost:27017/mercury',function(err, res){
	if (err) {
			console.log('ERROR connecting to test database: ' + err);
	} else {
			console.log('Connected to mercury database');
	}
});
var Schema = mongoose.Schema; // defines how mongoose with write the data in the database and which collection to use
var dataSchema = new Schema({
	place: String,
	date: {type: String, required: true},
	time: {type: String, required: true},
	concentration: {type: String, required: true}
}, {collection: 'samples-data'});  // javascript object defining the schema
var samplesData = mongoose.model('samplesData',dataSchema); // instance of model, called document


var testdata1 = {
	"place": "moncul",
	"date" : "13.14.15",
	"time" : "17:15",
	"concentration" : "1000"
};



router.get('',function(req, res){
	res.render('index',{items:[]});	
});

router.get('/get-data', function(req, res, next){
	samplesData.find()
		.then(function(doc){
			res.render('index',{items:doc});	
			console.log(doc);
	});	
	
});

router.post('/insert', function(req, res, next){
	var item = {
		place: req.body.place,
		date: req.body.date,
		time: req.body.time,
		concentration: req.body.concentration
	};
	var data = new samplesData(item); // we can do this because item has same struct as schema
	data.save(); // stores it into the database
	
	
	res.redirect('/get-data');
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
