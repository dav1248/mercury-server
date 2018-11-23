/**
 * Routes handling. 
 * 
 */

var config = require('../config.json');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var date = require('date-and-time');
var csv = require('csv-express');
var samplesData = require('../database/samples_model');

var password = config.database_password;
var last_db_query = [];

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


    samplesData.find().lean().exec(function(err, samples) {

        if (err){
			res.send(err);
		}

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(samples, true);
    });
});

router.get('/exporttocsv-selec', function(req, res, next) {

    var filename   = "mercury_samples_subset.csv";
	
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/csv');
	res.setHeader("Content-Disposition", 'attachment; filename='+filename);
	res.csv(last_db_query, true);

});


router.post('/query-data', function(req, res, next){

	var query = samplesData.find();

	if(req.body.place){
		query.where('place',req.body.place);
	}
	if(req.body.batch){
		query.where('batch',req.body.batch);
	}
	if(req.body.id){
		query.where('id',req.body.id);
	}
	if(req.body.date_from && req.body.date_to){
		query.where('date').gte(req.body.date).lte(req.body.date_to);
	}

	query.lean().exec(function(err, doc){
		if(err){
			console.log(err);
		}
		
		last_db_query = doc;
		res.render('index',{items:doc});	
	});	

	/*
	samplesData.find({'place': req.body.place, 'date': req.body.date, 'id': req.body.id,})
		.then(function(doc){
			res.render('index',{items:doc});	
			console.log(doc);
	});
	*/	
});

router.post('/insert', function(req, res, next){
	var item = {
		place: req.body.place,
		date: date.parse(req.body.date, 'JJ/MM/YYYY') || Date.now(),
		concentration: req.body.concentration,
		batch: req.body.batch
	};

	var data = new samplesData(item); // we can do this because item has same struct as schema: creates a document instance (mongoose document)
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
