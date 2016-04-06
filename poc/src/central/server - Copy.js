var monitorPort = 8088;

var express = require('express'),
	app = express();
	server = require('http').createServer(app),
	monitorio = require('socket.io')(server),
	path = require('path'), 
	fs = require("fs"),
	ip = require("ip"),
	formidable = require("formidable"),
	csv = require('csv-parser'),
	mongo = require('mongodb');

var mongoDbConnection = require('./connection.js');

var roomController = require('./roomController'),
	roomDefaultSettingController = require('./roomDefaultSettingController');

roomController = new roomController();
roomDefaultSettingController = new roomDefaultSettingController();

//webserver config
app.use('/public', express.static('public'));

app.get('/', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'index.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/index', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'index.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

//Room State
app.get('/roomState', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'roomState.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/roomStateDetail', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'roomStateDetail.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/roomStateDefaultSetting', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'roomStateDefaultSetting.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/roomStateReset', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'roomStateReset.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/launchAndSuspendService', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'launchAndSuspendService.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

//Courtesy Service
app.get('/configureCourtesyService', function(req,res){
	console.log(req.param('section'));
	fs.readFile(path.join(__dirname, 'public', 'pages', 'configureCourtesyService.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});


app.get('/weatherInfo', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'weatherInfo.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});
app.get('/roomTemp', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'roomTemp.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/onlinecheckin', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'onlinecheckin.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});
app.get('/selfcheckin', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'selfcheckin.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.post("/uploadRoomServiceMenu", function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on("fileBegin", function (name, file){
    	if (file.name != ''){
	        console.log('fileBegin');
	        file.path = __dirname + "/public/uploads/" + file.name;
	    }
    });

    form.on("file", function (name, file){
    	if (file.name != ''){
	        console.log("Uploaded " + file.name);
	        mongoDbConnection(function(databaseConnection) {
				var csvReader = fs.createReadStream(file.path).pipe(csv());
				var menu = [];
				csvReader.on('data', function(data) {
		        	console.log('row', data);
		        	menu.push({"category" : data.category,
							"subcategory" : data.subcategory,
							"item" : data.item,
							"price" : data.price});
		        });
		        csvReader.on('end', function(data) {
		        	console.log('END Of FILE');
		        	databaseConnection.collection('roomServiceMenu', function(error, collection) {
						collection.insertOne({
							'filename': file.name,
							'menu': menu
						});
					});
		    
		        });
			});
	    }
    });

    fs.readFile(path.join(__dirname, 'public', 'pages', 'roomServiceMenu.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/roomServiceMenu', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'roomServiceMenu.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.post("/uploadTeaTimeMenu", function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on("fileBegin", function (name, file){
    	if (file.name != ''){
	        console.log('fileBegin');
	        file.path = __dirname + "/public/uploads/" + file.name;
	    }
    });

    form.on("file", function (name, file){
    	if (file.name != ''){
	        console.log("Uploaded " + file.name);
	        mongoDbConnection(function(databaseConnection) {
				var csvReader = fs.createReadStream(file.path).pipe(csv());
				var menu = [];
				csvReader.on('data', function(data) {
		        	console.log('row', data);
		        	menu.push({
							"category" : data.category,
							"subcategory" : data.subcategory,
							"item" : data.item,
							"price" : data.price
						});
		        });
		        csvReader.on('end', function(data) {
		        	console.log('END Of FILE');
		        	databaseConnection.collection('teaTimeMenu', function(error, collection) {
						collection.insertOne({
							'filename': file.name,
							'menu': menu
						});
					});
		        	
		        });
			});        
	    }
    });

    fs.readFile(path.join(__dirname, 'public', 'pages', 'teaTimeMenu.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/teaTimeMenu', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'teaTimeMenu.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

app.get('/teaTimeOrder', function(req,res){
	fs.readFile(path.join(__dirname, 'public', 'pages', 'teaTimeOrder.html'), 'utf8', function(err, text){
        text = text.replace("SERVERIP", ip.address() + ":" + monitorPort);
        res.send(text);
    });
});

server.listen(monitorPort);
console.log("Web server running at port " + monitorPort);

monitorio.on('connection', function(socket) {
	socket.join();

	console.log('client connected:' + socket.request.connection.remoteAddress);

	socket.on('join', function(data){
		console.log('Client ' + socket.request.connection.remoteAddress + " join " + data);
		socket.join(data);
	});

	socket.on('getroom', function(data) {
		roomController.getRoomState(data, function(results){
			socket.emit('room', JSON.stringify(results));
		});
		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('room', function(error, collection) {
				collection.find({"_id": data}).toArray(function(err, results){
					socket.emit('room', JSON.stringify(results));
				});
			});
		});
	});

	socket.on('getallroom', function(data) {
		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('room', function(error, collection) {
				collection.find().sort({"_id":1}).toArray(function(err, results){
					socket.emit('allroom', JSON.stringify(results));
				});
			});
		});
	});

	socket.on('getroomconfig', function(data) {
		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('roomConfig', function(error, collection) {
				if (data == null){
					collection.find().sort().toArray(function(err, results){
						socket.emit('roomconfig', JSON.stringify(results));
					});
				}else{
					var json = JSON.parse(data);
					var cursor = collection.find({[json.content.module + '.service'] : json.content.service}, {[json.content.module + '.service.$'] : 1});
					cursor.each(function(err, doc) {
						if (doc != null){
							socket.emit('roomconfig', JSON.stringify(doc));
						}
					});
				}				
			});
		});
	});

	socket.on('setroomconfig', function(data) {
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('roomConfig', function(error, collection) {
				collection.updateOne(
					{[json.content.module + '.service'] : json.content.service},
					{$set : {[json.content.module + '.$.' + json.content.property] : json.content.value}},
					function(err, results){
						databaseConnection.collection('roomConfig', function(error, collection) {
							var cursor = collection.find({[json.content.module + '.service'] : json.content.service}, {[json.content.module + '.service.$'] : 1});
							cursor.each(function(err, doc) {
								if (doc != null){
									console.log('getroomconfig:' + JSON.stringify(doc));
									monitorio.emit('roomconfig', JSON.stringify(doc));
								}
							});
						});
					}
				)
				socket.emit('updateResult','Done');
			});
		});
	});

	socket.on('setroomstate', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('room', function(error, collection) {
				for(var i=0; i < json.content.rooms.length; i++){
					collection.updateOne(
						{'_id': json.content.rooms[i].room},
						{$set : {'state' : json.content.state}}
					)		
				}
				socket.emit('updateResult','Done');
				
				refreshMonitorUi(databaseConnection);
				refreshRoomState(databaseConnection, json);
			});
		});
	});

	socket.on('resetroomstate', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('roomDefaultSetting', function(error, collection) {
				for(var i=0; i < json.content.rooms.length; i++){
					var cursor = collection.find({'_id' : json.content.rooms[i].room});
					cursor.each(function(err, doc) {
						if (doc != null){
							databaseConnection.collection('room', function(error, collection) {
								collection.updateOne(
									{'_id' : doc._id},
									{$set : {
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
					});
				}

				socket.emit('updateResult','Done');
				refreshMonitorUi(databaseConnection);
				refreshRoomState(databaseConnection, json);
			});
		});
	});

	socket.on('setroomservicelaunchandsuspendstate', function(data){
		var json = JSON.parse(data);

		roomController.launchAndSuspendRoomState(json, function(){
			socket.emit('updateResult','Done');

			roomController.getAllRoomState(function(results){
				monitorio.in('monitor').emit('refreshroomstate', JSON.stringify(results));
			});

			for(var i=0; i < json.content.rooms.length; i++){
				console.log('Sent message to room:' + json.content.rooms[i].room);
				roomController.getRoomState(json.content.rooms[i].room, function(results){
					monitorio.in(results._id).emit('room', JSON.stringify(results));
				});
			}
		});

		roomDefaultSettingController.launchAndSuspendRoomDefaultSetting(json);
	});

	socket.on('setroomservicestate', function(data){
		var json = JSON.parse(data);

		roomController.updateRoomState(json, function(){
			socket.emit('updateResult','Done');
			
			roomController.getAllRoomState(function(results){
				monitorio.in('monitor').emit('refreshroomstate', JSON.stringify(results));
			});

			for(var i=0; i < json.content.rooms.length; i++){
				console.log('Sent message to room:' + json.content.rooms[i].room);
				roomController.getRoomState(json.content.rooms[i].room, function(results){
					monitorio.in(results._id).emit('room', JSON.stringify(results));
				});
			}
		});
	});

	socket.on('setroomdefaultsetting', function(data){
		var json = JSON.parse(data);

		roomDefaultSettingController.updateRoomDefaultSetting(json, function(){
			socket.emit('updateResult','Done');
		});
	});

	socket.on('getroomdefaultsetting', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('roomDefaultSetting', function(error, collection) {
				collection.find({'_id': data}).toArray(function(err, results){
					socket.emit('roomdefaultsetting', JSON.stringify(results));
				});
			});
		});
	});

	socket.on('getweatherinfo', function(data){
		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('weatherInfo', function(error, collection) {
				collection.find().toArray(function(err, results){
					socket.emit('weatherinfo', JSON.stringify(results));
				});
			});
		});
	});

	socket.on('setweatherinfo', function(data){
		var json = JSON.parse(data);

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
				monitorio.emit('updateResult','Done');

				databaseConnection.collection('weatherInfo', function(error, collection) {
					collection.find().toArray(function(err, results){
						monitorio.emit('weatherinfo', JSON.stringify(results));
					});
				});
			});
		});
	});

	socket.on('setroomtemp', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			if (json.content.rooms[0].type == 'TEMPERATURE_SENSOR'){
				databaseConnection.collection('room', function(error, collection) {
					collection.updateOne(
						{'_id': json.content.rooms[0].room},
						{
							$set : {
								temperature : json.content.rooms[0].value
							}
						}
					)	

					refreshMonitorUi(databaseConnection);
				});
			}else if (json.content.rooms[0].type == 'HUMIDITY_SENSOR'){
				databaseConnection.collection('room', function(error, collection) {
					collection.updateOne(
						{'_id': json.content.rooms[0].room},
						{
							$set : {
								humidity : json.content.rooms[0].value
							}
						}
					)	
					refreshMonitorUi(databaseConnection);
				});
			}
			
		});
	});

	socket.on('getroomserviceallmenu', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('roomServiceMenu', function(error, collection) {
				collection.find().sort({"_id":1}).toArray(function(err, results){
					monitorio.in('monitor').emit('roomserviceallmenu', JSON.stringify(results));
				});
			});
		});
	});

	socket.on('deleteroomservicemenu', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('roomServiceMenu').deleteOne({"_id" : new mongo.ObjectID(json)}, function(){
				socket.emit('deleteroomservicemenu', JSON.stringify(json + " is deleted"));

				databaseConnection.collection('roomServiceMenu', function(error, collection) {
					collection.find().sort({"_id":1}).toArray(function(err, results){
						monitorio.in('monitor').emit('roomserviceallmenu', JSON.stringify(results));
					});
				});
			});
		});
	});

	socket.on('publishroomservicemenu', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('roomServiceMenu', function(error, collection) {
				collection.find({"_id" : new mongo.ObjectID(json)}).toArray(function(err, results){
					monitorio.emit('roomservicemenu', JSON.stringify(results));
					socket.emit('publishroomservicemenu',  JSON.stringify(json + " is published"));
				});
			});
		});
	});

	socket.on('getteatimeallmenu', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('teaTimeMenu', function(error, collection) {
				collection.find().sort({"_id":1}).toArray(function(err, results){
					monitorio.in('monitor').emit('teatimeallmenu', JSON.stringify(results));
				});
			});
		});
	});

	socket.on('deleteteatimemenu', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('teaTimeMenu').deleteOne({"_id" : new mongo.ObjectID(json)}, function(){
				socket.emit('deleteteatimemenu', JSON.stringify(json + " is deleted"));

				databaseConnection.collection('teaTimeMenu', function(error, collection) {
					collection.find().sort({"_id":1}).toArray(function(err, results){
						monitorio.in('monitor').emit('teatimeallmenu', JSON.stringify(results));
					});
				});
			});
		});
	});

	socket.on('publishteatimemenu', function(data){
		var json = JSON.parse(data);

		mongoDbConnection(function(databaseConnection) {
			databaseConnection.collection('teaTimeMenu', function(error, collection) {
				collection.find({"_id" : new mongo.ObjectID(json)}).toArray(function(err, results){
					monitorio.emit('teatimemenu', JSON.stringify(results));
					socket.emit('publishteatimemenu',  JSON.stringify(json + " is published"));
				});
			});
		});
	});

	socket.on('onlineCheckInMessage', function(data){
		var json = JSON.parse(data);
		console.log('onlineCheckInMessage:' + data);

		if (json.func == 'search'){
			mongoDbConnection(function(databaseConnection) {
				databaseConnection.collection('booking', function(error, collection) {
					var cursor = collection.find({'_id' : json.bookingNo});
					var found = false;
					cursor.each(function(err, doc) {
						console.log(doc);
						if (doc != null){
							found = true;
							socket.emit('message', JSON.stringify(createJsonObject(json.func, doc)));
						}else if (!found && doc == null){
							socket.emit('message', JSON.stringify(createJsonObject(json.func, '')));
						}
					});
					
				});
			});
		}else if (json.func == 'submit'){
			console.log(data);
			mongoDbConnection(function(databaseConnection) {
				databaseConnection.collection('booking', function(error, collection) {
					collection.updateOne(
						{'_id': json.bookingNo},
						{$set : {'eta' : json.eta, 'checkinTime' : json.checkinTime}}
					)

					var cursor = collection.find({'_id' : json.bookingNo});
					cursor.each(function(err, doc) {
						console.log(doc);
						if (doc != null){
							socket.emit('message', JSON.stringify(createJsonObject(json.func, doc)));
						}
					});
				});
			});
		}
	});

	socket.on('selfCheckInMessage', function(data){
		var json = JSON.parse(data);
		console.log('selfCheckInMessage:' + data);

		if (json.func == 'confirm'){
			mongoDbConnection(function(databaseConnection) {
				databaseConnection.collection('booking', function(error, collection) {
					var cursor = collection.find({'_id' : json.bookingNo});
					cursor.each(function(err, doc) {
						console.log(doc);
						if (doc != null){
							getRoom(databaseConnection, doc, 'READY', function(room){
								if (room != null){
									setRoom(databaseConnection, room, 'CHECKIN');
									setBookingCheckinTime(databaseConnection, json.bookingNo, room._id, json.actualCheckinTime);
									socket.emit('message', JSON.stringify(createJsonObject(json.func, room)));
								}else{
									socket.emit('message', JSON.stringify(createJsonObject(json.func, '')));
								}
							});
							
						}
					});
				});
			});
		}
	});
});

