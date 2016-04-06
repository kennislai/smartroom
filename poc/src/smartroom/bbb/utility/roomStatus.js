var path = require("path");
var JsonDB = require('node-json-db');
var ReadWriteLock = require('rwlock');
var lock = new ReadWriteLock();

module.exports = roomStatus;

function roomStatus() {
  this.filePath = path.join(__dirname, 'room.json');
  this.db = new JsonDB(this.filePath, true, true);
}

roomStatus.prototype.getJSON = function getJSON(path, callback) {
  var self = this;
  lock.readLock(function(release) {
    var data = self.db.getData(path);
    release();
    callback(data);
  });
};

roomStatus.prototype.updateJSON = function updateJSON(json, callback) {
  var self = this;
  if (json !== undefined && json !== null) {
    lock.writeLock(function(release) {
      self.db.push("/", json);

      if (json.hvac.mode == 'OFF') {
        self.db.push("/hvac/power/ac", 0);
        self.db.push("/hvac/power/heater", 0);
      } else if (json.hvac.mode == 'AIRCON') {
        self.db.push("/hvac/power/ac", 1);
        self.db.push("/hvac/power/heater", 0);
      } else if (json.hvac.mode == 'HEATER') {
        self.db.push("/hvac/power/ac", 0);
        self.db.push("/hvac/power/heater", 1);
      }

      release();
      callback();
    });
  }
};

roomStatus.prototype.createSceneBBBMessage = function createSceneBBBMessage(sceneId, callback) {
  var self = this;
  this.getJSON("/scenes", function(scenes) {
    scenes.forEach(function(scene) {
      if (scene._id == sceneId) {
        var result = self.createBBBMessage(scene);
        callback(result);
      }
    });
  });
};

roomStatus.prototype.createBBBMessageFromState = function createBBBMessageFromState(callback) {
  var self = this;
  this.getJSON("/", function(data) {
    callback(self.createBBBMessage(data));
  });
};

roomStatus.prototype.createBBBMessage = function createBBBMessage(json) {
  var jsonObjs = [];

  if (json.courtesies !== null && json.courtesies !== undefined) {
    for (var j1 = 0; j1 < json.courtesies.length; j1++) {
      jsonObjs.push(createInternalMessage("COMMAND", "COURTESY", json.courtesies[j1].service, json.courtesies[j1].state));
    }
  }

  if (json.lighting !== null && json.lighting !== undefined) {
    for (var j = 0; j < json.lighting.length; j++) {
      if (json.lighting[j].dimmable == 'true') {
        jsonObjs.push(createInternalMessage("STATE", "LIGHTING", json.lighting[j].type, json.lighting[j].state));
        jsonObjs.push(createInternalMessage("COMMAND", "LIGHTING", json.lighting[j].type, json.lighting[j].power == 'ON' ? '1' : '0'));
        jsonObjs.push(createInternalMessage("DIMMING", "LIGHTING", json.lighting[j].type, json.lighting[j].dimming));
      } else {
        jsonObjs.push(createInternalMessage("STATE", "LIGHT", json.lighting[j].type, json.lighting[j].state));
        jsonObjs.push(createInternalMessage("COMMAND", "LIGHT", json.lighting[j].type, json.lighting[j].power == 'ON' ? '1' : '0'));
      }
    }
  }

  if (json.hvac !== null && json.hvac !== undefined) {
    jsonObjs.push(createInternalMessage('STATE', 'HVAC', 'hvac1', json.hvac.state));
    jsonObjs.push(createInternalMessage('TEMPERATURE', 'HVAC', 'hvac1-airCon', json.hvac.temperature.ac));
    jsonObjs.push(createInternalMessage('TEMPERATURE', 'HVAC', 'hvac1-heater', json.hvac.temperature.heater));

    if (json.hvac.mode == 'OFF') {
      jsonObjs.push(createInternalMessage('COMMAND', 'HVAC', 'hvac1-airCon', 0));
      jsonObjs.push(createInternalMessage('COMMAND', 'HVAC', 'hvac1-heater', 0));
    } else if (json.hvac.mode == 'AIRCON') {
      jsonObjs.push(createInternalMessage('COMMAND', 'HVAC', 'hvac1-heater', 0));
      jsonObjs.push(createInternalMessage('COMMAND', 'HVAC', 'hvac1-airCon', 1));
      jsonObjs.push(createInternalMessage('UPDATE_REFRESH_INTERVAL', 'TEMPERATURE_SENSOR', 'temperatureSensor', 3000));
      jsonObjs.push(createInternalMessage('READ', 'TEMPERATURE_SENSOR', 'temperatureSensor', null));
    } else if (json.hvac.mode == 'HEATER') {
      jsonObjs.push(createInternalMessage('COMMAND', 'HVAC', 'hvac1-airCon', 0));
      jsonObjs.push(createInternalMessage('COMMAND', 'HVAC', 'hvac1-heater', 1));
      jsonObjs.push(createInternalMessage('UPDATE_REFRESH_INTERVAL', 'TEMPERATURE_SENSOR', 'temperatureSensor', 3000));
      jsonObjs.push(createInternalMessage('READ', 'TEMPERATURE_SENSOR', 'temperatureSensor', null));
    }
  }

  if (json.curtain !== null && json.curtain !== undefined)
  {
    jsonObjs.push(createInternalMessage(json.curtain.mode, "CURTAIN", null, null));
  }

  if (json.selfservice !== null && json.selfservice !== undefined) {
    for (var j2 = 0; j2 < json.selfservice.length; j2++) {
      jsonObjs.push(createInternalMessage("STATE", "SELFSERVICE", json.selfservice[j2].service, json.selfservice[j2].state));
    }
  }

  return jsonObjs;
};

