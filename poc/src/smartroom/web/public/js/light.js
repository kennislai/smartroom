socket.on('connect', function(message) {
	socket.emit('join', 'MASTER-CONTROLLER-UI');

	sendSignal('STARTUP', 'LIGHT', 'doghouselight', '');
	sendSignal('STARTUP', 'LIGHTING', 'dimmerlight', '');
});

socket.on('message', function(message) {
	var json = JSON.parse(message);
	
	for (var i = 0; i < json.length; i++) {
		if (json[i].type == 'COMMAND') {
			if (json[i].deviceType == 'LIGHTING' || json[i].deviceType == 'LIGHT') {
				var id = "#" + deviceNameAndId[json[i].deviceName];
				processLightOnOff(id, json[i]);
			}

		} else if (json[i].type == 'DIMMING') {
			if (json[i].deviceType == 'LIGHTING') {
				var id = "#" + deviceNameAndId[json[i].deviceName];
				$(id + 'slider').slider('setValue', parseInt(json[i].value));
			}
		}
	}
});

function processLightOnOff(id, json) {
	if (json.value != null && json.value != "0") {
		$(id).prop('checked', true);
		$(id).bootstrapSwitch('state', true, true);
		$(id + 'icon').removeClass('l_c_off');
		$(id + 'icon').addClass('l_c_on');

	} else if (json.value == "0") {
		$(id).prop('checked', false);
		$(id).bootstrapSwitch('state', false, true);
		$(id + 'icon').removeClass('l_c_on');
		$(id + 'icon').addClass('l_c_off');
	}
}

function light_initialize() {
	$('#dimmerlightslider').slider({
		formater: function (value) {
			return 'Current value: ' + value;
		},
		min: 1,
		max: 10
		//handle: 'square'
	});

	$('#dimmerlightslider').on('slide', function(slideEvt){
		sendSignal('DIMMING', 'LIGHTING', 'dimmerlight', slideEvt.value);
	});

	var options = {
		size: 'mini',
		onColor: 'success',
		offColor: 'default',
		//onText: '',
		//offText: '',
		animate: true,
		handleWidth: 20,
		labelWidth: 20
	};

	$('[name^=switch]').bootstrapSwitch(options);
	//$.fn.bootstrapSwitch.defaults.onColor = 'success';

	$("#doghouselight").on('switchChange.bootstrapSwitch', function(event, data) {
		if ($("#doghouselight").prop('checked')) {
			sendSignal('COMMAND', 'LIGHT', 'doghouselight', '1');
		} else {
			sendSignal('COMMAND', 'LIGHT', 'doghouselight', '0');
		}
		sendSignal('RESET_TIMER', 'MOTION_SENSOR_PIR', 'motionSensorPIR_1', null);
	});

	$("#dimmerlight").on('switchChange.bootstrapSwitch', function(event, data) {
		if ($("#dimmerlight").prop('checked')) {
			sendSignal('COMMAND', 'LIGHTING', 'dimmerlight', '1');
		} else {
			sendSignal('COMMAND', 'LIGHTING', 'dimmerlight', '0');
		}
	});
}

