var mongoDbConnection = require('./connection.js');

module.exports = bookingController;

function bookingController() {
}

bookingController.prototype.getBooking = function getBooking(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('booking', function(error, collection) {
			collection.find({'_id' : json.bookingNo}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};

bookingController.prototype.onlineCheckin = function onlineCheckin(json, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('booking', function(error, collection) {
			collection.updateOne(
				{'_id': json.bookingNo},
				{$set : {'eta' : json.eta, 'checkinTime' : json.checkinTime}}
			)

			callback && callback();
		});
	});
};

bookingController.prototype.selfCheckin = function selfCheckin(json, roomNo, callback) {
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('booking', function(error, collection) {
			collection.updateOne(
				{'_id': json.bookingNo},
				{$set : {'actualCheckinTime' : json.actualCheckinTime, 'roomNo' : roomNo}}
			)

			callback && callback();
		});
	});
};

bookingController.prototype.getRoom = function getRoom(booking, state, callback){
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			collection.find({"room" : booking.room, "suite" : booking.suite, "state" : state}).limit(1).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
};

bookingController.prototype.setRoom = function getRoom(json, state, callback){
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			collection.updateOne(
				{'_id': json._id},
				{$set : {'state' : state}}
			)

			callback && callback();
		});
	});
};