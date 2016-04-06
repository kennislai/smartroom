var monitorPort = 8088;

var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  monitorio = require('socket.io')(server);

var roomController = require('./roomController'),
  roomSceneController = require('./roomSceneController'),
  roomDefaultSettingController = require('./roomDefaultSettingController'),
  roomConfigController = require('./roomConfigController'),
  weatherController = require('./weatherController'),
  sensorController = require('./sensorController'),
  menuController = require('./menuController'),
  bookingController = require('./bookingController'),
  deviceAlarmController = require('./deviceAlarmController'),
  wakeupCallController = require('./wakeupCallController'),
  checkoutController = require('./checkoutController'),
  webserver = require('./webserver');

deviceAlarmController = new deviceAlarmController();
roomSceneController = new roomSceneController();
roomController = new roomController();
roomDefaultSettingController = new roomDefaultSettingController();
roomConfigController = new roomConfigController();
weatherController = new weatherController();
sensorController = new sensorController();
menuController = new menuController();
bookingController = new bookingController();
wakeupCallController = new wakeupCallController();
checkoutController = new checkoutController();
webserver = new webserver(monitorPort, express, app, server);

server.listen(monitorPort);
console.log("Web server running at port " + monitorPort);

monitorio.on('connection', function(socket) {
  socket.join();

  console.log('client connected:' + socket.request.connection.remoteAddress);

  socket.on('join', function(data) {
    console.log('Client ' + socket.request.connection.remoteAddress + " join " + data);
    socket.join(data);
  });

  /****************Room Scene********************/
  socket.on('getRoomScenes', function() {
    roomSceneController.getRoomScenes(function(results) {
      socket.emit('roomAllScenes', JSON.stringify(results));
    });
  });

  socket.on('getRoomAvailableScenesByRoomId', function(Id) {
    roomSceneController.getRoomAvailableScenesByRoomId(Id, function(results) {
      socket.emit('roomAvailableScene', JSON.stringify(results));
    });
  });

  socket.on('getRoomScenesByRoomId', function(roomId) {
    roomSceneController.getRoomScenesByRoomId(roomId, function(results) {
      socket.emit('roomAssignedScenes', JSON.stringify(results));
    });
  });

  socket.on('getRoomSceneById', function(Id) {
    console.log(Id);
    roomSceneController.getRoomSceneById(Id, function(results) {
      socket.emit('roomScene', JSON.stringify(results));
    });
  });

  socket.on('updateRoomScene', function(data) {
    var json = JSON.parse(data);
    roomSceneController.updateRoomScene(json, function(json) {
      socket.emit('updateResult', json);
      refreshRoomState({
        content: {
          rooms: [{
            room: '101'
          }]
        }
      });
    });
  });

  socket.on('createRoomScene', function() {
    roomSceneController.createRoomScene(function(results) {
      socket.emit('newRoomScene', JSON.stringify(results));
      refreshRoomState({
        content: {
          rooms: [{
            room: '101'
          }]
        }
      });
    });
  });

  socket.on('deleteRoomScene', function(sceneId) {
    roomSceneController.deleteRoomScene(sceneId, function() {
      socket.emit('updateResult');
      refreshRoomState({
        content: {
          rooms: [{
            room: '101'
          }]
        }
      });
    });
  });

  socket.on('removeRoomScene', function(data) {
    var json = JSON.parse(data);
    roomSceneController.removeRoomScene(json.sceneId, json.roomId, function() {
      socket.emit('updateResult');
      refreshRoomState({
        content: {
          rooms: [{
            room: json.roomId
          }]
        }
      });
    });
  });

  socket.on('addRoomScene', function(data) {
    var json = JSON.parse(data);
    roomSceneController.addRoomScene(json, function() {
      socket.emit('updateResult');
      refreshRoomState({
        content: {
          rooms: [{
            room: json.roomId
          }]
        }
      });
    });
  });

  socket.on('runRoomScene', function(data) {
    var json = JSON.parse(data);
    monitorio.in(json.roomId).emit('scene', json.sceneId);
  });

  /****************Room Scene********************/

  /****************Device Alarm********************/

  socket.on('notifyDeviceAlarm', function(json) {
    var jsonObj = JSON.parse(json);
    deviceAlarmController.updateDeviceAlarm(jsonObj, function() {
      deviceAlarmController.getDeviceAlarm(function(result) {
        monitorio.in('monitor').emit('deviceAlarm', JSON.stringify(result));
      });
    });
  });

  socket.on('getDeviceAlarm', function() {
    deviceAlarmController.getDeviceAlarm(function(result) {
      socket.emit('deviceAlarm', JSON.stringify(result));
    });
  });

  socket.on('deleteAllDeviceAlarm', function() {
    deviceAlarmController.deleteAllDeviceAlarm(function(result) {
      monitorio.in('monitor').emit('deviceAlarm', JSON.stringify({}));
    });
  });

  /****************Device Alarm********************/

  socket.on('getroom', function(roomId) {
    roomController.getRoomState(roomId, function(roomResults) {
      roomSceneController.getRoomScenesByRoomId(roomId, function(sceneResults) {
        roomResults[0].scenes = sceneResults;
        socket.emit('room', JSON.stringify(roomResults));
      });
    });
  });

  socket.on('getallroom', function(data) {
    roomController.getAllRoomState(function(results) {
      socket.emit('allroom', JSON.stringify(results));
    });
  });

  socket.on('getroomconfig', function(data) {
    if (data == null) {
      roomConfigController.getAllRoomConfig(function(results) {
        socket.emit('roomconfig', JSON.stringify(results));
      });
    } else {
      roomConfigController.getRoomConfig(JSON.parse(data), function(doc) {
        socket.emit('roomconfig', JSON.stringify(doc));
      });
    }
  });

  socket.on('setroomconfig', function(data) {
    var json = JSON.parse(data);

    roomConfigController.setRoomConfig(json, function() {
      socket.emit('updateResult', 'Done');

      roomConfigController.getRoomConfig(json, function(doc) {
        monitorio.emit('roomconfig', JSON.stringify(doc));
      });
    });
  });

  socket.on('setroomstate', function(data) {
    var json = JSON.parse(data);

    roomController.updateRoomState(json, function() {
      socket.emit('updateResult', 'Done');

      refreshMonitorUi();
      refreshRoomState(json);
    });
  });

  socket.on('resetroomstate', function(data) {
    var json = JSON.parse(data);

    roomDefaultSettingController.resetRoomState(json, function() {
      socket.emit('updateResult', 'Done');

      refreshMonitorUi();
      refreshRoomState(json);
    });
  });

  socket.on('setroomservicelaunchandsuspendstate', function(data) {
    var json = JSON.parse(data);

    roomController.launchAndSuspendRoomState(json, function() {
      socket.emit('updateResult', 'Done');

      refreshMonitorUi();
      refreshRoomState(json);
    });

    roomDefaultSettingController.launchAndSuspendRoomDefaultSetting(json);
  });

  socket.on('setroomservicestate', function(data) {
    var json = JSON.parse(data);

    roomController.updateRoomState(json, function() {
      socket.emit('updateResult', 'Done');

      refreshMonitorUi();
      refreshRoomState(json);
    });
  });

  socket.on('setroomdefaultsetting', function(data) {
    var json = JSON.parse(data);

    roomDefaultSettingController.updateRoomDefaultSetting(json, function() {
      socket.emit('updateResult', 'Done');
    });
  });

  socket.on('getroomdefaultsetting', function(data) {
    var json = JSON.parse(data);

    roomDefaultSettingController.getRoomDefaultSetting(data, function(results) {
      socket.emit('roomdefaultsetting', JSON.stringify(results));
    });
  });

  socket.on('getweatherinfo', function(data) {
    weatherController.getWeatherInfo(function(results) {
      socket.emit('weatherinfo', JSON.stringify(results));
    });
  });

  socket.on('setweatherinfo', function(data) {
    var json = JSON.parse(data);

    weatherController.setWeatherInfo(json, function() {
      socket.emit('updateResult', 'Done');

      weatherController.getWeatherInfo(function(results) {
        monitorio.emit('weatherinfo', JSON.stringify(results));
      });
    });
  });

  socket.on('setroomtemp', function(data) {
    var json = JSON.parse(data);

    if (json.content.rooms[0].type == 'TEMPERATURE_SENSOR') {
      sensorController.setTemperature(json, function() {
        refreshMonitorUi();
      });
    } else if (json.content.rooms[0].type == 'HUMIDITY_SENSOR') {
      sensorController.setHumidity(json, function() {
        refreshMonitorUi();
      });
    }
  });

  socket.on('getroomserviceallmenu', function(data) {
    menuController.getAllRoomServiceMenu(function(results) {
      monitorio.in('monitor').emit('roomserviceallmenu', JSON.stringify(results));
    });
  });

  socket.on('deleteroomservicemenu', function(data) {
    var json = JSON.parse(data);
    menuController.deleteRoomServiceMenu(json, function() {
      socket.emit('deleteroomservicemenu', JSON.stringify(json + " is deleted"));

      menuController.getAllRoomServiceMenu(function(results) {
        monitorio.in('monitor').emit('roomserviceallmenu', JSON.stringify(results));
      });
    });
  });

  socket.on('publishroomservicemenu', function(data) {
    var json = JSON.parse(data);

    menuController.getRoomServiceMenu(json, function(results) {
      monitorio.emit('roomservicemenu', JSON.stringify(results));
      socket.emit('publishroomservicemenu', JSON.stringify(json + " is published"));
    });
  });

  socket.on('getteatimeallmenu', function(data) {
    menuController.getAllTeaTimeMenu(function(results) {
      monitorio.in('monitor').emit('teatimeallmenu', JSON.stringify(results));
    });
  });

  socket.on('deleteteatimemenu', function(data) {
    var json = JSON.parse(data);
    menuController.deleteTeaTimeMenu(json, function() {
      socket.emit('deleteteatimemenu', JSON.stringify(json + " is deleted"));

      menuController.getAllTeaTimeMenu(function(results) {
        monitorio.in('monitor').emit('teatimeallmenu', JSON.stringify(results));
      });
    });
  });

  socket.on('publishteatimemenu', function(data) {
    var json = JSON.parse(data);

    menuController.getTeaTimeMenu(json, function(results) {
      monitorio.emit('teatimemenu', JSON.stringify(results));
      socket.emit('publishteatimemenu', JSON.stringify(json + " is published"));
    });
  });

  socket.on('onlineCheckInMessage', function(data) {
    var json = JSON.parse(data);
    console.log('onlineCheckInMessage:' + data);

    if (json.func == 'search') {
      bookingController.getBooking(json, function(results) {
        socket.emit('message', JSON.stringify(createJsonObject(json.func, results)));
      });
    } else if (json.func == 'submit') {
      bookingController.onlineCheckin(json, function() {
        bookingController.getBooking(json, function(results) {
          socket.emit('message', JSON.stringify(createJsonObject(json.func, results)));
        });
      });
    }
  });

  socket.on('selfCheckInMessage', function(data) {
    var json = JSON.parse(data);
    console.log('selfCheckInMessage:' + data);

    if (json.func == 'confirm') {
      bookingController.getBooking(json, function(results) {
        bookingController.getRoom(results[0], 'READY', function(roomResults) {
          if (roomResults.length > 0) {
            bookingController.setRoom(roomResults[0], 'CHECKIN', function() {
              bookingController.selfCheckin(json, roomResults[0]._id, function() {
                socket.emit('message', JSON.stringify(createJsonObject(json.func, roomResults[0]._id)));
              });
            });
          } else {
            socket.emit('message', JSON.stringify(createJsonObject(json.func, '')));
          }
        })
      });
    }
  });

  socket.on('notifyfromroom', function(data) {
    var json = JSON.parse(data);

    roomController.updateRoomState(json, function() {
      refreshMonitorUi();
    });
  });

  socket.on('getwakeupcall', function(data){
    wakeupCallController.getWakeupCall(data, function(results){
      socket.emit('wakeupcall', JSON.stringify(results));
    });
  });

  socket.on('setwakeupcall', function(data){
    var json = JSON.parse(data);
    console.log(data);
    wakeupCallController.setWakeupCall(json, function(){
      socket.emit('updateResult','Done');

      refreshMonitorUi();
      refreshRoomWakeupCall(json);
    });
  });

  socket.on('getselfcheckout', function(data){
    checkoutController.getSelfCheckout(data, function(results){
      socket.emit('selfcheckout', JSON.stringify(results));
    });
  });

  socket.on('deleteselfcheckout', function(data){
    checkoutController.deleteSelfCheckout(data, function(){
      checkoutController.getSelfCheckout(data, function(results){
        monitorio.in('monitor').emit('selfcheckout', JSON.stringify(results));
        checkoutController.getSelfCheckout(null, function(results){
          monitorio.in('monitor').emit('selfcheckout', JSON.stringify(results));
        });
      });
    });
  });

  socket.on('setselfcheckout', function(data){
    var json = JSON.parse(data);
    console.log(data);
    
    checkoutController.setSelfCheckout(json, function(){
      var jsonObj = {
        content: {
          rooms: [{
            room: json.content.rooms[0].room,
            state: 'CHECKOUT',
            selfservice : [{
              service: 'checkout',
              state: 'DISABLED'
            }]
          }]
        }
      };

      roomController.updateRoomState(jsonObj, function(){
        refreshMonitorUi();
        roomController.getRoomState(jsonObj.content.rooms[0].room, function(results){
          roomSceneController.getRoomScenesByRoomId(results[0]._id, function(sceneResults) {
            results[0].scenes = sceneResults;
            monitorio.in(results[0]._id).emit('room', JSON.stringify(results));
          });
        });
      });
    });
  });

  socket.on('setteatimeorder', function(data){
    var json = JSON.parse(data);

    menuController.setTeaTimeOrder(json, function(){
      menuController.getTeaTimeOrder(function(results){
        monitorio.in('monitor').emit('teatimeorder', JSON.stringify(results));
      });
    });
  });

  socket.on('getteatimeorder', function(data){
    menuController.getTeaTimeOrder(function(results){
      socket.emit('teatimeorder', JSON.stringify(results));
    });
  });

  socket.on('deleteteatimeorder', function(data){
    menuController.deleteTeaTimeOrder(data, function(){
      menuController.getTeaTimeOrder(function(results){
        monitorio.in('monitor').emit('teatimeorder', JSON.stringify(results));
      });
    });
  });
});


