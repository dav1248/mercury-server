/**
 * Module that connects to Accuweather API
 * More info at: http://apidev.accuweather.com/developers/
 * 
 */

const request = require('request');
const config = require('../config.json');


const historicalWeatherUrl = "https://api.darksky.net/forecast/" + config.DARKSKY_APIKEY + '/';
const darkskyOpts = "exclude=minutely, flags"; 




module.exports.getWeather = function(latitude, longitude, unixTime){

    var historicalWeatherOpts = latitude + ',' + longitude + ',' + unixTime;

    var weatherUrl = historicalWeatherUrl + historicalWeatherOpts + '?' + darkskyOpts;

    console.log(weatherUrl);
    
    request.get(weatherUrl, function(err, res, body){

        if(err){
            return console.dir(err);
        }
        console.dir(JSON.parse(body));

        //return JSON.parse(body);
    });
}

// example of full url request: https://api.darksky.net/forecast/70cbe88d3f585f979eac05fcc3dace4f/2.954385, -76.696018, 1511874900?exclude=minutely, flags



//var OWMlocationNumber = "3667772";
//var apiKey = "3ElDjWLt514RTeWLIMK2m3FzjYDo7HWW";
//var freeText = "cali, colombia";
//var locationUrl = "http://apidev.accuweather.com/locations/v1/search?q=" + freeText + "&apikey=" + apiKey;
//var locationNumber = "107948";
//var currentConditionsUrl = "http://apidev.accuweather.com/currentconditions/v1/"+ locationNumber + ".json?language=en&apikey=" + apiKey;
//var OWMForecastUrl = "api.openweathermap.org/data/2.5/forecast?id=" + OWMlocationNumber + "&APPID=" + OWMapiKey;


/*

module.exports.getForecastOWM = function(){

    console.log(OWMForecastUrl);

    request.get(OWMForecastUrl, function(err, res, body){

        if(err){
            return console.dir(err);
        }
        console.dir(JSON.parse(body));

    });
}


module.exports.getLoc = function(){

    console.log(locationUrl);

    request.get(locationUrl, function(err, res, body){

        if(err){
            return console.dir(err);
        }
        console.dir(JSON.parse(body));

    });
}
*/

/*
{
    "coord": {
        "lon": -74.83,
        "lat": 4.05
    },
    "weather": [
        {
            "id": 521,
            "main": "Rain",
            "description": "shower rain",
            "icon": "09d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 299.15,
        "pressure": 1018,
        "humidity": 74,
        "temp_min": 299.15,
        "temp_max": 299.15
    },
    "visibility": 10000,
    "wind": {
        "speed": 2.6,
        "deg": 250
    },
    "clouds": {
        "all": 75
    },
    "dt": 1543600800,
    "sys": {
        "type": 1,
        "id": 8573,
        "message": 0.0037,
        "country": "CO",
        "sunrise": 1543575068,
        "sunset": 1543617931
    },
    "id": 3667772,
    "name": "Suarez",
    "cod": 200
}







*/







/*
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