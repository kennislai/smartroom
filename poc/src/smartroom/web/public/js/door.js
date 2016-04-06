var deviceNameAndId = {
	dnd: 			"dnd",
	makeuproom: 	"makeuproom",
	laundry: 		"laundry"
};


//var socket = io.connect('http://' + $("meta[name=serverAddress]").attr("content"));
var socket = io.connect('http://192.168.0.2:3006');

socket.on('connect', function(message){
	//socket.emit('join', 'MASTER-CONTROLLER-UI');

	sendSignal('STARTUP','COURTESY','','');
});

socket.on('disconnect', function(){
});

socket.on('message', function(message){
	var json = JSON.parse(message);

	for(var i=0; i < json.length; i++){
		if (json[i].type == 'COMMAND'){
			if (json[i].deviceType == 'COURTESY'){
				var id = "#" + deviceNameAndId[json[i].deviceName];
				processCourtesy(id, json[i]);
			}
		}
	}
});

function processCourtesy(id, json){
	if (json.value == "ACTIVE"){
		$(id).show();
		$(id).removeClass('btn-off');
		$(id).addClass('btn-on');
		$(id).attr('value', json.value);

	}else if (json.value == "READY" || json.value == "DISABLED"){
		$(id).show();
		$(id).removeClass('btn-on');
		$(id).addClass('btn-off');
		$(id).attr('value', json.value);

	}else if (json.value == "INACTIVE"){
		$(id).hide();
		$(id).attr('value', json.value);

	}
	if (json.deviceName == "dnd" && json.value == "ACTIVE"){
		$("#bell").hide();
	}else if (json.deviceName == "dnd" && json.value == "READY"){
		$("#bell").show();
	}
}

function sendSignal(type, deviceType, name, value){
	var jsonObj =[
		{
			type: type,
			deviceType: deviceType,
			deviceName: name,
			value: value
		}
	];

	socket.emit('message', JSON.stringify(jsonObj));
}

$(document).ready(function(){
	$.fn.initialize();

    $("#bell").click(function(){
    	sendSignal('COMMAND', 'COURTESY', 'bell', 'ACTIVE');
    	sendSignal('COMMAND', 'COURTESY', 'bell', 'READY');
    });
});

$.fn.initialize = function(){
	
};
