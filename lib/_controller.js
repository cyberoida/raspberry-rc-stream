"use strict";


const WebSocketServer = require('ws').Server;

class _Controller {

  constructor(server) {
    this.port = port

    this.wss = new WebSocketServer({ server: server, clientTracking: true });

    this.new_client = this.new_client.bind(this);
    this.broadcast  = this.broadcast.bind(this);

    this.wss.on('connection', this.new_client);
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