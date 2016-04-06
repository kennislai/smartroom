var mongoDbConnection = require('./connection.js');

module.exports = wakeupCallController;

function wakeupCallController() {
}

wakeupCallController.prototype.setWakeupCall = function setWakeupCall(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('wakeupCall', function(error, collection) {
			collection.updateOne(
				{'_id': json.content.rooms[0].room},
				{
					$set : {
						power : json.content.rooms[0].power,
						time : json.content.rooms[0].time
					}
				}
			)

			callback & callback();
		});
	});
};


wakeupCallController.prototype.getWakeupCall = function getWakeupCall(room, callback) {
	mongoDbConnection(function(databaseConnection) {
		if (room == null){
			databaseConnection.collection('wakeupCall', function(error, collection) {
				collection.find().sort({"_id":1}).toArray(function(err, results){
					callback && callback(results);
				});
			});
		}else{
			databaseConnection.collection('wakeupCall', function(error, collection) {
				collection.find({"_id": room}).toArray(function(err, results){
					callback && callback(results);
				});
			});	
		}
	});
};
