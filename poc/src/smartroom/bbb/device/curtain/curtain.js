#!/usr/bin/env node

const b = require('bonescript'),
  fs = require('fs');
var c_stateFile = './curtain.json';
var pins = require('./config.json');
var pinStates = {
  "up": {
    "state": 0
  },
  "down": {
    "state": 0
  }
};

var dn_pin = pins.dn_pin /* 'P9_25' */ ,
  up_pin = pins.up_pin /* 'P9_23' */ ;

var ON = 1,
  OFF = 0;

b.pinMode(dn_pin, b.OUTPUT);
b.pinMode(up_pin, b.OUTPUT);

module.exports = curtain;

//var curtain = function curtain(id) {
function curtain(id) {
  this.id = id;
}

curtain.prototype = {
  _do_up: function() { // open
    b.digitalWrite(up_pin, ON);
    pinStates.up.state = ON;
  },
  _do_dn: function() { // close
    b.digitalWrite(dn_pin, ON);
    pinStates.down.state = ON;
    console.log('dn: ' + pinStates.down.state);
  },
  up_stop: function() {
    b.digitalWrite(up_pin, OFF);
    pinStates.up.state = OFF;
    console.log('up: ' + pinStates.up.state);
  },
  dn_stop: function() {
    b.digitalWrite(dn_pin, OFF);
    pinStates.down.state = OFF;
    console.log('stop_dn: ' + pinStates.down.state);
    console.log('stop_up: ' + pinStates.up.state);
  },
  stop: function() {
    b.digitalWrite(dn_pin, OFF, this.up_stop);
    console.log("stop");
  },
  open: function() {
    b.digitalWrite(dn_pin, OFF, this._do_up);
    console.log("open");
  },
  close: function() {
    b.digitalWrite(up_pin, OFF, this._do_dn);
    console.log("close");
  },
  loadState: function() {
    var stateInfo = fs.readFileSync(c_stateFile);
    pinStates = JSON.parse(stateInfo);
  },
  saveState: function() {
    fs.writeFileSync(c_stateFile, JSON.stringify(pinStates, null, '\t'));
  },
  getState: function() {
    this.saveState();
    return JSON.stringify(pinStates);
      /*
         return setTimeout(function() {
                return JSON.stringify(pinStates)}, 3500);
      */
  }

};

/*
var c1 = new curtain('c1');
c1.open();
c1.saveState();
console.log(c1.getState());
*/
//var c2 = new cc('c2');
