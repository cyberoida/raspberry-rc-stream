"use strict";


const WebSocketServer = require('ws').Server;
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const nmea = require('@drivetech/node-nmea')
const port = new SerialPort('/dev/ttyAMA0', { baudRate: 115200 })

class _Telemetry {

  constructor(server) {
    this.wss = new WebSocketServer({ server: server, clientTracking: true });

    this.new_client = this.new_client.bind(this);
    this.wss.on('connection', this.new_client);
    port.write('AT+CGPS=1\r\n');
    console.log("Telemetry ready to go. (GPS UP, LTE var UP)");

  }


  gatherData() {
      port.write('AT+CSQ\r\n');
      port.write('AT+COPS?\r\n');
      port.write('AT+CGPSINFO\r\n');
      console.log('requested le data');
  }

  parseReply(datastring) {
    console.log(datastring);
    var splitted = datastring.split("\n");
    if(splitted[1].startsWith("+CSQ:")) {
      var signal=splitted[1].split(" ")[1].split(",")
      var signalPer=signal[0]*3+3
      var retText="Signal: " + signalPer + "%"
      return retText
    } else if(splitted[1].startsWith("+COPS:")) {
      var carrier=splitted[1].split(" ")[1].split(",")
      var retText="Carrier: " + carrier[2]
      return retText
    } else if(splitted[1].startsWith("+CGPSINFO:")) {
      var nmeadata=splitted[1].split(" ")[1]
      var gpsdata = nmea.parse(nmeadata)
      var retText="N" + gpsdata.loc.dmm.latitude + "E" + gpsdata.loc.dmm.longitude
      return retText
    } else {
      return "data error"
    }
  }

  /*calculateCoordinates(nmea) {
    var real = 
  }*/

  new_client(socket) {

    var self = this;
    console.log('new telemetry client connected. Starting to collect telemetry');
    var sendTel = true;
    socket.send("here come the data :D");
    setInterval(this.gatherData(), 1000);
    port.on('data', function (data) {
      var sockReply=self.parseReply(data.toString())
      socket.send(sockReply)
    })
    socket.on('close', function () {
      sendTel = false;
      console.log('telemetry client disconnected');
    });
  }

};
module.exports = _Telemetry;