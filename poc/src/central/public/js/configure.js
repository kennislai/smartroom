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

var service;
var section = getUrlParameter('section');
if (section == 'donotdisturb'){
	service = 'Do Not Disturb';
	$("#doNotDisturbSection").show();
	$("#makeupRoomSection").hide();
	$("#laundrySection").hide();
	$("#doorbellSection").hide();
	$("#donotdisturbmenu").attr("class", "active");
	$("#buttonSection").show();
	
}else if (section == 'makeuproom'){
	service = 'Make-up Room'
	$("#doNotDisturbSection").hide();
	$("#makeupRoomSection").show();
	$("#laundrySection").hide();
	$("#doorbellSection").hide();
	$("#makeuproommenu").attr("class", "active");
	$("#buttonSection").show();

}else if (section == 'laundry'){
	service = 'Laundry';
	$("#doNotDisturbSection").hide();
	$("#makeupRoomSection").hide();
	$("#laundrySection").show();
	$("#doorbellSection").hide();
	$("#laundrymenu").attr("class", "active");
	$("#buttonSection").show();

}else if (section == 'bellpush'){
	service = 'Bell Push'
	$("#doNotDisturbSection").hide();
	$("#makeupRoomSection").hide();
	$("#laundrySection").hide();
	$("#doorbellSection").show();
	$("#bellpushmenu").attr("class", "active");
	$("#buttonSection").show();
}

$("#header").html("Configure Service - " + service);

var socket = io.connect('http://127.0.0.1:8088');

socket.on('connect', function(data){
	var config = {
		action: 'Get',
		content: {
			request: 'roomConfig',
			module: 'courtesies',
			service: service
		}
	};
	socket.emit('message', JSON.stringify(config));
});

socket.on('roomConfig', function(data){
	var json = JSON.parse(data);

	if (json != null & json.courtesies[0] != null) {
		if (section == 'donotdisturb'){
			$('#doNotDisturbOverrideAccessControl').attr('checked', json.courtesies[0].configurations.overrideAccessControl);
			$('#doNotDisturbLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
			$('#doNotDisturbNotifyManagementSystem').attr('checked', json.courtesies[0].configurations.notifyManagementSystem);

		}else if (section == 'makeuproom'){
			$('#makeupRoomLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
			$('#makeupRoomNotifyManagementSystem').attr('checked', json.courtesies[0].configurations.notifyManagementSystem);

		}else if (section == 'laundry'){
			$('#laundryLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
			$('#laundryNotifyManagementSystem').attr('checked', json.courtesies[0].configurations.notifyManagementSystem);

		}else if (section == 'bellpush'){
			$('#doorbellLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
			$('#doorbellNotifyBuzzer').attr('checked', json.courtesies[0].configurations.notifyBuzzer);
		}
	}
});

socket.on('update', function(data){
	$("#successNotification").show();
})

$("#save").click(function(){
	var config = {
		action: 'Set',
		content: {
			request: 'roomConfig',
			module: 'courtesies',
			service: service,
			property: 'configurations',
			value: {
			}
		}
	};

	if (section == 'donotdisturb'){
		config.content.value = {
			overrideAccessControl: $('#doNotDisturbOverrideAccessControl').is(':checked') ? true : false,
			lightOnWhenActive: $('#doNotDisturbLightOnWhenActive').is(':checked') ? true : false,
			notifyManagementSystem: $('#doNotDisturbNotifyManagementSystem').is(':checked') ? true : false
		}
	}else if (section == 'makeuproom'){
		config.content.value = {
			lightOnWhenActive: $('#makeupRoomLightOnWhenActive').is(':checked') ? true : false,
			notifyManagementSystem: $('#makeupRoomNotifyManagementSystem').is(':checked') ? true : false
		}
	}else if (section == 'laundry'){
		config.content.value = {
			lightOnWhenActive: $('#laundryLightOnWhenActive').is(':checked') ? true : false,
			notifyManagementSystem: $('#laundryNotifyManagementSystem').is(':checked') ? true : false
		}
	}else if (section == 'bellpush'){
		config.content.value = {
			lightOnWhenActive: $('#doorbellLightOnWhenActive').is(':checked') ? true : false,
			notifyBuzzer: $('#doorbellNotifyBuzzer').is(':checked') ? true : false
		}
	}

	socket.emit('update', JSON.stringify(config));
});