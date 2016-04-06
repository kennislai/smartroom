var mongoDbConnection = require('./connection.js');

module.exports = weatherController;

function weatherController() {
}

weatherController.prototype.getWeatherInfo = function getWeatherInfo(callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('weatherInfo', function(error, collection) {
			collection.find().toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};


weatherController.prototype.setWeatherInfo = function setWeatherInfo(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('weatherInfo', function(error, collection) {
			collection.updateOne(
				{},
				{
					$set : {
						temperature : json.content.value.temperature,
						dayHigh : json.content.value.dayHigh,
						dayLow : json.content.value.dayLow,
						weather : json.content.value.weather
					}
				}
			)

			callback && callback();	
		});
	});
};