function createInternalMessage(type, deviceType, deviceName, value) {
  var jsonObj = {
    type: type,
    deviceType: deviceType,
    deviceName: deviceName,
    value: value
  };
  return jsonObj;
}

roomStatus.prototype.createTempJsonObjForAppServer = function createTempJsonObjForAppServer(deviceType, callback) {
  if (deviceType == 'TEMPERATURE_SENSOR' || deviceType == 'HUMIDITY_SENSOR') {
    this.getJSON("/", function(data) {
      var jsonObj = {
        content: {
          rooms: [{
            room: data._id,
            type: deviceType,
            value: deviceType == 'TEMPERATURE_SENSOR' ? data.temperature : data.humidity
          }]
        }
      };
      callback(jsonObj);
    });
  }
  callback(null);
};

roomStatus.prototype.createNotifyJsonObjForAppServer = function createJsonObjForAppServer(json, callback) {
  this.getJSON("/_id", function(roomId) {
    var jsonObj = {
      roomId: roomId,
      message: json
    };
    callback(jsonObj);
  });
};

roomStatus.prototype.createJsonObjForAppServer = function createJsonObjForAppServer(callback) {
  this.getJSON("/", function(data) {
    data.room = data._id;
    delete data.suite;
    var jsonObj = {
      content: {
        rooms: [data]
      }
    };
    callback(jsonObj);
  });

  /* To Do
  db.getRoomConfig(json.deviceName, 'notifyManagementSystem', function(result) {
    if (result || result == 1) {
    }
  }
  */
};

roomStatus.prototype.updateStatus = function updateStatus(json, callback) {
  var self = this;
  lock.writeLock(function(release) {
    if (json.deviceType == 'COURTESY') {
      var courtesies = self.db.getData("/courtesies");
      for (var i1 = 0; i1 < courtesies.length; ++i1) {
        if (courtesies[i1].service == json.deviceName) {
          self.db.push("/courtesies[" + i1 + "]/state", json.value);
        }
      }
    } else if (json.deviceType == 'TEMPERATURE_SENSOR') {
      self.db.push("/temperature", json.value);
    } else if (json.deviceType == 'HUMIDITY_SENSOR') {
      self.db.push("/humidity", json.value);
    } else if (json.deviceType == 'LIGHT' || json.deviceType == 'LIGHTING') {
      var lighting = self.db.getData("/lighting");
      for (var i2 = 0; i2 < lighting.length; ++i2) {
        if (lighting[i2].type == json.deviceName) {
          if (json.type == "COMMAND") {
            self.db.push("/lighting[" + i2 + "]/power", json.value == 1 ? "ON" : "OFF");
          } else if (json.type == "DIMMING") {
            self.db.push("/lighting[" + i2 + "]/dimming", json.value);
          }
        }
      }
    } else if (json.deviceType == 'HVAC') {
      if (json.type == "TEMPERATURE") {
        if (json.deviceName.split('-')[1] == 'airCon') {
          self.db.push("/hvac/temperature/ac", json.value);
        } else if (json.deviceName.split('-')[1] == 'heater') {
          self.db.push("/hvac/temperature/heater", json.value);
        }
      }
      else if (json.type == "COMMAND")
      {
        if (json.deviceName.split('-')[1] == 'airCon') {
          self.db.push("/hvac/power/ac", json.value);
        } else if (json.deviceName.split('-')[1] == 'heater') {
          self.db.push("/hvac/power/heater", json.value);
        }
      }

      var heater = parseInt(self.db.getData("/hvac/power/heater"));
      var ac = parseInt(self.db.getData("/hvac/power/ac"));
      if (heater === 0 && ac === 0) {
        self.db.push("/hvac/mode", "OFF");
      } else if (heater === 0 && ac !== 0) {
        self.db.push("/hvac/mode", "AIRCON");
      } else {
        self.db.push("/hvac/mode", "HEATER");
      }
    }
    else if (json.deviceType == 'CURTAIN')
    {
      self.db.push("/curtain/mode", json.type);
    }
    release();
    callback();
  });
};