function setBookingCheckinTime(databaseConnection, bookingNo, roomNo, actualCheckinTime){
	databaseConnection.collection('booking', function(error, collection) {
		collection.updateOne(
			{'_id': bookingNo},
			{$set : {'actualCheckinTime' : actualCheckinTime, 'roomNo' : roomNo}}
		)
	});
}

function getRoom(databaseConnection, booking, state, callback){
	databaseConnection.collection('room', function(error, collection) {
		var cursor = collection.find({"room" : booking.room, "suite" : booking.suite, "state" : state}).limit(1);
		
		var found = false;
		cursor.each(function(err, doc) {
			console.log("getRoom:" + doc);
			if (doc != null){
				found = true;
				callback(doc);
			}else if (doc == null && !found){
				callback(null);
			}
		});
	});
}

function setRoom(databaseConnection, room, state){
	databaseConnection.collection('room', function(error, collection) {
		collection.updateOne(
			{'_id': room._id},
			{$set : {'state' : state}}
		)
	});
}

function refreshMonitorUi(databaseConnection){
	//Reflect the state in Monitor UI
	databaseConnection.collection('room', function(error, collection) {
		collection.find().sort({"_id":1}).toArray(function(err, results){
			monitorio.in('monitor').emit('refreshroomstate', JSON.stringify(results));
		});
	});
}

