var bone = require('bonescript');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var DEVICE_TYPE = "BLUETOOTH_BEACON_SENSOR";
var MESSAGE_CHANNEL = 'message';
var MODULE_FUNC = {
  UPDATE_STATUS: 'UPDATE_STATUS'
};

module.exports = bluetooth;

function bluetooth(name, wakeUpPin, alarmPin, port, baudRate, refreshRate, trackingDevice,
  socketio) {
  this.name = name;
  this.port = port;
  this.baudRate = baudRate;
  this.wakeUpPin = wakeUpPin;
  this.alarmPin = alarmPin;
  this.socketio = socketio;

  bone.pinMode(alarmPin, bone.OUTPUT);
  bone.pinMode(wakeUpPin, bone.OUTPUT);
  bone.digitalWrite(wakeUpPin, 1);

  var sp = new SerialPort(port, {
    parser: serialport.parsers.readline("\n"),
    baudrate: baudRate
  });

  sp.on('error', function(error){
    console.log(error);
  });

  sp.on("open", function() {
    initModule(sp);
    sp.on('data', function(data) {
      if (data.indexOf("CMD") > -1) {
        //Wait for system reboot finish
        startScan(sp, refreshRate);
      } else {
        var lines = data.split("\n");
        for (var i1 in lines) {
          var items = lines[i1].split(",");
          for (var i2 in trackingDevice) {

            if (trackingDevice[i2].enable === true) {
              if (items[0] == trackingDevice[i2].macAddress) {
                var distance = calculateDistance(parseInt(
                  items[4], 16), trackingDevice[i2].txPower);

                if (distance <= trackingDevice[i2].range) {
                  sendMessage(socketio, MODULE_FUNC.UPDATE_STATUS,
                    trackingDevice[i2].name, 1, trackingDevice[i2].macAddress);
                    alarm(alarmPin, 0);
                } else {
                  sendMessage(socketio, MODULE_FUNC.UPDATE_STATUS,
                    trackingDevice[i2].name, 0, trackingDevice[i2].macAddress);
                    alarm(alarmPin, 1);
                }
              }
            }
          }
        }
      }
    });
  });

  var cleanup = require('./../utility/cleanup').Cleanup(function() {
    sp.close();
    bone.digitalWrite(wakeUpPin, 0);
    bone.digitalWrite(alarmPin, 0);
  });
}

function alarm(alarmPin, value){
  bone.digitalWrite(alarmPin, value);
}

function initModule(sp) {
  sp.write("SF,1\n"); //Reset Factory Setting
  sp.write("SR,80000000\n"); //Set Device as Central
  sp.write("SS,C0000000\n"); //Enable Device Information and Battery Services
  sp.write("R,1\n"); //Reboot
}

function startScan(sp, refreshRate) {
  setInterval(function() {
    sp.write("X\n");
    sp.write("F\n");
    sp.write("J,1\n");
  }, refreshRate);
}

function sendMessage(masterIO, type, deviceName, value, macAddress) {
  if (masterIO !== undefined && masterIO !== null) {
    var jsonObj = {
      type: type,
      deviceType: DEVICE_TYPE,
      deviceName: deviceName,
      value: value,
      macAddress: macAddress,
      dateTime: new Date()
    };
    masterIO.emit(MESSAGE_CHANNEL, JSON.stringify([jsonObj]));
    masterIO.emit('acknowledge', JSON.stringify([jsonObj]));
  }
}

function calculateDistance(rssi, txPower) {
  /*
   * RSSI = TxPower - 10 * n * lg(d)
   * n = 2 (in free space)
   *
   * d = 10 ^ ((TxPower - RSSI) / (10 * n))
   */
  return Math.pow(10, (txPower - rssi) / (10 * 2));
}
