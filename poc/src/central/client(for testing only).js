var appserverio = require('socket.io-client')('http://127.0.0.1:8088');

var room = '101';

var message = {
	action: 'Get',
	content: {
		request: 'roomStatus'
	}
};

var config = {
	action: 'Set',
	content: {
		request: 'roomConfig',
		room: room,
		module: 'courtesies',
		service: 'Make-up Room',
		property: 'configurations',
		value: {
			lightOnWhenActive: true,
			notifyBuzzer: false
		}
	}
};

var status = {
	action: 'Set',
	content: {
		request: 'roomStatus',
		room: room,
		module: 'courtesies',
		service: 'Laundry',
		property: 'serviceState',
		value: 'INACTIVE'
	}
};

function start(){
	console.log("Join room");
	appserverio.emit('join', room);

	appserverio.emit('update', JSON.stringify(status));

	appserverio.on('message', function(data){
		console.log('From server:' + data);
	});

}

start();