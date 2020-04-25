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
      });
    }
  }