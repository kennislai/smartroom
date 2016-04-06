var mongoDb = require('./connection.js'),
  ObjectID = require('mongodb').ObjectID;

module.exports = roomSceneController;

function roomSceneController() {}

roomSceneController.prototype.getRoomScenes = function getRoomScenes(callback) {
  mongoDb(function(db) {
    db.collection('scenes', function(error, scenes) {
      scenes.find().sort({
        "_id": 1
      }).toArray(function(err, results) {
        callback(results);
      });
    });
  });
};

roomSceneController.prototype.getRoomAvailableScenesByRoomId = function getRoomAvailableScenesByRoomId(roomId, callback) {
  mongoDb(function(db) {
    db.collection('room', function(error, room) {
      room.findOne({
        "_id": roomId
      }, {
        "scene_ids": 1
      }, function(err, document) {
        if (document.scene_ids === undefined || document.scene_ids === null) {
          document.scene_ids = [];
        }
        db.collection('scenes', function(error, scenes) {
          scenes.find({
            "_id": {
              "$nin": document.scene_ids
            }
          }).toArray(function(err, results) {
            callback(results);
          });
        });
      });
    });
  });
};

roomSceneController.prototype.getRoomScenesByRoomId = function getRoomScenesByRoomId(roomId, callback) {
  mongoDb(function(db) {
    db.collection('room', function(error, room) {
      room.findOne({
        "_id": roomId
      }, {
        "scene_ids": 1
      }, function(err, document) {
        if (document !== null) {
          db.collection('scenes', function(error, scenes) {
            scenes.find({
              "_id": {
                "$in": document.scene_ids
              }
            }).toArray(function(err, results) {
              callback(results);
            });
          });
        }
      });
    });
  });
};

roomSceneController.prototype.getRoomSceneById = function getRoomState(id, callback) {
  mongoDb(function(db) {
    db.collection('scenes', function(error, collection) {
      collection.findOne({
        _id: new ObjectID(id)
      }, function(err, document) {
        callback(document);
      });
    });
  });
};

roomSceneController.prototype.createRoomScene = function createRoomScene(callback) {
  var roomId = '101';
  mongoDb(function(db) {
    db.collection('roomDefaultSetting', function(error, room) {
      room.findOne({
        "_id": roomId
      }, function(err, document) {
        if (document !== null) {
          var json = {};
          json.name = "DEFAULT SCENE NAME";
          json.backEndOnly = true;
          json.hvac = document.hvac;
          json.curtain = document.curtain;
          json.state = "READY";
          json.lighting = [];
          document.lighting.forEach(function(item) {
            if (item.state == "READY") {
              json.lighting.push(item);
            }
          });
          callback(json);
        }
      });
    });
  });
};

//Remove the scene from room
roomSceneController.prototype.removeRoomScene = function removeRoomScene(sceneId, roomId, callback) {
  if (sceneId !== undefined && sceneId !== null && roomId !== undefined && roomId !== null) {
    var id = new ObjectID(sceneId);
    mongoDb(function(db) {
      db.collection('room', function(error, roomCollection) {
        roomCollection.update({
          _id: roomId
        }, {
          '$pull': {
            scene_ids: id
          }
        }, function(err) {
          callback();
        });
      });
    });
  }
};

//Remove the scene and also remove the scene from room
roomSceneController.prototype.deleteRoomScene = function deleteRoomScene(sceneId, callback) {
  if (sceneId !== undefined && sceneId !== null) {
    var id = new ObjectID(sceneId);
    mongoDb(function(db) {
      db.collection('scenes', function(error, collection) {
        collection.deleteOne({
          "_id": id
        }, function(err, result) {

          db.collection('room', function(error, roomCollection) {
            roomCollection.update({}, {
              '$pull': {
                scene_ids: id
              }
            }, {
              multi: true
            }, function(err) {
              callback();
            });
          });

        });
      });
    });
  }
};

roomSceneController.prototype.addRoomScene = function addRoomScene(json, callback) {
  json.sceneIds.forEach(function(sceneId) {
    var id = new ObjectID(sceneId);
    mongoDb(function(db) {
      db.collection('room', function(error, roomCollection) {
        roomCollection.update({
          _id: json.roomId
        }, {
          '$push': {
            scene_ids: id
          }
        }, function(err) {
          callback();
        });
      });
    });
  });
};

roomSceneController.prototype.updateRoomScene = function updateRoomScene(json, callback) {
  if (json._id === undefined) {
    mongoDb(function(db) {
      db.collection('scenes', function(error, collection) {
        collection.insertOne(json, function(err, result) {
          callback(json);
        });
      });
    });
  } else {
    var id = new ObjectID(json._id);
    delete json._id;
    mongoDb(function(db) {
      db.collection('scenes', function(error, collection) {
        collection.replaceOne({
          _id: id
        }, json, function(err) {
          json._id = id.toString();
          callback(json);
        });
      });
    });
  }
};
