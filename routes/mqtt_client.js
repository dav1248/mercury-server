/**
 * MQTT handling
 * 
 */

var config = require('../config.json');
var mqtt = require('mqtt');
var mongoose = require('mongoose');
var samplesData = require('../database/samples_model');



module.exports.connect = function(broker, options){

    if (!broker){
        broker = config.MQTT_BROKER;
    }
    if (!options){
        options = {
            port: config.MQTT_BROKER_PORT, 
            username: config.MQTT_CLIENT_USERNAME,
            password: config.MQTT_CLIENT_PASSWORD
        };
    }

    var client  = mqtt.connect(broker,options);

    
    client.on('connect', function () {
        console.log('server successfully connected to mqtt broker');
        client.subscribe('init');
        client.subscribe('data-stream');
    })

    client.on('message', function(topic, message){
        
        
        switch (topic){
            case 'init':
                console.log('init message: ' + message.toString());
                break;
            case 'data-stream':
                console.log('receiving data...');
                save_to_database(message);
                break;
            default:
                console.log('no handler for topic '+topic);
                break;
        }
    });

    // 
    function save_to_database(message){
        console.log(message.toString());
        item = JSON.parse(message);

        doc = new samplesData(item); // we can do this because item has same struct as schema
        
        // basic schema validation
        doc.validate(function(err){
            if(err){
                return err;
            }
        });

        // saving doc to database
        doc.save(function(err){
            if(err){
                return err;
            }
        });
        
    }


    return client;
}

