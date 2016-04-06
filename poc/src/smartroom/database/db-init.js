var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('smartroom.db');

db.serialize(function() {

  db.run("CREATE TABLE if not exists Sys_Parameter (Key TEXT, Value TEXT)");
  db.run("INSERT OR IGNORE INTO Sys_Parameter (Key, Value) VALUES (?,?)", "Room", "101");
  db.run("INSERT OR IGNORE INTO Sys_Parameter (Key, Value) VALUES (?,?)", "Management_System_Address", "ws://192.168.0.2:8088");
  db.run("INSERT OR IGNORE INTO Sys_Parameter (Key, Value) VALUES (?,?)", "Web_Server_Port", "3001");
  db.run("INSERT OR IGNORE INTO Sys_Parameter (Key, Value) VALUES (?,?)", "App_Server_Port", "3002");
  db.each("SELECT * FROM Sys_Parameter", function(err, row) {
      console.log(row);
  });

  db.run("CREATE TABLE if not exists Device (Code TEXT, Area TEXT, Type TEXT, Brand TEXT, Name TEXT, PIN TEXT)");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "BAR_ML_01",   "Bathroom",     "Light",     "None", "Bathroom Master Light 1",    "P8_13");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_ML_01",    "Living room",  "Light",     "None", "Living Room Master Light 1", "P8_13");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_ML_02",    "Living room",  "Light",     "None", "Living Room Master Light 2", "P8_13");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "BER1_ML_01",  "Bedroom 1",    "Light",     "None", "Bathroom 1 Master Light 1",  "P8_13");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "BER2_ML_01",  "Bedroom 2",    "Light",     "None", "Bathroom 2 Master Light 1",  "P8_13");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "DR_DND",      "Door",         "Courtesy",  "None", "Do Not Disturb",             "None");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "DR_LAU",      "Door",         "Courtesy",  "None", "Laundry",                    "None");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "DR_MAK",      "Door",         "Courtesy",  "None", "Make-up Room",               "None");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "DR_BEL",      "Door",         "Bell",      "None", "Bell",                       "P9_13");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_TV_01",    "Living Room",  "TV",        "LG",   "Living Room TV 1",           "P8_19");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "BER1_TV_01",  "Bedroom 1",    "TV",        "LG",   "Bedroom 1 TV 1",             "P8_19");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_AC",       "Living room",  "AC",        "None", "Living Room AC",             "P9_11");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_HT",       "Living room",  "HT",        "None", "Living Room HT",             "P9_13");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_FAN",       "Living room",  "FAN",        "None", "Living Room FAN",          "P9_15");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "SR_TMP",       "Living room",  "Sensor",        "None", "Living Room Temperature Sensor",            "P8_11");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_PIR_01",       "Living room",  "Sensor",        "None", "Living Room PIR Sensor 1",            "P8_11");
  db.run("INSERT OR IGNORE INTO Device (Code, Area, Type, Brand, Name, PIN) VALUES (?,?,?,?,?,?)", "LR_PIR_02",       "Living room",  "Sensor",        "None", "Living Room PIR Sensor 2",            "P8_11");
  db.each("SELECT * FROM Device", function(err, row) {
      console.log(row);
  });

  db.run("CREATE TABLE if not exists IR_Command (Brand TEXT, Command TEXT, Value TEXT)");
  db.run("INSERT OR IGNORE INTO IR_Command (Brand, Command, Value) VALUES (?,?,?)", "LG", "Power", "20DF10EF");
  db.run("INSERT OR IGNORE INTO IR_Command (Brand, Command, Value) VALUES (?,?,?)", "LG", "VolumeUp", "20DF40BF");
  db.run("INSERT OR IGNORE INTO IR_Command (Brand, Command, Value) VALUES (?,?,?)", "LG", "VolumeDown", "20DFC03F");
  db.run("INSERT OR IGNORE INTO IR_Command (Brand, Command, Value) VALUES (?,?,?)", "LG", "ChannelUp", "20DF00FF");
  db.run("INSERT OR IGNORE INTO IR_Command (Brand, Command, Value) VALUES (?,?,?)", "LG", "ChannelDown", "20DF807F");
  db.run("INSERT OR IGNORE INTO IR_Command (Brand, Command, Value) VALUES (?,?,?)", "LG", "Mute", "20DF906F");
  db.each("SELECT * FROM IR_Command", function(err, row) {
      console.log(row);
  });

  db.run("CREATE TABLE if not exists RoomConfig (Service TEXT, Config TEXT, Value TEXT)");
  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "dnd", "overrideAccessControl", "true");
  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "dnd", "lightOnWhenActive", "true");
  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "dnd", "notifyManagementSystem", "true");

  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "makeuproom", "lightOnWhenActive", "true");
  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "makeuproom", "notifyManagementSystem", "true");

  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "laundry", "lightOnWhenActive", "true");
  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "laundry", "notifyManagementSystem", "true");

  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "bell", "lightOnWhenActive", "true");
  db.run("INSERT OR IGNORE INTO RoomConfig (Service, Config, Value) VALUES (?,?,?)", "bell", "notifyBuzzer", "true");
  db.each("SELECT * FROM RoomConfig", function(err, row) {
      console.log(row);
  });

  db.run("CREATE TABLE if not exists RoomServiceMenu (Category TEXT, SubCategory TEXT, Item TEXT, Price TEXT)");

  db.run("CREATE TABLE if not exists TeaTimeMenu (TeaSet TEXT, Item TEXT, Price TEXT)");
});
db.close();
