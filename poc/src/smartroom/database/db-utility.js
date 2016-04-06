var path = require("path");
var sqlite3 = require('sqlite3').verbose();

module.exports = {

  getSysParam : function(key, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.get("SELECT Value FROM Sys_Parameter WHERE Key = ?", key, function(err, row) {
          var result = row.Value;
          //execute the callback if there is one
          callback && callback(result);
      });
    });
    db.close();
  },

  getDeviceByCode : function(code, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.get("SELECT Area, Type, Brand, Name, PIN FROM Device WHERE Code = ?", code, function(err, row) {
          var result = row;
          //execute the callback if there is one
          callback && callback(result);
      });
    });
    db.close();
  },

  getIRCommand : function(brand, command, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.get("SELECT Value FROM IR_Command WHERE Brand = ? AND Command = ?", brand, command, function(err, row) {
          var result = row.Value;
          //execute the callback if there is one
          callback && callback(result);
      });
    });
    db.close();
  },

  getRoomState : function(service, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.get("SELECT State FROM RoomState WHERE Service = ?", service, function(err, row) {
          var result = row.State;
          //execute the callback if there is one
          callback && callback(result);
      });
    });
    db.close();
  },

  getRoomConfig : function(service, config, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      if (service != null && config != null){
        db.get("SELECT Value FROM RoomConfig WHERE Service = ? AND Config = ?", service, config, function(err, row) {
            var result = row.Value;
            //execute the callback if there is one
            callback && callback(result);
        });
      }else{
        db.each("SELECT * FROM RoomConfig",
          function(err, row) {
            callback && callback(row);
          }
        );
      } 
    });
    db.close();
  },

  setRoomConfig : function(json, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      if (json.length > 0){
          json = json[0];
      }
      var keys = Object.keys(json.courtesies[0].configurations);
      for(var j=0; j < keys.length; j++){
        db.run("UPDATE RoomConfig SET Value = ? WHERE Service = ? AND Config = ?", json.courtesies[0].configurations[keys[j]], json.courtesies[0].service, keys[j]);
      }
      callback && callback();
    });
    db.close();
  },

  setAllRoomConfig : function(json){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      for (var i=0; i < json.msgContent[0].courtesies.length; i++){
        var keys = Object.keys(json.msgContent[0].courtesies[i].configurations);
        for(var j=0; j < keys.length; j++){
          db.run("UPDATE RoomConfig SET Value = ? WHERE Service = ? AND Config = ?", json.msgContent[0].courtesies[i].configurations[keys[j]], json.msgContent[0].courtesies[i].service, keys[j]);
        }
      }
      
    });
    db.close();
  },

  setRoomServiceMenu : function(json, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.run("DELETE FROM RoomServiceMenu");
      for(var i=0; i < json.length; i++){
        db.run("INSERT INTO RoomServiceMenu(Category, SubCategory, Item, Price) Values (?,?,?,?)", json[i].category, json[i].subcategory, json[i].item, json[i].price);
      }
      callback && callback();
    });
    db.close();
  },

  getRoomServiceMenu : function(callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.all("SELECT * FROM RoomServiceMenu", function(err, rows) {
        callback && callback(rows);
      });
    });
    db.close();
  },

  setTeaTimeMenu : function(json, callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.run("DELETE FROM TeaTimeMenu");
      for(var i=0; i < json.length; i++){
        db.run("INSERT INTO TeaTimeMenu(TeaSet, Item, Price) Values (?,?,?)", json[i].teaset, json[i].item, json[i].price);
      }
      callback && callback();
    });
    db.close();
  },

  getTeaTimeMenu : function(callback){
    var db = new sqlite3.Database(path.join(__dirname, 'smartroom.db'));
    db.serialize(function() {
      db.all("SELECT * FROM TeaTimeMenu", function(err, rows) {
            callback && callback(rows);
          });
    });
    db.close();
  }
};
