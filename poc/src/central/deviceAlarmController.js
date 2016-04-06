var mongoDb = require('./connection.js'),
  ObjectID = require('mongodb').ObjectID;

module.exports = deviceAlarmController;

function deviceAlarmController() {}

deviceAlarmController.prototype.getDeviceAlarm = function getDeviceAlarm(callback) {
  mongoDb(function(db) {
    db.collection('deviceAlarm', function(error, deviceAlarm) {
      deviceAlarm.find().sort({
        "outDateTime": -1
      }).toArray(function(err, results) {
        callback(results);
      });
    });
  });
};

deviceAlarmController.prototype.deleteAllDeviceAlarm = function getDeviceAlarm(callback) {
  mongoDb(function(db) {
    db.collection('deviceAlarm', function(error, deviceAlarm) {
      deviceAlarm.deleteMany({}, function(err, results){
        callback();
      });
    });
  });
};

deviceAlarmController.prototype.updateDeviceAlarm = function updateDeviceAlarm(json, callback) {
  if (json.message.value === 0) {
    var insertObj = {
      roomId: json.roomId,
      name: json.message.deviceName,
      //outDateTime: json.message.dateTime,
      outDateTime: new Date().toJSON(),
      inDateTime: null,
      macAddress: json.message.macAddress
    };

    mongoDb(function(db) {
      db.collection('deviceAlarm', function(error, deviceAlarm) {
        deviceAlarm.findAndModify({
          roomId: json.roomId,
          macAddress: json.message.macAddress,
          inDateTime: null
        }, {}, {
          $setOnInsert: insertObj
        }, {
          new: true,
          upsert: true
        }, function(err, result) {
          callback();
        });
      });
    });
  } else {
    mongoDb(function(db) {
      db.collection('deviceAlarm', function(error, deviceAlarm) {
        deviceAlarm.findAndModify({
          roomId: json.roomId,
          macAddress: json.message.macAddress,
          inDateTime: null
        }, {}, {
          $set: {
            //inDateTime: json.message.dateTime
            inDateTime: new Date().toJSON()
          }
        }, {
          new: true
        }, function(err, result) {
          callback();
        });
      });
    });
  }
};
