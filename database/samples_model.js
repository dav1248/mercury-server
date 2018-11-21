/**
 * Mongoose model used for mercury samples
 *
 */ 

var mongoose = require('mongoose');

// mongoose init
mongoose.connect('mongodb://localhost:27017/mercury',function(err, res){
	if (err) {
			console.log('ERROR connecting to database: ' + err);
	} else {
			console.log('Connected to mercury database');
	}
});

var Schema = mongoose.Schema; // defines how mongoose with write the data in the database and which collection to use
var dataSchema = new Schema({
	place: String,
	date: {type: Date, default: Date.now()},
    time: {type: Date, default: Date.now()},
	concentration: {type: Number, required: true, min:0},
	batch: {type: Number, min:0}
}, {collection: 'samples-data'});  // javascript object defining the schema

var samplesData = mongoose.model('samplesData', dataSchema); // instance of model, called document

module.exports = samplesData;