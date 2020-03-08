"use strict";

/**
* Run this on a raspberry pi 
* then browse (using google chrome/firefox) to http://[pi ip]:8080/
*/


const http    = require('http');
const express = require('express');


const WebStreamerServer = require('./lib/raspivid');
const ControlServer = require('./lib/_controller');

const app  = express();

  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));

const server  = http.createServer(app);
const silence = new WebStreamerServer(server);

const controlserver  = http.createServer(app);
const controller = new ControlServer(controlserver);

server.listen(8080);
controlserver.listen(8081);