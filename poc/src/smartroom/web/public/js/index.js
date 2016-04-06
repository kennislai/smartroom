//var socket = io.connect('http://' + $("meta[name=serverAddress]").attr("content"));
var deviceNameAndId = {
	dnd: "dnd",
	makeuproom: "makeuproom",
	laundry: "laundry",
	doghouselight: 'doghouselight',
	dimmerlight: 'dimmerlight',
	airCon: "ac",
  	heater: "heater",
  	fan: "fanSpeed"
};


var socket = io.connect('http://192.168.0.3:3002');

socket.on('disconnect', function() {});

socket.on('connect', function(message) {
	socket.emit('join', 'MASTER-CONTROLLER-UI');
	sendSignal('STARTUP', 'COURTESY', '', '');
});

socket.on('message', function(message) {
	var json = JSON.parse(message);


	for (var i = 0; i < json.length; i++) {
		if (json[i].type == 'COMMAND') {
			if (json[i].deviceType == 'COURTESY') {
				var id = "#" + deviceNameAndId[json[i].deviceName];
				processCourtesy(id, json[i]);
			}
		} 
	}
});

function processCourtesy(id, json) {

	if (json.value == "ACTIVE" && $(id).attr('value') != 'INACTIVE') {
		$(id).show();
		$(id).removeClass('btn-off');
		$(id).addClass('btn-on');
		$(id).attr('disabled', false);

	} else if (json.value == "READY") {
		$(id).show();
		$(id).removeClass('btn-on');
		$(id).addClass('btn-off');

		$(id).attr('disabled', false);

	} else if (json.value == "INACTIVE" && $(id).attr('value') != 'INACTIVE') {
		$(id).hide();

	} else if (json.value == "DISABLED" && $(id).attr('value') != 'INACTIVE') {
		$(id).show();
		$(id).removeClass('btn-on');
		$(id).removeClass('btn-off');
		$(id).attr('disabled', 'disabled');
	}

	$(id).attr('value', json.value);
}

function sendSignal(type, deviceType, name, value) {
	var jsonObj = [{
		type: type,
		deviceType: deviceType,
		deviceName: name,
		value: value
	}];

	socket.emit('message', JSON.stringify(jsonObj));
}

function courtesy_initialize() {
	$("#power").click(function() {
		if ($("#power").val() == "0"){
			sendSignal('COMMAND', 'LIGHT', 'doghouselight', '1');
			sendSignal('COMMAND', 'LIGHTING', 'dimmerlight', '1');
			$("#power").val("1");
		}else{
			sendSignal('COMMAND', 'LIGHT', 'doghouselight', '0');
			sendSignal('COMMAND', 'LIGHTING', 'dimmerlight', '0');
			$("#power").val("0");
		}
	});

	$("#dnd").click(function() {
    	if ($("#dnd").attr('value') == "READY") {
      		sendSignal('COMMAND', 'COURTESY', 'dnd', 'ACTIVE');
    	} else {
    		
      		sendSignal('COMMAND', 'COURTESY', 'dnd', 'READY');
    	}
  	});

  	$("#makeuproom").click(function() {
    	if ($("#makeuproom").attr('value') == "READY") {
      		sendSignal('COMMAND', 'COURTESY', 'makeuproom', 'ACTIVE');
		} else {
      		sendSignal('COMMAND', 'COURTESY', 'makeuproom', 'READY');
    	}
  	});

  	$("#laundry").click(function() {
    	if ($("#laundry").attr('value') == "READY") {
      		sendSignal('COMMAND', 'COURTESY', 'laundry', 'ACTIVE');
    	} else {
      		sendSignal('COMMAND', 'COURTESY', 'laundry', 'READY');
		}
  	});
}