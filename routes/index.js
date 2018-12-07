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
var weather_api = require('./weather_api');


var password = config.DATABASE_PASSWORD;
var last_db_query = [];

router.get('',function(req, res){
	res.render('index',{items:[]});	
});

router.get('/get-data', function(req, res, next){
	samplesData.find()
		.then(function(docs){
			res.render('index',{items:docs});	
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

		var from = date.parse(req.body.date_from, 'DD/MM/YYYY'); //TODO: catch error
		var to = date.parse(req.body.date_to, 'DD/MM/YYYY');
		query.where('date').gte(from).lte(to);
	}

	query.lean().exec(function(err, docs){
		if(err){
			console.log(err);
		}
		
		// info needed: concentration for each batch group
		// how presented: items with batch number and pairs concentration-date
		// Careful: only has to query data that is displayed.
		/*
		Member
		.findOne({ country_id: 10 })
		.sort('-score')  // give me the max
		.exec(function (err, member) {
	  
		  // your callback code
	  
		});

		var query2 = query
		.sort('-batch')
		.limit(1)
		.exec( function(err, docs){

			var maxBatch = docs[0].batch;

			console.log(maxBatch);


			for(i=1;i<maxBatch;i++){
				var query2 = samplesData.find();
	
	
			}







		})
		
		*/
		

		/*
		for(i=1;i<maxBatch;i++){
			var query2 = samplesData.find();


		}

		*/







		last_db_query = docs;
		res.render('index',{items:docs});	
	});	
});

router.post('/insert', function(req, res, next){
	var item = {
		place: req.body.place,
		date: date.parse(req.body.date, 'DD/MM/YYYY') || new Date(),
		concentration: req.body.concentration,
		batch: req.body.batch,
		
	};

	weather_api.getWeather(item.latitude, item.longitude, Math.round(item.date.getTime() / 1000), function(err, res){

		item.meteo = weather_api.getMeteo(res);
		item.rain = weather_api.getRain(res);
		item.temperature = Math.round(weather_api.getTemperature(res)*10)/10;


		var data = new samplesData(item); // we can do this because item has same struct as schema: creates a document instance (mongoose document)


		data.save(function(err){
			if(err){
				console.log(err);
			}
			console.log('Document saved:' + data);
		}); // stores it into the database

	});


	
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

router.get('/get-weather',function(req,res,next){

	var latitude = '2.954385';
	var longitude = '-76.696018';
	var unixTime = '1511874900';
	
	weather_api.getWeather(latitude, longitude, unixTime);
	
	res.redirect('/');
});

module.exports = router;
