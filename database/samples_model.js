/**
 * Mongoose model used for mercury samples
 *
 */ 

var config = require('../config.json');
var mongoose = require('mongoose');

// mongoose init
mongoose.connect(config.MONGODB_ADDRESS + '/' + config.MONGODB_DATABASE,function(err, res){
	if (err) {
			console.log('ERROR connecting to database: ' + err);
	} else {
			console.log('Connected to ' + config.MONGODB_DATABASE + ' database');
	}
});

var Schema = mongoose.Schema; // defines how mongoose with write the data in the database and which collection to use
var samplesSchema = new Schema({

	place: {type: String, required: true}, // place of sampling
	gps: {type: [Number]}, // gps coordinates of the sampling place
	date: {type: Date, default: new Date()}, // date of measuring
	concentration: {type: Number, required: true, min:0}, // mercury concentration of sample
	batch: {type: Number, min:0}, // batch number
	ph: {type: Number, min:0, max: 14}, // ph of the mixed solution
	temperature: {type: Number}, // degrees, temperature when measuring
	meteo: {type: String}, // meteo on the day of sampling
	person: {type: String}, // person responsible for the measuring
	method: {type: String}, //method used for the measuring
	comments: {type: String}, //comments about measuring, sampling, etc.
	voltage: {type: Number}, // voltage of the spectro when measuring



}, {collection: 'samples-data'});  // javascript object defining the schema

var samplesData = mongoose.model('samplesData', samplesSchema); // instance of model, called document

module.exports = samplesData;