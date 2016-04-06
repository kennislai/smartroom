var bone = require('bonescript');

module.exports = light;

function light(name, type, pin) {
  this.name = name;
  this.type = type;
  this.pin = pin;
  this.power = 0;

  bone.pinMode(pin, bone.OUTPUT);
}

light.prototype.getName = function() {
  return this.name;
};

light.prototype.getType = function() {
  return this.type;
};

light.prototype.getPower = function() {
  return this.power;
};

light.prototype.setPower = function(value) {
  this.power = parseInt(value);
  lightOnOff(this.pin, this.power);
};

function lightOnOff(pin, value) {
  bone.digitalWrite(pin, value);
}
