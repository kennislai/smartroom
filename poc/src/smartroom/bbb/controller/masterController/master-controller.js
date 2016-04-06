var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  async = require('async');

var db = require('./../../../database/db-utility'),
  roomStatus = require('./../../utility/roomStatus'),
  config = require('./config.json');

var appserverio,
  bbbio;

var rs = new roomStatus();

async.series([
    function(callback) {
      connectApplicationServer();
      startServer();
      callback();
    }
  ],
  // optional callback
  function(err, results) {});

function sendMessageToBBBIO(jsonObjs) {
  bbbio.in('CURTAIN').emit('message', JSON.stringify(jsonObjs));
  bbbio.in('COURTESY').emit('message', JSON.stringify(jsonObjs));
  bbbio.in('LIGHTING').emit('message', JSON.stringify(jsonObjs));
  bbbio.in('HVAC').emit('message', JSON.stringify(jsonObjs));
  bbbio.in('TEMPERATURE').emit('message', JSON.stringify(jsonObjs));
  bbbio.in('MASTER-CONTROLLER-UI').emit('message', JSON.stringify(jsonObjs));
}

function sendMessageFromRoomState() {
  rs.createBBBMessageFromState(function(jsonObjs) {
    if (jsonObjs.length > 0) {
      sendMessageToBBBIO(jsonObjs);
    }
  });
}

function connectApplicationServer() {
  appserverio = require('socket.io-client')(config.applicationServer);

  appserverio.on('connect', function(data) {
    console.log('Connected to Application Server');
    appserverio.emit('join', config.room);
    //Get the latest roomConfig from AppServer
    appserverio.emit('getroomconfig', null);
    appserverio.emit('getroom', config.room);
  });

  appserverio.on('room', function(data) {
    var json = JSON.parse(data);
    rs.updateJSON(json[0], function() {
      sendMessageFromRoomState();
    });
  });

  appserverio.on('scene', function(sceneId) {
    sendActivateSceneMessage(sceneId);
  });

  appserverio.on('roomconfig', function(data) {
    var json = JSON.parse(data);
    db.setRoomConfig(json, function() {
      db.getRoomConfig(null, null, function(result) {
        bbbio.in('COURTESY').emit('roomconfig', JSON.stringify(result));
      });
    });
  });

  appserverio.on('weatherinfo', function(data) {
    var jsonArray = JSON.parse(data);
    for (var i in jsonArray) {
      json = jsonArray[i];
      var jsonObj = {
        type: 'WEATHERUPDATE',
        msgContent: {
          temperature: json.temperature,
          dayHigh: json.dayHigh,
          dayLow: json.dayLow,
          weather: json.weather
        }
      };
      bbbio.in('MASTER-CONTROLLER-UI').emit('message', JSON.stringify([jsonObj]));
    }
  });

  appserverio.on('wakeupcall', function(data) {
    var json = JSON.parse(data);
    var jsonObjs = [];
    jsonObjs.push(createInternalMessage("SERVICE", "SELFSERVICE", "WAKEUPCALL", JSON.stringify(json)));

    bbbio.in('MASTER-CONTROLLER-UI').emit('message', JSON.stringify(jsonObjs));
  });

  appserverio.on('roomservicemenu', function(data) {
    var json = JSON.parse(data);
    db.setRoomServiceMenu(json[0].menu, function() {
      db.getRoomServiceMenu(function(row){
        bbbio.in('MASTER-CONTROLLER-UI').emit('roomservicemenu', JSON.stringify([createInternalMessage("SERVICE", "SELFSERVICE", "ROOMSERVICEMENU", row)]));
      });
    });
  });

  appserverio.on('teatimemenu', function(data) {
    var json = JSON.parse(data);
    db.setTeaTimeMenu(json[0].menu, function() {
      db.getTeaTimeMenu(function(row){
        bbbio.in('MASTER-CONTROLLER-UI').emit('teatimemenu', JSON.stringify([createInternalMessage("SERVICE", "SELFSERVICE", "TEATIMEMENU", row)]));
      });
    });
  });
}

