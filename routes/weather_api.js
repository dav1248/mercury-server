/**
 * Module that connects to DarkSky Weather API
 * More info at: https://darksky.net/dev/docs
 * 
 */

const request = require('request');
const config = require('../config.json');



// hardcoded API endpoint
const historicalWeatherUrl = "https://api.darksky.net/forecast/" + config.DARKSKY_APIKEY + "/";
const darkskyOpts = "exclude=minutely, flags&units=si"; 



module.exports.getWeather = function(latitude, longitude, unixTime, callback){

    if (!latitude | !longitude){
        latitude = config.DEFAULT_WEATHER_LAT;
        longitude = config.DEFAULT_WEATHER_LONG;
    }

    var historicalWeatherOpts = latitude + ',' + longitude + ',' + unixTime;

    var weatherUrl = historicalWeatherUrl + historicalWeatherOpts + '?' + darkskyOpts;

    console.log(weatherUrl);
    
    var weather_info;

    request.get(weatherUrl, function(err, res, body){

        if(err){
            callback(err);
            console.dir(err);
        }
        
        weather_info = JSON.parse(body);

        callback(null, weather_info);
    
    });
}


// hardcoded getter
module.exports.getMeteo = function(weather_info){
    return weather_info.currently.summary;
}

// hardcoded getter
module.exports.getRain = function(weather_info){
    return weather_info.currently.precipIntensity;
}

// hardcoded getter
module.exports.getTemperature = function(weather_info){
    return weather_info.currently.temperature;
}










// example of full url request: https://api.darksky.net/forecast/70cbe88d3f585f979eac05fcc3dace4f/2.954385, -76.696018, 1511874900?exclude=minutely, flags

/* example of post request
var Request = require("request");

Request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://httpbin.org/post",
    "body": JSON.stringify({
        "firstname": "Nic",
        "lastname": "Raboy"
    })
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});
 */