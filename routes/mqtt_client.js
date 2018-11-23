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
        broker = config.mqtt_broker;
    }
    if (!options){
        options = {
            port: config.mqtt_broker_port, 
            username: config.mqtt_client_username,
            password: config.mqtt_client_password
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

        data = new samplesData(item); // we can do this because item has same struct as schema
        
        data.validate(function(err){
            if(err){
                return err;
            }
        });

        data.save(function(err){
            if(err){
                return err;
            }
        });
        
    }


    return client;
}

