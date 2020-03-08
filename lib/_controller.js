"use strict";


const WebSocketServer = require('ws').Server;
const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;

class _Controller {

  constructor(server) {
    this.wss = new WebSocketServer({ server: server, clientTracking: true });

    this.new_client = this.new_client.bind(this);
    this.broadcast  = this.broadcast.bind(this);

    this.wss.on('connection', this.new_client);

    var options = {
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 50,
        debug: false
    };

    this.pwm = new Pca9685Driver(options, function(err) {
        if (err) {
            console.error("Error initializing PCA9685");
            process.exit(-1);
        }
        console.log("Initialization done");
        pwm.setPulseRange(0, 1000, 2000, function() {
            if (err) {
                console.error("Error setting pulse range.");
            } else {
                console.log("Pulse range set.");
            }
        });
        pwm.setPulseLength(0, 1500);
        pwm.setDutyCycle(0, 0.50);
    });
  }


  steer(direction) {
    var buffer = new Buffer(2)
    buffer[0] = 0x53;
    buffer[1] = direction;
    //TODO: implement
  }

  gas(amount) {
    var buffer = new Buffer(2)
    buffer[0] = 0x41;
    buffer[1] = amount;
    //TODO: implement
  }

  reverse(amount) {
    var buffer = new Buffer(2)
    buffer[0] = 0x52;
    buffer[1] = amount;
    //TODO: implement
  }

  brake() {
    var buffer = new Buffer(2)
    buffer[0] = 0x42;
    buffer[1] = 0x00;
    //TODO: implement
  }

  emergency() {
    var buffer = new Buffer(2)
    buffer[0] = 0x45;
    buffer[1] = 0x00;
    //TODO: implement
  }

  broadcast(data) {
    this.wss.clients.forEach(function(socket) {

      socket.send('telemetry');
    });
  }

  new_client(socket) {

    var self = this;
    console.log('new telemetry client connected');

    socket.on("message", function(data){
      var cmd = "" + data, action = data.split(' ')[0];

      if(action.startsWith("S")) { //Steering action
        self.steer(parseInt(action.substring(1), 10))
      } else if(action.startsWith("A")) { //Accelerate
        self.gas(parseInt(action.substring(1), 10))
      } else if(action.startsWith("R")) { //Reverse
        self.reverse(parseInt(action.substring(1), 10))
      } else if(action.startsWith("B")) { //Brake
        self.brake(parseInt(action.substring(1), 10))
      } else if(action.startsWith("E")) { //Accelerate
        self.emergency(parseInt(action.substring(1), 10))
      }
    });

    socket.on('close', function() {
      console.log('client disconnected');
    });
  }

};
module.exports = _Controller;