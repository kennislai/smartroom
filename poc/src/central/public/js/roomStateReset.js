var socket = io.connect('ws://' + $("#serverAddress").text());
var json;

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var id = getUrlParameter('id');

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
});

socket.emit('getroomdefaultsetting', id);

socket.on('roomdefaultsetting', function(data){
	json = JSON.parse(data);
	showDetail(id);
});

function showDetail(objectId){

	for(var i=0; i < json.length; i++){
		if (json[i]._id == objectId){
			$('#detailRoomNumber').html(json[i]._id);
			$("#detailRoomState").html(stateName[json[i].state]);
			$('#detailRoom').html(json[i].room);
			$('#detailSuite').html(json[i].suite);

			$('#detailCourtesyConfig').find("tr:gt(0)").remove();
			for(var j=0; j < json[i].courtesies.length; j++){
				$('#detailCourtesyConfig tr:last').after("<tr><td><b>" + courtesyName[json[i].courtesies[j].service] + "</b></td><td>" + stateName[json[i].courtesies[j].state] + "</td></tr>");
			}

			$('#detailLightingConfig').find("tr:gt(0)").remove();
			for(var j=0; j < json[i].lighting.length; j++){
				if (json[i].lighting[j].dimmable == 'true')
					$('#detailLightingConfig tr:last').after("<tr><td><b>" + lightingName[json[i].lighting[j].type] + "</b></td><td>" + lightingDimmableName[json[i].lighting[j].dimmable] + "</td><td>" + stateName[json[i].lighting[j].state] + "</td><td>" +  json[i].lighting[j].power + "</td><td>" + json[i].lighting[j].dimming + "</td></tr>");
				else
					$('#detailLightingConfig tr:last').after("<tr><td><b>" + lightingName[json[i].lighting[j].type] + "</b></td><td>" + lightingDimmableName[json[i].lighting[j].dimmable] + "</td><td>" + stateName[json[i].lighting[j].state] + "</td><td>" +  json[i].lighting[j].power + "</td><td></td></tr>");
			}

			$('#detailSelfServiceConfig').find("tr:gt(0)").remove();
			for(var j=0; j < json[i].selfservice.length; j++){
				$('#detailSelfServiceConfig tr:last').after("<tr><td><b>" + selfserviceName[json[i].selfservice[j].service] + "</b></td><td>" + stateName[json[i].selfservice[j].state] + "</td></tr>");
			}

			$("#detailHvacState").html(stateName[json[i].hvac.state]);
			$("#detailHvacMode").html(hvacModeName[json[i].hvac.mode]);
			$("#detailHvacFanSpeed").html(hvacFanspeedName[json[i].hvac.fanspeed]);
			$("#detailHvacAcTemperature").html(json[i].hvac.temperature.ac +  " \xb0C");
			$("#detailHvacHeaterTemperature").html(json[i].hvac.temperature.heater +  " \xb0C");
			

			$("#detailCurtainState").html(stateName[json[i].curtain.state]);
			$("#detailCurtainMode").html(curtainModeName[json[i].curtain.mode]);

			$("#detailTvState").html(stateName[json[i].tv.state]);
		}
	}
	
}

$("#detailReset").click(function(){
	var userConfirm = confirm('Are you sure to reset the room to default setting?');

	if (userConfirm){
		var state = {
			content: {
				rooms: [{ room: $('#detailRoomNumber').html() }]
			}
		};

		socket.emit('resetroomstate', JSON.stringify(state));
	}
});

$("#detailBack").click(function(){
	window.location = "/roomState";
});

socket.on('updateResult', function(data){
	$("#successNotification").show();
	window.scrollTo(0,0);
})