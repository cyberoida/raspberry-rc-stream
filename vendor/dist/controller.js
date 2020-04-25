class Controller {
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
  
    Steer(amount) {
      var message = "S" + amount;
      this.ws.send(message);
    }
  
    Gas(amount) {
      var message = "A"+amount;
      this.ws.send(message);
    }
  
    /*Reverse(amount) {
      var message = "R"+amount;
      this.ws.send(message);
    }
  
    Brake() {
      var message = "B0";
      this.ws.send(message);
    }
    Emergency() {
      var message = "E0";
      this.ws.send(message);
    }*/ //legacy
  }