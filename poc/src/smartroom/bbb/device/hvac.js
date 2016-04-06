var bone = require('bonescript');
var airConPin,
  heaterPin,
  fanPin,
  airConValue,
  heaterValue,
  fanValue,
  name,
  type,
  airConName,
  heaterName,
  fanName,
  airConPower,
  heaterPower,
  fanPower,
  airConOnOff,
  heaterOnOff,
  fanOnOff;

module.exports = hvac;

function hvac(name, type, device) {
  this.name = name;
  this.type = type;

  for (var i = 0; i < device.length; i++) {
    switch (device[i].type) {
      case "airCon":
        this.setAirConName(device[i].type);
        this.airConPin = device[i].pin;
        this.airConValue = 0;
        this.airConPower = 0;
        break;
      case "heater":
        this.setHeaterName(device[i].type);
        this.heaterPin = device[i].pin;
        this.heaterValue = 0;
        this.heaterPower = 0;
        break;
      case "fan":
        this.setFanName(device[i].type);
        this.fanPin = device[i].pin;
        this.fanValue = 0;
        this.fanPower = 0;
        break;
    }
  }
}

hvac.prototype.setAirConValue = function(value) {
  this.airConValue = parseInt(value);
}

hvac.prototype.getAirConValue = function() {
  return this.airConValue;
}

hvac.prototype.setHeaterValue = function(value) {
  this.heaterValue = parseInt(value);
}

hvac.prototype.getHeaterValue = function() {
  return this.heaterValue;
}

hvac.prototype.setFanValue = function(value) {
  this.fanValue = parseInt(value);
}

hvac.prototype.getFanValue = function() {
  return this.fanValue;
}

hvac.prototype.getName = function() {
  return this.name;
}

hvac.prototype.getType = function() {
  return this.type;
}

hvac.prototype.setAirConName = function(type) {
  this.airConName = this.name + '-' + type;
}

hvac.prototype.getAirConName = function() {
  return this.airConName;
}

hvac.prototype.setHeaterName = function(type) {
  this.heaterName = this.name + '-' + type;
}

hvac.prototype.getHeaterName = function() {
  return this.heaterName;
}

hvac.prototype.setFanName = function(type) {
  this.fanName = this.name + '-' + type;
}

hvac.prototype.getFanName = function() {
  return this.fanName;
}

hvac.prototype.getAirConPower = function() {
  return this.airConPower;
}

hvac.prototype.getHeaterPower = function() {
  return this.heaterPower;
}

hvac.prototype.getFanPower = function() {
  return this.fanPower;
}

hvac.prototype.setAirConPower = function(value) {
  this.airConPower = value;
  if (parseInt(value) == 0)
  {
    this.setAirConOnOff(0);
    this.setFanOnOff(0);
  }
}

hvac.prototype.setHeaterPower = function(value) {
  this.heaterPower = value;
  if (parseInt(value) == 0)
  {
    this.setHeaterOnOff(0);
    this.setFanOnOff(0);
  }
}

hvac.prototype.setFanPower = function(value) {
  this.fanPower = value;
  if (parseInt(value) == 0)
  {
    this.setFanOnOff(0);
  }
}

hvac.prototype.setHeaterOnOff = function(value) {
  this.heaterOnOff = value;
  bone.pinMode(this.heaterPin, bone.OUTPUT);
  bone.digitalWrite(this.heaterPin, value);
};

hvac.prototype.setFanOnOff = function(value) {
  this.fanOnOff = value;
  bone.pinMode(this.fanPin, bone.OUTPUT);
  bone.digitalWrite(this.fanPin, value);
};

hvac.prototype.setAirConOnOff = function(value) {
  this.airConOnOff = value;
  bone.pinMode(this.airConPin, bone.OUTPUT);
  bone.digitalWrite(this.airConPin, value);
};

hvac.prototype.processTemperatureSensorData = function(json) {
  if (parseFloat(json.value) >= parseFloat(this.getAirConValue()) && parseInt(this.airConPower) == 1 && parseInt(this.airConOnOff) == 0) {
    console.log('Turn on fan');
    this.setFanOnOff(1);
    console.log('Turn on air conditioner');
    this.setAirConOnOff(1);

  } else if (parseFloat(json.value) < parseFloat(this.getAirConValue()) && parseInt(this.airConPower) == 1 && parseInt(this.airConOnOff) == 1) {
    console.log('Turn off fan');
    this.setFanOnOff(0);
    console.log('Turn off air conditioner');
    this.setAirConOnOff(0);
  }

  if (parseFloat(json.value) <= parseFloat(this.getHeaterValue()) && parseInt(this.heaterPower) == 1 && parseInt(this.heaterOnOff) == 0) {
    console.log('Turn on fan');
    this.setFanOnOff(1);
    console.log('Turn on heater');
    this.setHeaterOnOff(1);

  } else if (parseFloat(json.value) > parseFloat(this.getHeaterValue()) && parseInt(this.heaterPower) == 1 && parseInt(this.heaterOnOff) == 1) {
    console.log('Turn off fan');
    this.setFanOnOff(0);
    console.log('Turn off heater');
    this.setHeaterOnOff(0);
  }
}