function startServer() {
  bbbio = require('socket.io')(server).listen(config.port);
  console.log('Start server with port:' + config.port);
  bbbio.on('connection', function(socket) {
    console.log('client connected:' + socket.request.connection.remoteAddress);

    socket.on('join', function(data) {
      console.log('client:' + socket.request.connection.remoteAddress +
        ' join channel:' + data);
      socket.join(data);
    });

    socket.on('refreshStatusFromState', function() {
      sendMessageFromRoomState();
    });

    socket.on('roomconfig', function(data) {
      db.getRoomConfig(null, null, function(result) {
        console.log('roomconfig:' + JSON.stringify(result));
        bbbio.in('COURTESY').emit('roomconfig', JSON.stringify(result));
      });
    });

    socket.on('acknowledge', function(data) {
      var json = JSON.parse(data);
      for (var i = 0; i < json.length; i++) {
        bbbio.in('MASTER-CONTROLLER-UI').emit('message', JSON.stringify([json[i]]));
        publishMessage(socket, json[i]);
        rs.updateStatus(json[i], function() {
          sendToManagmentSystem(json[i]);
        });
      }
    });

    socket.on('message', function(data) {
      //console.log("Signal Received:" + data);
      var json = JSON.parse(data);
      for (var i = 0; i < json.length; i++) {
        if (json[i].type == "INITIAL") {
          processInitialMsg(socket);
        } else if (json[i].type == "SETUP") {
          var jsonObj = {
            type: "UPDATE_TIMEOUT",
            deviceType: "MOTION_SENSOR_PIR",
            deviceName: json[i].deviceName,
            value: 1000
          };
          socket.emit('message', JSON.stringify([jsonObj]));
        } else if (json[i].type == "SCENE") {
          sendActivateSceneMessage(json[i].value);

        } else if (json[i].type == "SERVICE" && json[i].deviceType == "SELFSERVICE"){
          if (json[i].deviceName == "CHECKOUT"){
            socket.emit("checkout", "done");
            sendToManagmentSystem(json[i]);

          } else if (json[i].deviceName == "WAKEUPCALL"){
            if (json[i].value == "GET")
              appserverio.emit('getwakeupcall', config.room);
            else
              sendToManagmentSystem(json[i]);


          }else if (json[i].deviceName == "ROOMSERVICEMENU"){
            console.log( new Date().toJSON() + " - ROOMSERVICEMENU:" + data);
            db.getRoomServiceMenu(function(row){
              console.log(row);
              bbbio.in('MASTER-CONTROLLER-UI').emit('roomservicemenu', JSON.stringify([createInternalMessage("SERVICE", "SELFSERVICE", "ROOMSERVICEMENU", row)]));
            });

          }else if (json[i].deviceName == "TEATIMEMENU") {
            db.getTeaTimeMenu(function(row){
              bbbio.in('MASTER-CONTROLLER-UI').emit('teatimemenu', JSON.stringify([createInternalMessage("SERVICE", "SELFSERVICE", "TEATIMEMENU", row)]));
            });
          } else if (json[i].deviceName == "TEATIMEORDER"){
            socket.emit("teatimeorder", "done");
            sendToManagmentSystem(json[i]);
          }
        }else {
          publishMessage(socket, json[i]);
        }
      }
    });

    socket.on('disconnect', function() {
      console.log('client disconnected:' + socket.request.connection.remoteAddress);
    });
  });
}

function sendActivateSceneMessage(sceneId) {
  rs.createSceneBBBMessage(sceneId, function(jsonObjs) {
    sendMessageToBBBIO(jsonObjs);
  });
}

function publishMessage(socket, json) {
  for (var i = 0; i < config.channels.length; i++) {
    if (config.channels[i].deviceType == json.deviceType) {
      //console.log('Publish message to channel:' + config.channels[i].channel);
      socket.broadcast.in(config.channels[i].channel).emit('message', JSON.stringify([json]));
      break;
    }
  }
}

function processInitialMsg(socket) {
  var json = {
    type: "INITIAL",
    roomNumber: config.room
  };
  socket.emit('message', JSON.stringify([json]));
  appserverio.emit('getweatherinfo', '');
  //appserverio.emit('getroom', config.room);
}

function sendToManagmentSystem(jsonObj) {
  if (jsonObj.deviceType == 'TEMPERATURE_SENSOR' || jsonObj.deviceType == 'HUMIDITY_SENSOR') {
    rs.createTempJsonObjForAppServer(jsonObj.deviceType, function(json) {
      if (json !== null) {
        appserverio.emit('setroomtemp', JSON.stringify(json));
      }
    });
  } else if (jsonObj.deviceType == 'BLUETOOTH_BEACON_SENSOR') {
    rs.createNotifyJsonObjForAppServer(jsonObj, function(json) {
      appserverio.emit('notifyDeviceAlarm', JSON.stringify(json));
    });
  } else if (jsonObj.deviceName == 'WAKEUPCALL') {
    appserverio.emit('setwakeupcall', JSON.stringify(createWakeupCallJsonObjectForAppServer(config.room, jsonObj)));

  } else if (jsonObj.deviceName == 'CHECKOUT') {
    appserverio.emit('setselfcheckout', JSON.stringify(createCheckoutCallJsonObjectForAppServer(config.room, jsonObj)));

  } else if (jsonObj.deviceName == 'TEATIMEORDER') {
    appserverio.emit('setteatimeorder', JSON.stringify(createTeaTimeOrderJsonObjectForAppServer(config.room, jsonObj)));

  } else {
    rs.createJsonObjForAppServer(function(json) {
      appserverio.emit('notifyfromroom', JSON.stringify(json));
    });
  }
}

function createWakeupCallJsonObjectForAppServer(room, json) {
  var obj = JSON.parse(json.value);

  var jsonObj = {
    content: {
      rooms: [{
        room: room,
        power: obj.power,
        time: obj.time
      }]
    }
  };

  return jsonObj;
}

function createCheckoutCallJsonObjectForAppServer(room, json) {
  var obj = JSON.parse(json.value);

  var jsonObj = {
    content: {
      rooms: [{
        room: room,
        luggageservice : obj.luggageservice,
        taxiservice : obj.taxiservice
      }]
    }
  };

  return jsonObj;
}

function createTeaTimeOrderJsonObjectForAppServer(room, json){
  var json = {
    content: {
      rooms: [{
        room: room,
        teatime: json.value
      }]
    }
  };

  return json;
}

function createInternalMessage(type, deviceType, deviceName, value) {
  var jsonObj = {
    type: type,
    deviceType: deviceType,
    deviceName: deviceName,
    value: value
  };

  return jsonObj;
}
