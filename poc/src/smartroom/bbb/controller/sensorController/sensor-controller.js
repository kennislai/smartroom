var asyn = require('async');

var config = require('./config.json'),
  temperatureSensor = require('./../../device/temperature-sensor'),
  motionSensorPIR = require('./../../device/motion-sensor-pir'),
  bluetoothBeaconSensor = require('./../../device/bluetooth-beacon'),
  speakupSensor = require('./../../device/speakup');

asyn.waterfall([
    function(callback) {
      var masterio = connectMaster();
      callback(null, masterio);
    },
    function(masterio, callback) {
      initialize(masterio);
      callback(null);
    }
  ],
  // optional callback
  function(err, results) {
    console.log(err);
  }
);

function connectMaster() {
  var masterio = require('socket.io-client')(config.server);
  masterio.on('connect', function(data) {
    console.log('Connected to Master:' + config.server);
    for (var i = 0; i < config.subscribe.length; i++) {
      masterio.emit('join', config.subscribe[i]);
    }
  });
  return masterio;
}

function initialize(masterio) {
  console.log('initialize');
  for (var i = 0; i < config.devices.length; i++) {
    switch (config.devices[i].type) {
      case "TEMPERATURE_SENSOR":
        var sensor = new temperatureSensor(
          config.devices[i].name,
          config.devices[i].pin,
          masterio
        );
        break;

      case "MOTION_SENSOR_PIR":
        var sensorPIR = new motionSensorPIR(
          config.devices[i].name,
          config.devices[i].pin,
          masterio,
          config.devices[i].noMotionTimeoutMS
        );
        break;

      case "BLUETOOTH_BEACON_SENSOR":
        var ble = new bluetoothBeaconSensor(
          config.devices[i].name,
          config.devices[i].wakeUpPin,
          config.devices[i].alarmPin,
          config.devices[i].port,
          config.devices[i].baudRate,
          config.devices[i].refreshRate,
          config.devices[i].trackingDevices,
          masterio
        );
        break;

      case "SPEAKUP_SENSOR":
        var speakup = new speakupSensor(
          config.devices[i].type,
          config.devices[i].name,
          config.devices[i].port,
          config.devices[i].baudRate,
          config.devices[i].commands,
          masterio
        );
        break;
    }
  }
}
