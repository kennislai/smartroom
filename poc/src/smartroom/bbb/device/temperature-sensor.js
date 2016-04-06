//var PythonShell = require('python-shell');
var path = require("path");
var dht = require('beaglebone-dht');

var SENSOR_TYPE = "DHT22";
var MESSAGE_CHANNEL = 'message';
var MODULE_FUNC = {
  UPDATE_REFRESH_INTERVAL: 'UPDATE_REFRESH_INTERVAL',
  READ: 'READ'
};

module.exports = temperatureSensor;

function temperatureSensor(name, pin, socketio) {
  this.name = name;
  this.pin = pin;
  this.socketio = socketio;
  this.refreshInterval = 30000;
  this.refresh = null;

  this.connectMaster(this, this.socketio, this.name);
  this.collectTemperatureSensorData();

}

temperatureSensor.prototype.getName = function getName() {
  return this.name;
};

temperatureSensor.prototype.collectTemperatureSensorData = function collectTemperatureSensorData() {
  var self = this;
  self.refresh = setInterval(
    function() {
      getTemperatureAndHumidity(self);
    }, self.refreshInterval);
};

temperatureSensor.prototype.connectMaster = function connectMaster(self, masterIO, deviceName) {
  masterIO.on(MESSAGE_CHANNEL, function(data) {
    var jsonArray = JSON.parse(data);
    for (var i = 0; i < jsonArray.length; ++i) {
      var json = jsonArray[i];
      if (json.deviceName == deviceName && json.type == MODULE_FUNC.UPDATE_REFRESH_INTERVAL) {
        self.refreshInterval = json.value;
        console.log("Temperature Sensor Refresh Rate Updated to " + self.refreshInterval + " ms");
        clearInterval(self.refresh);
        self.refresh = setInterval(
          function() {
            getTemperatureAndHumidity(self);
          }, self.refreshInterval);
      } else if (json.deviceName == deviceName && json.type == MODULE_FUNC.READ) {
        getTemperatureAndHumidity(self);
      }
    }
  });
};

function getTemperatureAndHumidity(self) {

  
  /*var sensor = dht.sensor(SENSOR_TYPE);
  var results = dht.read(self.pin);

  if (results !== undefined && results !== null) {
    if (results.celsius !== null && results.humidity !== null) {
      var jsonObjs = [];
      var jsonObj = {
        type: "COMMAND",
        deviceType: "TEMPERATURE_SENSOR",
        deviceName: self.name,
        value: results.celsius.toFixed(1)
      };
      jsonObjs.push(jsonObj);

      jsonObj = {
        type: "COMMAND",
        deviceType: "HUMIDITY_SENSOR",
        deviceName: self.name,
        value: results.humidity.toFixed(1)
      };
      jsonObjs.push(jsonObj);
      self.socketio.emit('message', JSON.stringify(jsonObjs));
    }
  }*/
  
  var jsonObjs = [];
  var jsonObj = {
    type: "COMMAND",
    deviceType: "TEMPERATURE_SENSOR",
    deviceName: self.name,
    value: 22
  };
  jsonObjs.push(jsonObj);

  jsonObj = {
    type: "COMMAND",
    deviceType: "HUMIDITY_SENSOR",
    deviceName: self.name,
    value: 60
  };
  jsonObjs.push(jsonObj);

  self.socketio.emit('message', JSON.stringify(jsonObjs));
}