function refreshRoomState(databaseConnection, json){
	//Broadcast the state to specify room
	for(var i=0; i < json.content.rooms.length; i++){
		console.log('Sent message to room:' + json.content.rooms[i].room);
		
		/*databaseConnection.collection('room', function(error, collection) {
			var cursor = collection.find({'_id' : json.content.rooms[i].room});
			cursor.each(function(err, doc) {
				if (doc != null){
					monitorio.in(doc._id).emit('room', JSON.stringify(doc));
				}
			});			
		});*/

		databaseConnection.collection('room', function(error, collection) {
			collection.find({"_id": json.content.rooms[i].room}).toArray(function(err, results){
				monitorio.in(results._id).emit('room', JSON.stringify(results));
			});
		});
	}
}

function setRoomTemp(socket, databaseConnection, json){
	databaseConnection.collection(json.content.request, function(error, collection) {
		collection.updateOne(
			{'_id': json.content.rooms[0].room},
			{
				$set : {
					temperature : json.content.rooms[0].temperature,
					humidity: json.content.rooms[0].humidity
				}
			}
		)	

		databaseConnection.collection(json.content.request, function(error, collection) {
			collection.find().sort({"_id":1}).toArray(function(err, results){
				monitorio.in('monitor').emit('message', JSON.stringify(createJsonObject('allRoomTemp', results)));
			});
		});
	});
}

function getRoomTemp(socket, databaseConnection, json){
	databaseConnection.collection('room', function(error, collection) {
		collection.find().sort({"_id":1}).toArray(function(err, results){
			socket.emit('message', JSON.stringify(createJsonObject(json.content.request, results)));
		});
	});
}

function createJsonObject(request, results){
	var json = {
		request: request,
		msgContent: results
	}

	return json;
}