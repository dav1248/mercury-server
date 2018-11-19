// MQTT handling
var mqtt = require('mqtt');
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

    var options = {port: 12541, username: 'pyklkptk',password: 'ZU46noxaEg5Q'};

    client.on('connect', function () {
        console.log('server successfully connected to mqtt broker');
        client.subscribe('init');
    })


    client.on('message', function(topic, message){
        
        content = message.toString();

        
        switch (topic){
            case 'init':
                console.log('init message: ' + content);
                break;
            default:
                break;
        }
    });


    return client;
}

