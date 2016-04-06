var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  async = require('async');

var config = require('./config.json'),
  lighting = require('./../../device/lighting'),
  light = require('./../../device/light');

var masterio,
  bbbio,
  deviceList = [];

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
    var device = null;
    switch (config.devices[i].type) {
      case "LIGHTING":
        device = new lighting(config.devices[i].name, config.devices[i].type,
          config.devices[i].pin);
        break;

      case "LIGHT":
        device = new light(config.devices[i].name, config.devices[i].type,
          config.devices[i].pin);
        break;
    }
    if (device !== null) {
      deviceList.push(device);
    }
  }
}

function connectMaster() {
  masterio = require('socket.io-client')(config.server);

  masterio.on('connect', function(data) {
    console.log('Connected to Master:' + config.server);

    for (var i = 0; i < config.subscribe.length; i++) {
      masterio.emit('join', config.subscribe[i]);
    }
    //masterio.emit('message', JSON.stringify(getLatestLightingValue(null)));
    masterio.emit('refreshStatusFromState');
  });

  masterio.on('message', function(data) {
    console.log('Message from Master:' + data);
    var json = JSON.parse(data);
    messageEngine(json);
  });
}

function messageEngine(json) {
  for (var i = 0; i < json.length; i++) {
    if (json[i].deviceType == 'LIGHTING' || json[i].deviceType == 'LIGHT') {
      var device = getLightingDevice(json[i].deviceName);
      if (device !== null) {
        if (json[i].type == "STARTUP") {
          masterio.emit('acknowledge', JSON.stringify(getLatestLightingValue(json[i].deviceName)));
        } else {
          if (json[i].type == "COMMAND") {
            device.setPower(json[i].value);
          } else if (json[i].type == "DIMMING") {
            device.setDimming(json[i].value);
          }

          if (bbbio !== undefined) {
            bbbio.emit('message', JSON.stringify([json[i]]));
          }
          if (masterio !== undefined) {
            masterio.emit('acknowledge', JSON.stringify([json[i]]));
          }
        }
      }
    } else {
      ruleEngine(json[i], config);
    }
  }
}

function ruleEngine(json, config) {
  var rules = config.rules;
  if (rules !== null) {
    for (var i = 0; i < rules.length; i++) {
      if (JSON.stringify(json) === JSON.stringify(rules[i].trigger)) {
        //Pass the clone of the object to prevent modify of the object
        messageEngine([JSON.parse(JSON.stringify(rules[i].command))]);
      }
    }
  }
}

function getLatestLightingValue(deviceName) {
  var jsonObjs = [];
  for (var i = 0; i < deviceList.length; i++) {
    if (deviceList[i].getName() == deviceName || deviceName === null) {
      var jsonObj1 = {
        type: "COMMAND",
        deviceType: deviceList[i].getType(),
        deviceName: deviceList[i].getName(),
        value: deviceList[i].getPower()
      };
      jsonObjs.push(jsonObj1);

      if (deviceList[i].getType() == 'LIGHTING') {
        var jsonObj2 = {
          type: "DIMMING",
          deviceType: deviceList[i].getType(),
          deviceName: deviceList[i].getName(),
          value: deviceList[i].getDimming()
        };
        jsonObjs.push(jsonObj2);
      }
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
      messageEngine(json);
    });

    socket.on('disconnect', function() {
      console.log('client disconnected:' + socket.request.connection.remoteAddress);
    });
  });
}

function getLightingDevice(deviceName) {
  for (var i = 0; i < deviceList.length; i++) {
    if (deviceList[i].getName() == deviceName) {
      return deviceList[i];
    }
  }
  return null;
}
