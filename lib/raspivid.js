"use strict";

const util      = require('util');
const spawn     = require('child_process').spawn;
const merge     = require('mout/object/merge');

const Server    = require('./_server');


class RpiServer extends Server {

  constructor(server, opts) {
    super(server, merge({
      width: 960,
      height: 540,
      fps: 30,
    }, opts));
  }

  get_feed() {
    var msk = "raspivid -t 0 -o - -w %d -h %d -fps %d";
    var cmd = util.format(msk, this.options.width, this.options.height, this.options.fps);
    console.log(cmd);
    var streamer = spawn('raspivid', ['-t', '0', '-o', '-', '-w', this.options.width, '-h', this.options.height, '-fps', this.options.fps, '-pf', 'baseline', '-b', '2000000', '-rot', '0']);
    streamer.on("exit", function(code){
      console.log("Failure", code);
    });

    return streamer.stdout;
  }

};



module.exports = RpiServer;
