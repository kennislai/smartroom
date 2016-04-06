var bone = require('bonescript');

var STATUS_MAX = 10;
var STATUS_MIN = 0;
var FREQ = 300;
var FACTOR = 0.9;

module.exports = lighting;

function lighting(name, type, pin) {
  this.name = name;
  this.type = type;
  this.pin = pin;
  this.dimming = 0;
  this.power = 0;
}

lighting.prototype.getName = function() {
  return this.name;
};

lighting.prototype.getType = function() {
  return this.type;
};

lighting.prototype.getPower = function() {
  return this.power;
};

lighting.prototype.getDimming = function() {
  return this.dimming;
};

lighting.prototype.setPower = function(value) {
  this.power = parseInt(value);
  lightOnOff(this.pin, this.dimming, this.power);
};

lighting.prototype.setDimming = function(value) {
  var newValue = parseInt(value);
  if (newValue <= STATUS_MAX && newValue > 0) {
    this.dimming = newValue;
  }
  lightOnOff(this.pin, this.dimming, this.power);
};

function lightOnOff(pin, dimming, power) {
  if (power == 1) {
    bone.analogWrite(pin, dimming / STATUS_MAX * FACTOR, FREQ);
  } else {
    bone.analogWrite(pin, 0);
  }
}
