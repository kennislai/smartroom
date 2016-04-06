var mongo = require('mongodb');
	mongoDbConnection = require('./connection.js');
	
module.exports = menuController;

function menuController() {
}

menuController.prototype.getAllRoomServiceMenu = function getAllRoomServiceMenu(callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomServiceMenu', function(error, collection) {
			collection.find().sort({"_id":1}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};


menuController.prototype.deleteRoomServiceMenu = function deleteRoomServiceMenu(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomServiceMenu').deleteOne({"_id" : new mongo.ObjectID(json)}, function(){
			callback && callback();
		});
	});
};

menuController.prototype.getRoomServiceMenu = function getRoomServiceMenu(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomServiceMenu', function(error, collection) {
			collection.find({"_id" : new mongo.ObjectID(json)}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};


menuController.prototype.getAllTeaTimeMenu = function getAllTeaTimeMenu(callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('teaTimeMenu', function(error, collection) {
			collection.find().sort({"_id":1}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};

menuController.prototype.deleteTeaTimeMenu = function deleteTeaTimeMenu(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('teaTimeMenu').deleteOne({"_id" : new mongo.ObjectID(json)}, function(){
			callback && callback();
		});
	});
};

menuController.prototype.getTeaTimeMenu = function getTeaTimeMenu(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('teaTimeMenu', function(error, collection) {
			collection.find({"_id" : new mongo.ObjectID(json)}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};

menuController.prototype.setTeaTimeOrder = function setTeaTimeOrder(json, callback) {
	var teaTimeJson = JSON.parse(json.content.rooms[0].teatime);

	mongoDbConnection(function(databaseConnection) {
  		databaseConnection.collection('teaTimeOrder', function(error, collection) {
			collection.insertOne({
				'room': json.content.rooms[0].room,
				'deliverytime': teaTimeJson.deliverytime,
				'order': teaTimeJson.order,
				'requestdatetime': new Date().toJSON()
			}, callback & callback());
		});
	});
};

menuController.prototype.getTeaTimeOrder = function getTeaTimeOrder(callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('teaTimeOrder', function(error, collection) {
			collection.find().toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};

menuController.prototype.deleteTeaTimeOrder = function deleteTeaTimeOrder(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('teaTimeOrder').deleteOne({"_id" : new mongo.ObjectID(json)}, function(){
			callback && callback();
		});
	});
};