socket.on('connect', function(message) {
	socket.emit('join', 'MASTER-CONTROLLER-UI');
	sendSignal('SERVICE', 'SELFSERVICE', 'WAKEUPCALL', 'GET');
});


socket.on('message', function(message) {
	var json = JSON.parse(message);



	for (var i = 0; i < json.length; i++) {
		var id = "#" + json[i].deviceName;

		if (json[i].type == 'SERVICE' && json[i].deviceType == "SELFSERVICE" && json[i].deviceName == "WAKEUPCALL") {
			var wakeupCallObj = JSON.parse(json[i].value);
			if (wakeupCallObj.length > 0)
				wakeupCallObj = wakeupCallObj[0];

			$("#wakeupcallhour").val(wakeupCallObj.time.split(':')[0]);
			$("#wakeupcallminute").val(wakeupCallObj.time.split(':')[1]);

			if (wakeupCallObj.power == "ON"){
				$("#wakeupcallonoff").prop('checked', true);
				$("#wakeupcallonoff").bootstrapSwitch('state', true, true);
			}else{
				$("#wakeupcallonoff").prop('checked', false);
				$("#wakeupcallonoff").bootstrapSwitch('state', false, true);
			}
		}
	}
});

function wakeupcall_initialize() {
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

	$("#wakeupcallonoff").on('switchChange.bootstrapSwitch', function(event, data) {
		var json = {
				power: "",
				time: $("#wakeupcallhour").val() + ":" + $("#wakeupcallminute").val()
			};

		if ($("#wakeupcallonoff").prop('checked')){
			json.power = "ON";
		}else{
			json.power = "OFF";
		}

		sendSignal("SERVICE", "SELFSERVICE", "WAKEUPCALL", JSON.stringify(json));
	});

	$("#wakeupcallhour").change(function() {
		if ($("#wakeupcallhour").val().length == 1){
			$("#wakeupcallhour").val("0" + $("#wakeupcallhour").val());
		}

		var json = {
				power: $("#wakeupcallonoff").prop('checked')? 'ON' : 'OFF',
				time: $("#wakeupcallhour").val() + ":" + $("#wakeupcallminute").val()
		};
		sendSignal("SERVICE", "SELFSERVICE", "WAKEUPCALL", JSON.stringify(json));
	});

	$("#wakeupcallminute").change(function() {
		if ($("#wakeupcallminute").val().length == 1){
			$("#wakeupcallminute").val("0" + $("#wakeupcallminute").val());
		}

		var json = {
				power: $("#wakeupcallonoff").prop('checked')? 'ON' : 'OFF',
				time: $("#wakeupcallhour").val() + ":" + $("#wakeupcallminute").val()
		};
		sendSignal("SERVICE", "SELFSERVICE", "WAKEUPCALL", JSON.stringify(json));
	});

	$("#addHour").click(function() {
		if (parseInt($("#wakeupcallhour").val()) < 23){
			$("#wakeupcallhour").val(parseInt($("#wakeupcallhour").val()) + 1);
			$("#wakeupcallhour").change();
		}
	});

	$("#addMinute").click(function() {
		if (parseInt($("#wakeupcallminute").val()) < 59){
			$("#wakeupcallminute").val(parseInt($("#wakeupcallminute").val()) + 1);
			$("#wakeupcallminute").change();
		}
	});
	
	$("#minusHour").click(function() {
		if (parseInt($("#wakeupcallhour").val()) > 0){
			$("#wakeupcallhour").val(parseInt($("#wakeupcallhour").val()) - 1);
			$("#wakeupcallhour").change();
		}
	});

	$("#minusMinute").click(function() {
		if (parseInt($("#wakeupcallminute").val()) > 0){
			$("#wakeupcallminute").val(parseInt($("#wakeupcallminute").val()) - 1);
			$("#wakeupcallminute").change();
		}
	});
}