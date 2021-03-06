"use strict";


const WebSocketServer = require('ws').Server;
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const nmea = require('@drivetech/node-nmea')
const port = new SerialPort('/dev/ttyAMA0', { baudRate: 115200 })
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

class _Telemetry {

  constructor(server) {
    this.wss = new WebSocketServer({ server: server, clientTracking: true });

    this.new_client = this.new_client.bind(this);
    this.wss.on('connection', this.new_client);
    port.write('AT+CGPS=1\r\n');
    port.write('ATE0\r\n'); //stops/starts echo
    console.log("Telemetry ready to go. (GPS UP, LTE var UP)");

  }


  gatherData() {
    port.write('AT+CSQ\r\n');
  }

  parseReply(datastring) {
    datastring = datastring.replace(/(\r\n|\n|\r)/gm, "");
    //console.log(datastring);
    try {
      if (datastring.startsWith("+CSQ:")) {
        var signal = datastring.split(" ")[1].split(",")
        var signalPer = signal[0] * 3 + 3
        var retText = "S" + signalPer
        port.write('AT+COPS?\r\n');
        return retText
      } else if (datastring.startsWith("+COPS:")) {
        var carrier = datastring.split(" ")[1].split(",")
        var retText = "C" + carrier[2]
        port.write('AT+CGPSINFO\r\n');
        return retText
      } else if (datastring.startsWith("+CGPSINFO:")) {
        var nmeadata = datastring.split(" ")[1]
        var gpsdata = nmea.parse(nmeadata)
        var retText = "N" + gpsdata.loc.dmm.latitude + ",E" + gpsdata.loc.dmm.longitude
        return retText
      } else {
        return "data error"
      }
    } catch (ex) {
      return "data exception:" + ex
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
    setInterval(this.gatherData, 1000);
    parser.on('data', function (data) {
      var sockReply = self.parseReply(data.toString())
      socket.send(sockReply)
    })
    socket.on('close', function () {
      sendTel = false;
      console.log('telemetry client disconnected');
    });
  }

};
module.exports = _Telemetry;