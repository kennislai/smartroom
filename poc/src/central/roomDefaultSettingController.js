var mongoDbConnection = require('./connection.js');

module.exports = roomDefaultSettingController;

function roomDefaultSettingController() {
}

roomDefaultSettingController.prototype.updateRoomDefaultSetting = function updateRoomDefaultSetting(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomDefaultSetting', function(error, collection) {
			updateRoomDefaultSettingCollection(collection, json);
			callback && callback();
		});
	});
};

roomDefaultSettingController.prototype.launchAndSuspendRoomDefaultSetting = function launchAndSuspendRoomDefaultSetting(json, callback) {
  	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomDefaultSetting', function(error, collection) {
			launchAndSuspendRoomDefaultSettingCollection(collection, json);
			callback && callback();
		});
	});
};

roomDefaultSettingController.prototype.getRoomDefaultSetting = function getRoomDefaultSetting(room, callback){
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomDefaultSetting', function(error, collection) {
			collection.find({"_id": room}).toArray(function(err, results){
				callback && callback(results);
			});
		});
	});
}

roomDefaultSettingController.prototype.resetRoomState = function resetRoomState(json, callback){
	mongoDbConnection(function(databaseConnection) {
		databaseConnection.collection('roomDefaultSetting', function(error, collection) {
			for(var i=0; i < json.content.rooms.length; i++){
				

				collection.find({"_id": json.content.rooms[i].room}).toArray(function(err, results){
					databaseConnection.collection('room', function(error, collection) {
						collection.updateOne(
							{'_id' : results[0]._id},
							{$set : {
								'room' : results[0].room,
								'suite' : results[0].suite,
								'state' : results[0].state,
								'courtesies' : results[0].courtesies,
								'lighting' : results[0].lighting,
								'hvac' : results[0].hvac,
								'tv' : results[0].tv,
								'curtain' : results[0].curtain,
								'selfservice' : results[0].selfservice
							}}, callback
						)
					});
				});
				/*
				var cursor = collection.find({'_id' : json.content.rooms[i].room});
				cursor.each(function(err, doc) {
					if (doc != null){
						databaseConnection.collection('room', function(error, collection) {
							collection.updateOne(
								{'_id' : doc._id},
								{$set : {
									'room' : doc.room,
									'suite' : doc.suite,
									'state' : doc.state,
									'courtesies' : doc.courtesies,
									'lighting' : doc.lighting,
									'hvac' : doc.hvac,
									'tv' : doc.tv,
									'curtain' : doc.curtain,
									'selfservice' : doc.selfservice
								}}
							)
						});
					}
				});*/
			}
			
			//callback && callback();
		});
	});
}

function updateRoomDefaultSettingCollection(collection, json){
	for(var i=0; i < json.content.rooms.length; i++){
		if (json.content.rooms[i].state != null){
			collection.updateOne(
				{'_id': json.content.rooms[i].room},
				{$set : {'state' : json.content.rooms[i].state} }
			)
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
			collection.updateOne(
					{'_id': json.content.rooms[i].room},
					{$set : { 	'hvac.state' : json.content.rooms[i].hvac.state,
								'hvac.mode' : json.content.rooms[i].hvac.mode,
								'hvac.fanspeed' : json.content.rooms[i].hvac.fanspeed,
								'hvac.temperature.ac' : json.content.rooms[i].hvac.temperature.ac,
								'hvac.temperature.heater' : json.content.rooms[i].hvac.temperature.heater} 
					}
				)
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

function launchAndSuspendRoomDefaultSettingCollection(collection, json){
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

