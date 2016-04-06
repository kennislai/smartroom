var mongoDbConnection = require('./connection.js');

module.exports = sensorController;

function sensorController() {
}

sensorController.prototype.setTemperature = function setTemperature(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			collection.updateOne(
				{'_id': json.content.rooms[0].room},
				{
					$set : {
						temperature : json.content.rooms[0].value
					}
				}
			)

			callback & callback();
		});
	});
};


sensorController.prototype.setHumidity = function setHumidity(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			collection.updateOne(
				{'_id': json.content.rooms[0].room},
				{
					$set : {
						humidity : json.content.rooms[0].value
					}
				}
			)
			
			callback & callback();
		});	
	});
};
