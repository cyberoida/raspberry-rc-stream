class Telemetry {
  constructor(url) {
    this.url = url;

    console.log("Trying to Connect");
    // Websocket initialization
    if (this.ws != undefined) {
      this.ws.close();
      delete this.ws;
    }
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";


    this.ws.onopen = () => {
      console.log("Connected to " + url);
    };

    this.ws.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);

      if (event.data.startsWith("S")) {
        var signal = parseInt(event.data.substring(1))
        document.getElementById('signal').innerHTML = signal + "%";
      } else if (event.data.startsWith("C")) {
        var carrier = event.data.substring(1)
        document.getElementById('networkName').innerHTML = carrier;
        document.getElementById('conn').innerHTML = "OK";
      } else if (event.data.startsWith("N")) {
        var gpslat = event.data.split(',')[0];
        var gpslon = event.data.split(',')[1];
        document.getElementById('gpslat').innerHTML = gpslat.substring(1);
        document.getElementById('gpslon').innerHTML = gpslon.substring(1);
      }

    });
  }
}