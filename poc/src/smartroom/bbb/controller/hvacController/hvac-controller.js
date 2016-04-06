var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  async = require('async');

var config = require('./config.json'),
  hvac = require('./../../device/hvac');

var masterio,
  bbbio,
  hvacList = [];

async.series([
    function(callback) {
      initialize();
      connectMaster();
      startSlave();
      callback();
    }
  ],
  // optional callback
  function(err, results) {});

function initialize() {
  console.log('initialize');
  for (var i = 0; i < config.devices.length; i++) {
    hvacList.push(new hvac(config.devices[i].name, config.devices[i].type, config.devices[i].device));
  }
}

function connectMaster() {
  masterio = require('socket.io-client')(config.server);

  masterio.on('connect', function(data) {
    console.log('Connected to Master:' + config.server);

    for (var i = 0; i < config.subscribe.length; i++) {
      masterio.emit('join', config.subscribe[i]);
    }
    //masterio.emit('message', JSON.stringify(getLatestHvacValue(null)));
    masterio.emit('refreshStatusFromState');
  });

  masterio.on('message', function(data) {
    console.log('Message from Master:' + data);
    var json = JSON.parse(data);

    for (var i = 0; i < json.length; i++) {
      if (json[i].type == "STARTUP") {
        masterio.emit('acknowledge', JSON.stringify(getLatestHvacValue(json[i].deviceName)));

      } else if (json[i].type == "COMMAND") {
        if (json[i].deviceType == 'TEMPERATURE_SENSOR') {
          for (var j = 0; j < hvacList.length; j++) {
            hvacList[j].processTemperatureSensorData(json[i]);
          }

        } else if (json[i].deviceType == 'HVAC') {
          var device = getHvacDevice(json[i].deviceName);
          if (device !== null) {
            if (json[i].deviceName.split('-')[1] == 'airCon') {
              device.setAirConPower(json[i].value);

            } else if (json[i].deviceName.split('-')[1] == 'heater') {
              device.setHeaterPower(json[i].value);

            } else if (json[i].deviceName.split('-')[1] == 'fan') {
              device.setFanPower(json[i].value);
            }
          }
        }

        bbbio.emit('message', JSON.stringify([json[i]]));
        masterio.emit('acknowledge', JSON.stringify([json[i]]));
      } else if (json[i].type == 'TEMPERATURE') {
        if (json[i].deviceType == 'HVAC') {
          var device = getHvacDevice(json[i].deviceName);
          if (device !== null) {
            if (json[i].deviceName.split('-')[1] == 'airCon') {
              device.setAirConValue(json[i].value);

            } else if (json[i].deviceName.split('-')[1] == 'heater') {
              device.setHeaterValue(json[i].value);

            } else if (json[i].deviceName.split('-')[1] == 'fan') {
              device.setFanValue(json[i].value);
            }
          }
        }
        
        bbbio.emit('message', JSON.stringify([json[i]]));
        masterio.emit('acknowledge', JSON.stringify([json[i]]));
      }
    }
  });
}

function getLatestHvacValue(deviceName) {
  var jsonObjs = [];

  for (var i = 0; i < hvacList.length; i++) {
    if (hvacList[i].getName() == deviceName || deviceName === null) {
      var jsonObj = {
        type: "COMMAND",
        deviceType: hvacList[i].getType(),
        deviceName: hvacList[i].getAirConName(),
        value: hvacList[i].getAirConPower()
      };
      jsonObjs.push(jsonObj);

      jsonObj = {
        type: "COMMAND",
        deviceType: hvacList[i].getType(),
        deviceName: hvacList[i].getHeaterName(),
        value: hvacList[i].getHeaterPower()
      };
      jsonObjs.push(jsonObj);

      jsonObj = {
        type: "COMMAND",
        deviceType: hvacList[i].getType(),
        deviceName: hvacList[i].getFanName(),
        value: hvacList[i].getFanPower()
      };
      jsonObjs.push(jsonObj);

      jsonObj = {
        type: "TEMPERATURE",
        deviceType: hvacList[i].getType(),
        deviceName: hvacList[i].getAirConName(),
        value: hvacList[i].getAirConValue()
      };
      jsonObjs.push(jsonObj);

      jsonObj = {
        type: "TEMPERATURE",
        deviceType: hvacList[i].getType(),
        deviceName: hvacList[i].getHeaterName(),
        value: hvacList[i].getHeaterValue()
      };
      jsonObjs.push(jsonObj);
    }
  }

  return jsonObjs;
}

function startSlave() {
  bbbio = require('socket.io')(server).listen(config.port);
  console.log('Start Slave with port:' + config.port);

  bbbio.on('connection', function(socket) {
    console.log('client connected:' + socket.request.connection.remoteAddress);

    socket.on('message', function(data) {
      console.log("Signal Received:" + data);
      var json = JSON.parse(data);

      for (var i = 0; i < json.length; i++) {
        if (json[i].type == 'STARTUP') {
          socket.emit('message', JSON.stringify(getLatestHvacValue(json[i].deviceName)));
        } else if (json[i].type == 'COMMAND') {
          var device = getHvacDevice(json[i].deviceName);
          if (device !== null) {
            if (json[i].deviceName.split('-')[1] == 'airCon') {
              console.log('Control Air Con');
              device.setAirConValue(json[i].value);

            } else if (json[i].deviceName.split('-')[1] == 'heater') {
              console.log('Control Heater');
              device.setHeaterValue(json[i].value);

            } else if (json[i].deviceName.split('-')[1] == 'fan') {
              console.log('Control Fan');
              device.setFanValue(json[i].value);
            }

            //socket.emit('message', JSON.stringify([json[i]]));
            bbbio.in('HVAC-CONTROLLER-UI').emit('message', JSON.stringify([json[i]]));
            masterio.emit('message', JSON.stringify([json[i]]));
          }
        }
      }
    });

    socket.on('disconnect', function() {
      console.log('client disconnected:' + socket.request.connection.remoteAddress);
    });
  });
}

function getHvacDevice(deviceName) {
  for (var i = 0; i < hvacList.length; i++) {
    if (hvacList[i].getName() == deviceName.split('-')[0]) {
      return hvacList[i];
    }
  }

  return null;
}
