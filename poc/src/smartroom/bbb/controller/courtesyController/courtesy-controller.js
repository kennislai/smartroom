var express = require('express'),
	app = express();
	server = require('http').createServer(app),
	async = require('async');

var config = require('./config.json'),
	courtesy = require('./../../device/courtesy');

var masterio,
	bbbio,
	courtesy;

async.series([
	function(callback){
	  initialize();
	  connectMaster();
	  startSlave();
	  callback();
	}],
	// optional callback
	function(err, results){
});

function initialize(){
  console.log('initialize');
  courtesy = new courtesy(config.devices);
}

function connectMaster(){
  masterio = require('socket.io-client')(config.server);

  masterio.on('connect', function(data){
	console.log('Connected to Master:' + config.server);

	for(var i=0; i < config.subscribe.length; i++){
	  masterio.emit('join', config.subscribe[i]);
	}
	//masterio.emit('message', JSON.stringify(getLatestCourtesyValue()));
	masterio.emit('refreshStatusFromState');
	
	masterio.emit('roomconfig', null);
  });

  masterio.on('roomconfig', function(data){
	console.log('roomconfig:' + data);
	courtesy.setConfig(JSON.parse(data));
  });

  masterio.on('message', function(data){
	console.log(new Date().toString() + ' - Message from Master:' + data);
	var json = JSON.parse(data);

	for(var i=0; i < json.length; i++){
		if (json[i].type == "STARTUP"){
			masterio.emit('acknowledge', JSON.stringify(getLatestCourtesyValue()));

		}else if (json[i].type == "COMMAND"){
			if (json[i].deviceType == 'COURTESY'){
				if (json[i].deviceName == 'dnd'){
					courtesy.setDndValue(json[i].value);
					overrideMakeupAndLaundryState(courtesy.getDndValue());

				}else if (json[i].deviceName == 'makeuproom'){
					courtesy.setMakeupRoomValue(json[i].value);

				}else if (json[i].deviceName == 'laundry'){
					courtesy.setLaundryValue(json[i].value);
				}
			}

			bbbio.emit('message', JSON.stringify([json[i]]));
			masterio.emit('acknowledge', JSON.stringify([json[i]]));
		}
	}
  });
}

function overrideMakeupAndLaundryState(dndValue){
	var jsonObjs = [];

	if (dndValue == 'ACTIVE'){
		if(courtesy.getMakeupRoomValue() != 'INACTIVE'){
			courtesy.setMakeupRoomValue('DISABLED');
			jsonObjs.push(createInternalMessage('makeuproom', courtesy.getMakeupRoomValue()));
		}

		if(courtesy.getLaundryValue() != 'INACTIVE'){
			courtesy.setLaundryValue('DISABLED');
			jsonObjs.push(createInternalMessage('laundry', courtesy.getLaundryValue()));
		}
	}else{
		if(courtesy.getMakeupRoomValue() != 'INACTIVE'){
			courtesy.setMakeupRoomValue('READY');
			jsonObjs.push(createInternalMessage('makeuproom', courtesy.getMakeupRoomValue()));
		}

		if(courtesy.getLaundryValue() != 'INACTIVE'){
			courtesy.setLaundryValue('READY');
			jsonObjs.push(createInternalMessage('laundry', courtesy.getLaundryValue()));
		}
	}

	if (jsonObjs.length > 0){
		bbbio.emit('message', JSON.stringify(jsonObjs));
		masterio.emit('acknowledge', JSON.stringify(jsonObjs));
	}
}

function createInternalMessage(name, value){
	var jsonObj = {
		type: "COMMAND",
		deviceType: "COURTESY",
		deviceName: name,
		value: value
	};

	return jsonObj;
}

function getLatestCourtesyValue(){
  var jsonObjs = [];

  if (courtesy.getDndValue() != null){
	jsonObjs.push({
	  type: "COMMAND",
	  deviceType: 'COURTESY',
	  deviceName: courtesy.getDndName(),
	  value: courtesy.getDndValue()
	});
  }

  if (courtesy.getMakeupRoomValue() != null){
	jsonObjs.push({
	  type: "COMMAND",
	  deviceType: 'COURTESY',
	  deviceName: courtesy.getMakeupRoomName(),
	  value: courtesy.getMakeupRoomValue()
	});
  }

  if (courtesy.getLaundryValue() != null){
	jsonObjs.push({
	  type: "COMMAND",
	  deviceType: 'COURTESY',
	  deviceName: courtesy.getLaundryName(),
	  value: courtesy.getLaundryValue()
	});
  }

  return jsonObjs;
}

function startSlave(){
  bbbio = require('socket.io')(server).listen(config.port);
  console.log('Start Slave with port:' + config.port);

  bbbio.on('connection', function(socket){
	console.log('client connected:' + socket.request.connection.remoteAddress);

	socket.on('message', function(data){
		console.log("courtesy-controller - Signal Received:" + data);
	  	var json = JSON.parse(data);

		for(var i=0; i < json.length; i++){
			if(json[i].type == 'STARTUP'){
				socket.emit('message', JSON.stringify(getLatestCourtesyValue()));

			}else if(json[i].type == 'COMMAND'){
				if (json[i].deviceType == 'COURTESY'){
					console.log(json[i].deviceName + ':' + json[i].value);
					if (json[i].deviceName == 'dnd'){
						courtesy.setDndValue(json[i].value);
						overrideMakeupAndLaundryState(courtesy.getDndValue());

					}else if (json[i].deviceName == 'makeuproom'){
						courtesy.setMakeupRoomValue(json[i].value);

					}else if (json[i].deviceName == 'laundry'){
						courtesy.setLaundryValue(json[i].value);

					}else if (json[i].deviceName == 'bell'){
						courtesy.setBellValue(json[i].value);
					}
				}

				bbbio.in('COURTESY-CONTROLLER-UI').emit('message', JSON.stringify([json[i]]));
				masterio.emit('message', JSON.stringify([json[i]]));
			}
		}
	});

	socket.on('disconnect', function(){
	  console.log('client disconnected:' + socket.request.connection.remoteAddress);
	});
  });
}
