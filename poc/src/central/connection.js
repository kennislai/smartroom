var server = "127.0.0.1";
var port = "27017";
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
//the MongoDB connection
var connectionInstance;

module.exports = function(callback) {
  //if already we have a connection, don't connect to database again
  if (connectionInstance) {
    callback(connectionInstance);
    return;
  }

  var db = new Db('hotel', new Server(server, port, { auto_reconnect: true }));
  db.open(function(error, databaseConnection) {
    if (error) throw new Error(error);

    console.log("Connected to mongodb:" + server + ":" + port);
    connectionInstance = databaseConnection;
    callback(databaseConnection);
  });
};