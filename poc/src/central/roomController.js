var mongoDbConnection = require('./connection.js');
var checkoutController = require('./checkoutController');

module.exports = roomController;

function roomController() {
	checkoutController = new checkoutController();
}

roomController.prototype.updateRoomState = function updateRoomState(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			updateRoomStateCollection(collection, json);
			callback && callback();
		});
	});
};

roomController.prototype.launchAndSuspendRoomState = function launchAndSuspendRoomState(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			launchAndSuspendRoomStateCollection(collection, json);
			callback && callback();
		});
	});
};

roomController.prototype.getAllRoomState = function getRoomState(callback){
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			collection.find().sort({"_id":1}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
}

roomController.prototype.getRoomState = function getRoomState(room, callback){
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('room', function(error, collection) {
			collection.find({"_id": room}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
}

function updateRoomStateCollection(collection, json){
	for(var i=0; i < json.content.rooms.length; i++){
		if (json.content.rooms[i].state != null){
			collection.updateOne(
				{'_id': json.content.rooms[i].room},
				{$set : {'state' : json.content.rooms[i].state} }
			)

			if (json.content.rooms[i].state != 'CHECKOUT'){
				checkoutController.deleteSelfCheckoutByRoom(json.content.rooms[i].room);
			}
		}

		if (json.content.rooms[i].roomName != null){
			collection.updateOne(
				{'_id': json.content.rooms[i].room},
				{$set : {'room' : json.content.rooms[i].roomName} }
			)
		}

		if (json.content.rooms[i].suiteName != null){
			collection.updateOne(
				{'_id': json.content.rooms[i].room},
				{$set : {'suite' : json.content.rooms[i].suiteName} }
			)
		}

		if (json.content.rooms[i].courtesies != null){
			for(var j=0; j < json.content.rooms[i].courtesies.length; j++){
				collection.updateOne(
					{'_id': json.content.rooms[i].room, 'courtesies.service' : json.content.rooms[i].courtesies[j].service},
					{$set : {'courtesies.$.state' : json.content.rooms[i].courtesies[j].state} }
				)

				if (json.content.rooms[i].courtesies[j].service != 'bell'){
					if (json.content.rooms[i].courtesies[j].state == 'ACTIVE'){
						collection.updateOne(
							{'_id': json.content.rooms[i].room, 'courtesies.service' : json.content.rooms[i].courtesies[j].service},
							{$set : {'courtesies.$.activeDate' : new Date().toJSON()} }
						)
					}else{
						collection.updateOne(
							{'_id': json.content.rooms[i].room, 'courtesies.service' : json.content.rooms[i].courtesies[j].service},
							{$set : {'courtesies.$.activeDate' : ''} }
						)
					}
				}
			}
		}

		if (json.content.rooms[i].lighting != null){
			for(var j=0; j < json.content.rooms[i].lighting.length; j++){
				collection.updateOne(
					{'_id': json.content.rooms[i].room, 'lighting.type' : json.content.rooms[i].lighting[j].type},
					{$set : {	'lighting.$.state' : json.content.rooms[i].lighting[j].state, 
								'lighting.$.power' : json.content.rooms[i].lighting[j].power} 
					}
				)

				if (json.content.rooms[i].lighting[j].dimmable != null){
					collection.updateOne(
						{'_id': json.content.rooms[i].room, 'lighting.type' : json.content.rooms[i].lighting[j].type},
						{$set : {'lighting.$.dimmable' : json.content.rooms[i].lighting[j].dimmable} }
					)
				}

				if (json.content.rooms[i].lighting[j].dimmable == 'true' && json.content.rooms[i].lighting[j].dimming != null){
					collection.updateOne(
						{'_id': json.content.rooms[i].room, 'lighting.type' : json.content.rooms[i].lighting[j].type},
						{$set : {'lighting.$.dimming' : json.content.rooms[i].lighting[j].dimming} }
					)
				}	
			}
		}

		if (json.content.rooms[i].selfservice != null){
			for(var j=0; j < json.content.rooms[i].selfservice.length; j++){
				collection.updateOne(
					{'_id': json.content.rooms[i].room, 'selfservice.service' : json.content.rooms[i].selfservice[j].service},
					{$set : {'selfservice.$.state' : json.content.rooms[i].selfservice[j].state} }
				)	
			}
		}

		if (json.content.rooms[i].hvac != null){
			/*if (json.content.rooms[i].hvac.length > 0){
				collection.updateOne(
					{'_id': json.content.rooms[i].room},
					{$set : { 	'hvac.state' : json.content.rooms[i].hvac[0].state,
								'hvac.mode' : json.content.rooms[i].hvac[0].mode,
								'hvac.fanspeed' : json.content.rooms[i].hvac[0].fanspeed,
								'hvac.temperature.ac' : json.content.rooms[i].hvac[0].temperature.ac,
								'hvac.temperature.heater' : json.content.rooms[i].hvac[0].temperature.heater} 
					}
				)
			}*/
			collection.updateOne(
					{'_id': json.content.rooms[i].room},
					{$set : { 	'hvac.state' : json.content.rooms[i].hvac.state,
								'hvac.mode' : json.content.rooms[i].hvac.mode,
								'hvac.fanspeed' : json.content.rooms[i].hvac.fanspeed,
								'hvac.temperature.ac' : json.content.rooms[i].hvac.temperature.ac,
								'hvac.temperature.heater' : json.content.rooms[i].hvac.temperature.heater} 
					}
				)
		}

		if (json.content.rooms[i].tv != null){
			collection.updateOne(
					{'_id': json.content.rooms[i].room},
					{$set : { 'tv.state' : json.content.rooms[i].tv.state } }
				)
			/*if (json.content.rooms[i].tv.length > 0){
				collection.updateOne(
					{'_id': json.content.rooms[i].room},
					{$set : { 'tv.state' : json.content.rooms[i].tv[0].state } }
				)
			}*/
		}

		if (json.content.rooms[i].curtain != null){
			collection.updateOne(
					{'_id': json.content.rooms[i].room},
					{$set : {	'curtain.state' : json.content.rooms[i].curtain.state,
								'curtain.mode' : json.content.rooms[i].curtain.mode} 
					}
				)
			/*if (json.content.rooms[i].curtain.length > 0){
				collection.updateOne(
					{'_id': json.content.rooms[i].room},
					{$set : {	'curtain.state' : json.content.rooms[i].curtain[0].state,
								'curtain.mode' : json.content.rooms[i].curtain[0].mode} 
					}
				)		
			}*/
		}
	}
}

function launchAndSuspendRoomStateCollection(collection, json){
	for(var i=0; i < json.content.rooms.length; i++){
		for(var j=0; j < json.content.rooms[i].courtesies.length; j++){
			collection.updateOne(
				{'_id': json.content.rooms[i].room, 'courtesies.service' : json.content.rooms[i].courtesies[j].service},
				{$set : {'courtesies.$.state' : json.content.rooms[i].courtesies[j].state, 'courtesies.$.activeDate' : ''} }
			)	
		}

		for(var j=0; j < json.content.rooms[i].lighting.length; j++){
			collection.updateOne(
				{'_id': json.content.rooms[i].room, 'lighting.type' : json.content.rooms[i].lighting[j].type},
				{$set : {	'lighting.$.state' : json.content.rooms[i].lighting[j].state } }
			)	
		}

		for(var j=0; j < json.content.rooms[i].selfservice.length; j++){
			collection.updateOne(
				{'_id': json.content.rooms[i].room, 'selfservice.service' : json.content.rooms[i].selfservice[j].service},
				{$set : {'selfservice.$.state' : json.content.rooms[i].selfservice[j].state} }
			)	
		}

		if (json.content.rooms[i].hvac.length > 0){
			collection.updateOne(
				{'_id': json.content.rooms[i].room},
				{$set : { 	'hvac.state' : json.content.rooms[i].hvac[0].state} }
			)
		}

		if (json.content.rooms[i].tv.length > 0){
			collection.updateOne(
				{'_id': json.content.rooms[i].room},
				{$set : { 'tv.state' : json.content.rooms[i].tv[0].state } }
			)
		}

		if (json.content.rooms[i].curtain.length > 0){
			collection.updateOne(
				{'_id': json.content.rooms[i].room},
				{$set : {	'curtain.state' : json.content.rooms[i].curtain[0].state} }
			)		
		}	
	}
}