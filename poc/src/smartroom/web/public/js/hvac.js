const AC_TEMP_MAX = 50;
const AC_TEMP_MIN = 0;

const HEATER_TEMP_MAX = 50;
const HEATER_TEMP_MIN = 0;

const TEMP_INTERVAL = 1;
const FAN_INTERVAL = 33.33;

socket.on('connect', function(message) {
	socket.emit('join', 'MASTER-CONTROLLER-UI');

	sendSignal('STARTUP', 'HVAC', 'hvac1', '');
	sendSignal('READ', 'TEMPERATURE_SENSOR', 'temperatureSensor', null);
});

socket.on('message', function(message) {
	var json = JSON.parse(message);
	//alert(message);
	for (var i = 0; i < json.length; i++) {

		if (json[i].type == 'COMMAND') {
			if (json[i].deviceType == 'HVAC') {
				var id = "#" + deviceNameAndId[json[i].deviceName.split('-')[1]];
				processHVACPower(id, json[i]);
			} else if (json[i].deviceType == 'TEMPERATURE_SENSOR') {
				$('#roomTemp').html(json[i].value + '\xb0C');
			} else if (json[i].deviceType == 'HUMIDITY_SENSOR') {
				$('#roomHum').html(json[i].value + '%');
			} 
		
		}else if (json[i].type == 'TEMPERATURE') {
			if (json[i].deviceType == 'HVAC') {
				var id = "#" + deviceNameAndId[json[i].deviceName.split('-')[1]];
	    		$(id + 'temp').html(json[i].value);
	    	}
		}	
	}
});

function processHVACPower(id, json) {
	id += 'power';

	if (json.value != "0") {
		$(id).prop('checked', true);
		$(id).bootstrapSwitch('state', true, true);
	} else {
		$(id).prop('checked', false);
		$(id).bootstrapSwitch('state', false, true);
	}
}

function hvac_initialize() {
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
	$('[name^=switch]').bootstrapSwitch();

	$("#actempup").click(function() {
		var current = parseInt($("#actemp").html());

		if (current < AC_TEMP_MAX) {
			current += TEMP_INTERVAL;
			$("#actemp").html(current);
			sendSignal('TEMPERATURE', 'HVAC', 'hvac1-airCon', current);
		}		
	});

	$("#actempdown").click(function() {
		var current = parseInt($("#actemp").html());

		if (current > AC_TEMP_MIN) {
			current -= TEMP_INTERVAL;
			$("#actemp").html(current);
			sendSignal('TEMPERATURE', 'HVAC', 'hvac1-airCon', current);
		}		
	});

	$("#acpower").on('switchChange.bootstrapSwitch', function(event, data) {
		if ($("#acpower").prop('checked')) {
			sendSignal('COMMAND', 'HVAC', 'hvac1-airCon', 1);
			sendSignal('UPDATE_REFRESH_INTERVAL', 'TEMPERATURE_SENSOR', 'temperatureSensor', 3000);

			if ($("#heaterpower").prop('checked')) {
				sendSignal('COMMAND', 'HVAC', 'hvac1-heater', 0);
			}
		} else {
			sendSignal('COMMAND', 'HVAC', 'hvac1-airCon', 0);
			sendSignal('UPDATE_REFRESH_INTERVAL', 'TEMPERATURE_SENSOR', 'temperatureSensor', 30000);

			
		}
	});

	$("#heatertempup").click(function() {
		var current = parseInt($("#heatertemp").html());

		if (current < HEATER_TEMP_MAX) {
			current += TEMP_INTERVAL;
			$("#heatertemp").html(current);
			sendSignal('TEMPERATURE', 'HVAC', 'hvac1-heater', current);
		}
		
	});

	$("#heatertempdown").click(function() {
		var current = parseInt($("#heatertemp").html());

		if (current > HEATER_TEMP_MIN) {
			current -= TEMP_INTERVAL;
			$("#heatertemp").html(current);
			sendSignal('TEMPERATURE', 'HVAC', 'hvac1-heater', current);
		}
	});

	$("#heaterpower").on('switchChange.bootstrapSwitch', function(event, data) {
		if ($("#heaterpower").prop('checked')) {
			sendSignal('COMMAND', 'HVAC', 'hvac1-heater', 1);
			sendSignal('UPDATE_REFRESH_INTERVAL', 'TEMPERATURE_SENSOR', 'temperatureSensor', 3000);

			if ($("#acpower").prop('checked')) {
				sendSignal('COMMAND', 'HVAC', 'hvac1-airCon', 0);
			}
		} else {
			sendSignal('COMMAND', 'HVAC', 'hvac1-heater', 0);
			sendSignal('UPDATE_REFRESH_INTERVAL', 'TEMPERATURE_SENSOR', 'temperatureSensor', 30000);

			
		}
	});
}

