var mongo = require('mongodb'),
	mongoDbConnection = require('./connection.js');

module.exports = checkoutController;

function checkoutController() {
}

checkoutController.prototype.setSelfCheckout = function setSelfCheckout(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
  		databaseConnection.collection('selfCheckout', function(error, collection) {
			collection.insertOne({
				'room': json.content.rooms[0].room,
				'luggageservice' : json.content.rooms[0].luggageservice,
				'taxiservice' : json.content.rooms[0].taxiservice,
				'requestdatetime': new Date().toJSON()
			}, callback & callback());
		});
	});
};


checkoutController.prototype.getSelfCheckout = function getSelfCheckout(room, callback) {
	mongoDbConnection(function(databaseConnection) {
		if (room == null){
			databaseConnection.collection('selfCheckout', function(error, collection) {
				collection.find().sort({"_id":1}).toArray(function(err, results){
					callback && callback(results);
				});
			});
		}else{
			databaseConnection.collection('selfCheckout', function(error, collection) {
				collection.find({"_id": room}).toArray(function(err, results){
					callback && callback(results);
				});
			});	
		}
	});
};

checkoutController.prototype.deleteSelfCheckout = function deleteSelfCheckout(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('selfCheckout').deleteOne({"_id" : new mongo.ObjectID(json)}, function(){
			callback && callback();
		});
	});
};

checkoutController.prototype.deleteSelfCheckoutByRoom = function deleteSelfCheckoutByRoom(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('selfCheckout').deleteOne({"room" : json}, function(){
			callback && callback();
		});
	});
};