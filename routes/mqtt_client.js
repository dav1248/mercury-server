/**
 * MQTT handling
 * 
 */

var mqtt = require('mqtt');
var mongoose = require('mongoose');
var samplesData = require('../database/samples_model');



var options = {port: 12541, username: 'pyklkptk',password: 'ZU46noxaEg5Q'};

module.exports.connect = function(broker, options){

    if (!broker){
        broker = 'mqtt://m15.cloudmqtt.com';
    }
    if (!options){
        options = {
            port: 12541, 
            username: 'pyklkptk',
            password: 'ZU46noxaEg5Q'
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

