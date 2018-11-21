/**
 * Routes handling. 
 * 
 */


var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var date = require('date-and-time');
var csv = require('csv-express');
var samplesData = require('../database/samples_model');

var password = 'bionovo2018';



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

router.get('/exporttocsv', function(req, res, next) {

    var filename   = "mercury_samples.csv";

    var dataArray;

    samplesData.find().lean().exec({}, function(err, samples) {

        if (err){
			res.send(err);
		}
		
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(samples, true);
    });
});


router.post('/query-data', function(req, res, next){
	samplesData.find({'place': req.body.place, 'date': req.body.date})
		.then(function(doc){
			res.render('index',{items:doc});	
			console.log(doc);
	});	
});

router.post('/insert', function(req, res, next){
	var item = {
		place: req.body.place,
		date: date.parse(req.body.date, 'JJ/MM/YYYY') || Date.now(),
		concentration: req.body.concentration,
		batch: req.body.batch
	};

	var data = new samplesData(item); // we can do this because item has same struct as schema
	data.save(function(err){
		if(err){
			console.log(err);
		}
	}); // stores it into the database
	
	
	res.redirect('/');
});

router.post('/update', function(req, res, next){

	var id = req.body.id_up;
	
	samplesData.findById(id_up,function(err, doc){
		if (err){
			console.error('error, no entry found');
		}
		doc.place = req.body.place;
		doc.date = req.body.date;
		doc.concentration = req.body.concentration;
		doc.save();
	});
	
	res.redirect('/');
});

router.post('/delete-elem', function(req, res, next){
	
	var id = req.body.id_del;
	
	samplesData.findByIdAndRemove(id).exec(); // because not fetching any callback, need to exec

	res.redirect('/');
});

router.post('/delete-all', function(req, res, next){

	if (password === req.body.pass_del){
		samplesData.remove(function(err){
			if(err){
				console.log(err);
			}
		});
	}

	res.redirect('/');
});

module.exports = router;
