var mongoDbConnection = require('./connection.js');

module.exports = roomConfigController;

function roomConfigController() {
}

roomConfigController.prototype.getRoomConfig = function getRoomConfig(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomConfig', function(error, collection) {
			var cursor = collection.find({[json.content.module + '.service'] : json.content.service}, {[json.content.module + '.service.$'] : 1});
			cursor.each(function(err, doc) {
				if (doc != null){
					callback && callback(doc);
				}
			});			
		});
	});
};

roomConfigController.prototype.getAllRoomConfig = function getAllRoomConfig(callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomConfig', function(error, collection) {
			collection.find().sort().toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};

roomConfigController.prototype.setRoomConfig = function setRoomConfig(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomConfig', function(error, collection) {
			collection.updateOne(
				{[json.content.module + '.service'] : json.content.service},
				{$set : {[json.content.module + '.$.' + json.content.property] : json.content.value}}
			)
			callback && callback();
		});
	});
};
