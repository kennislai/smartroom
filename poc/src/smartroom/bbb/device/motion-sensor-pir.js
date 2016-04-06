var b = require('bonescript');
var asyn = require('async');

var DEVICE_TYPE = "MOTION_SENSOR_PIR";
var MESSAGE_CHANNEL = 'message';
var MODULE_FUNC = {
  SETUP: 'SETUP',
  UPDATE_TIMEOUT: 'UPDATE_TIMEOUT',
  UPDATE_STATUS: 'UPDATE_STATUS',
  RESET_TIMER: 'RESET_TIMER'
};

module.exports = Sensor;

function Sensor(name, pin, socketio, timeout) {
  this.status = 0;
  this.name = name;
  this.timeOut = null;

  this.TIME_OUT_MS = 10000; //Default
  if (timeout !== undefined) {
    this.TIME_OUT_MS = timeout;
  }

  this.run(name, pin, socketio);
}

Sensor.prototype.getName = function getName() {
  return this.name;
};

Sensor.prototype.run = function run(deviceName, inputPin, masterIO) {
  var self = this;

  asyn.series([
      function(callback) {
        self.connectMaster(self, masterIO, deviceName);
        callback();
      },
      function(callback) {
        self.setup(masterIO, inputPin, deviceName);
        callback();
      }
    ],
    // optional callback
    function(err, results) {
      if (err) console.error(err.message);
    });
};

Sensor.prototype.connectMaster = function connectMaster(self, masterIO,
  deviceName) {
  //Update the no motion delay time from the app server when received the message
  masterIO.on(MESSAGE_CHANNEL, function(data) {
    var jsonArray = JSON.parse(data);
    for (var i = 0; i < jsonArray.length; ++i) {
      var json = jsonArray[i];

      if (json.deviceName == deviceName && json.type == MODULE_FUNC.UPDATE_TIMEOUT) {
        self.TIME_OUT_MS = json.value;
        console.log("No Motion Time Out Updated to " + self.TIME_OUT_MS +
          " ms");
      } else if (json.deviceName == deviceName && json.type ==
        MODULE_FUNC.RESET_TIMER) {
        clearTimeout(self.timeOut);
        console.log("Timer Reset");
      }
    }
  });
  //Notify server when device ready
  self.sendSignal(masterIO, MODULE_FUNC.SETUP, deviceName, 1);
};

Sensor.prototype.setup = function setup(masterIO, inputPIN, deviceName) {
  var self = this;
  b.pinMode(inputPIN, b.INPUT);
  b.attachInterrupt(inputPIN, true, b.CHANGE,
    function interruptCallback(x) {
      if (x.value !== undefined && self.status != x.value) {
        if (x.value === 1) {
          console.log(new Date().toISOString().replace(/T/, ' ').replace(
            /\..+/, '') + " " + deviceName + " Motion Detected");
          if (typeof masterIO !== 'undefined' && masterIO) {
            self.sendSignal(masterIO, MODULE_FUNC.UPDATE_STATUS,
              deviceName, 1);
            clearTimeout(self.timeOut);
          }
        } else if (x.value === 0) {
          console.log(new Date().toISOString().replace(/T/, ' ').replace(
            /\..+/, '') + " " + deviceName + " No Motion Detected");
          if (typeof masterIO !== 'undefined' && masterIO) {
            self.timeOut = setTimeout(self.sendSignal, self.TIME_OUT_MS,
              masterIO, MODULE_FUNC.UPDATE_STATUS, deviceName, 0);
          }
        }
        self.status = x.value;
      }
    });

  var cleanup = require('./../utility/cleanup').Cleanup(function() {
    self.myCleanup(inputPIN);
  });
};

Sensor.prototype.myCleanup = function myCleanup(inputPIN) {
  b.detachInterrupt(inputPIN);
};

Sensor.prototype.sendSignal = function sendSignal(masterIO, type,
  deviceName, value) {
  var jsonObj = {
    type: type,
    deviceType: DEVICE_TYPE,
    deviceName: deviceName,
    value: value
      //,timestamp: Math.floor(new Date() / 1000)
  };

  masterIO.emit(MESSAGE_CHANNEL, JSON.stringify([jsonObj]));
};
