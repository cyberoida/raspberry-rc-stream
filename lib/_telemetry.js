"use strict";


const WebSocketServer = require('ws').Server;
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/ttyAMA0', { baudRate: 115200 })

class _Telemetry {

  constructor(server) {
    this.wss = new WebSocketServer({ server: server, clientTracking: true });

    this.new_client = this.new_client.bind(this);
    this.wss.on('connection', this.new_client);

    console.log("Telemetry ready to go. (GPS UP, LTE var UP)");
  }

  gatherData() {
      port.write('AT+CSQ\r\n');
      port.write('AT+COPS?\r\n');
      port.write('AT+CREG?\r\n');
  }

  new_client(socket) {

    var self = this;
    console.log('new telemetry client connected. Starting to collect telemetry');
    socket.send("here come the data :D");
    this.gatherData();
    port.on('data', function (data) {
      console.log('Data:', data)
    })
    socket.on('close', function () {
      console.log('telemetry client disconnected');
    });
  }

};
module.exports = _Telemetry;