function refreshMonitorUi() {
  //Reflect the state in Monitor UI
  roomController.getAllRoomState(function(results) {
    monitorio.in('monitor').emit('refreshroomstate', JSON.stringify(results));
  });

  wakeupCallController.getWakeupCall(null, function(results){
    monitorio.in('monitor').emit('wakeupcall', JSON.stringify(results));
  });

  checkoutController.getSelfCheckout(null, function(results){
    monitorio.in('monitor').emit('selfcheckout', JSON.stringify(results));
  });

  
}

function refreshRoomState(json) {
  //Broadcast the state to specify room

  console.log(JSON.stringify(json));
  for (var i = 0; i < json.content.rooms.length; i++) {
    console.log('Sent message to room:' + json.content.rooms[i].room);
    roomController.getRoomState(json.content.rooms[i].room, function(roomResults) {
      roomSceneController.getRoomScenesByRoomId(roomResults[0]._id, function(sceneResults) {
        roomResults[0].scenes = sceneResults;
        monitorio.in(roomResults[0]._id).emit('room', JSON.stringify(roomResults));
      });
    });
  }
}

function refreshRoomWakeupCall(json){
  //Broadcast the state to specify room
  for(var i=0; i < json.content.rooms.length; i++){
    console.log('Sent message to room:' + json.content.rooms[i].room);
    wakeupCallController.getWakeupCall(json.content.rooms[i].room, function(results){
      monitorio.in(results[0]._id).emit('wakeupcall', JSON.stringify(results));
    });
  }
}

function createJsonObject(request, results) {
  var json = {
    request: request,
    msgContent: results
  }

  return json;
}
