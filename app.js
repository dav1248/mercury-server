/**
 * Express app
 * 
 */

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = require('./routes/index');

var express = require('express');
var mqtt = require('mqtt');
var app = express();
var path = require('path');
var url = require('url');
var assert = require('assert');
var bodyParser = require('body-parser');


// set view engine
app.set('view engine', 'ejs');

// server init
app.use(logger('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support url encoded bodies
app.use(cookieParser());

app.use('/',router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.render('error', {message: err.message});
  });
  
  module.exports = app;




