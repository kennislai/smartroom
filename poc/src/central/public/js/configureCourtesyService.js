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

var section = getUrlParameter('section');
if (section == 'dnd'){
	$("#doNotDisturbSection").show();
	$("#makeupRoomSection").hide();
	$("#laundrySection").hide();
	$("#doorbellSection").hide();
	$("#buttonSection").show();
	
}else if (section == 'makeuproom'){
	$("#doNotDisturbSection").hide();
	$("#makeupRoomSection").show();
	$("#laundrySection").hide();
	$("#doorbellSection").hide();
	$("#buttonSection").show();

}else if (section == 'laundry'){
	$("#doNotDisturbSection").hide();
	$("#makeupRoomSection").hide();
	$("#laundrySection").show();
	$("#doorbellSection").hide();
	$("#buttonSection").show();

}else if (section == 'bell'){
	$("#doNotDisturbSection").hide();
	$("#makeupRoomSection").hide();
	$("#laundrySection").hide();
	$("#doorbellSection").show();
	$("#buttonSection").show();
}

$("#header").html("Configure Service - " + courtesyName[section]);

var socket = io.connect('ws://' + $("#serverAddress").text());

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
	
	var config = {
		content: {
			module: 'courtesies',
			service: section
		}
	};
	socket.emit('getroomconfig', JSON.stringify(config));
});

socket.on('roomconfig', function(data){
	var json = JSON.parse(data);


	if (section == 'dnd'){
		$('#doNotDisturbOverrideAccessControl').attr('checked', json.courtesies[0].configurations.overrideAccessControl);
		$('#doNotDisturbLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
		$('#doNotDisturbNotifyManagementSystem').attr('checked', json.courtesies[0].configurations.notifyManagementSystem);

	}else if (section == 'makeuproom'){
		$('#makeupRoomLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
		$('#makeupRoomNotifyManagementSystem').attr('checked', json.courtesies[0].configurations.notifyManagementSystem);

	}else if (section == 'laundry'){
		$('#laundryLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
		$('#laundryNotifyManagementSystem').attr('checked', json.courtesies[0].configurations.notifyManagementSystem);

	}else if (section == 'bell'){
		$('#doorbellLightOnWhenActive').attr('checked', json.courtesies[0].configurations.lightOnWhenActive);
		$('#doorbellNotifyBuzzer').attr('checked', json.courtesies[0].configurations.notifyBuzzer);
	}

});

socket.on('updateResult', function(data){
	$("#successNotification").show();
})

$("#save").click(function(){
	var config = {
		content: {
			module: 'courtesies',
			service: section,
			property: 'configurations',
			value: {
			}
		}
	};

	if (section == 'dnd'){
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
	}else if (section == 'bell'){
		config.content.value = {
			lightOnWhenActive: $('#doorbellLightOnWhenActive').is(':checked') ? true : false,
			notifyBuzzer: $('#doorbellNotifyBuzzer').is(':checked') ? true : false
		}
	}

	socket.emit('setroomconfig', JSON.stringify(config));
});