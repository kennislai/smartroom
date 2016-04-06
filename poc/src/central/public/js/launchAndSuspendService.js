var socket = io.connect('ws://' + $("#serverAddress").text());
var floorcheckboxcount = 0,
	roomcheckboxcount = 0,
	courtesyCheckboxcount = 0,
	lightingCheckboxcount = 0,
	selfServiceCheckboxcount = 0;

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
});

socket.emit('getroomconfig', null);
socket.emit('getallroom', null);

socket.on('allroom', function(data){
	var json = JSON.parse(data);

	var floorList = [];
	var floor;

	$("#roomList").html('');
	roomcheckboxcount = json.length;
	for(var i=0; i < roomcheckboxcount; i++){
		$("#roomList").append(" <input type='checkbox' id='roomcheckbox" + i + "' value='" + json[i]._id + "' onclick='checkRadioButton(\"room\")'>" + json[i]._id);

		floor = json[i]._id > 1000 ? json[i]._id.toString().substring(0,2) : json[i]._id.toString().substring(0,1);
		
		if ($.inArray(floor, floorList) == -1){
			floorList.push(floor);
		}
	}

	$('#floorList').html('');
	floorcheckboxcount = floorList.length;
	for(var i=0; i < floorList.length; i++){
		$("#floorList").append(" <input type='checkbox' id='floorcheckbox" + i + "' value='" + getRoomListByFloor(json, floorList[i]) + "' onclick='checkRadioButton(\"floor\")'>" + floorList[i] + "/F");
	}
})

socket.on('roomconfig', function(data){
	var json = JSON.parse(data);
	json = json[0];

	$('#courtesyConfig').find("tr:gt(0)").remove();
	courtesyCheckboxcount = json.courtesies.length;
	for(var i=0; i < json.courtesies.length; i++){
		$('#courtesyConfig tr:last').after("<tr><td><input type='checkbox' id='courtesyCheckbox" + i + "' value='" + json.courtesies[i].service + "'></td><td>" + courtesyName[json.courtesies[i].service] + "</td><td><input type='radio' name='courtesyState" + i + "' value='READY' checked>Ready <input type='radio' name='courtesyState" + i + "' value='INACTIVE'>Inactive</td></tr>");
	}

	$('#lightingConfig').find("tr:gt(0)").remove();
	lightingCheckboxcount = json.lighting.length;
	for(var i=0; i < json.lighting.length; i++){
		$('#lightingConfig tr:last').after("<tr><td><input type='checkbox' id='lightingCheckbox" + i + "' value='" + json.lighting[i].type + "'></td><td>" + lightingName[json.lighting[i].type] + "</td><td><input type='radio' name='lightingState" + i + "' value='READY' checked>Ready <input type='radio' name='lightingState" + i + "' value='INACTIVE'>Inactive</td></tr>");
	}

	$('#selfServiceConfig').find("tr:gt(0)").remove();
	selfServiceCheckboxcount = json.selfservice.length;
	for(var i=0; i < json.selfservice.length; i++){
		$('#selfServiceConfig tr:last').after("<tr><td><input type='checkbox' id='selfServiceCheckbox" + i + "' value='" + json.selfservice[i].service + "'></td><td>" + selfserviceName[json.selfservice[i].service] + "</td><td><input type='radio' name='selfServiceState" + i + "' value='READY' checked>Ready <input type='radio' name='selfServiceState" + i + "' value='INACTIVE'>Inactive</td></tr>");
	}

	$('#hvacConfig').find("tr:gt(0)").remove();
	$('#hvacConfig tr:last').after("<tr><td><input type='checkbox' id='hvacCheckbox' value='hvac'></td><td><input type='radio' name='hvacState' value='READY' checked>Ready <input type='radio' name='hvacState' value='INACTIVE'>Inactive</td></tr>");

	$('#tvConfig').find("tr:gt(0)").remove();
	$('#tvConfig tr:last').after("<tr><td><input type='checkbox' id='tvCheckbox' value='tv'></td><td><input type='radio' name='tvState' value='READY' checked>Ready <input type='radio' name='tvState' value='INACTIVE'>Inactive</td></tr>");

	$('#curtainConfig').find("tr:gt(0)").remove();
	$('#curtainConfig tr:last').after("<tr><td><input type='checkbox' id='curtainCheckbox' value='curtain'></td><td><input type='radio' name='curtainState' value='READY' checked>Ready <input type='radio' name='curtainState' value='INACTIVE'>Inactive</td></tr>");
	
});

function checkRadioButton(value){
	if (value == 'room'){
		$("#roomradio").prop("checked", true);
	}else if (value == 'floor'){
		$("#floorradio").prop("checked", true);
	}
}

function getRoomListByFloor(roomList, floor){
	var rooms = [];

	for(var i=0; i < roomList.length; i++){
		var tempRoom = roomList[i]._id > 1000 ? roomList[i]._id.toString().substring(0,2) : roomList[i]._id.toString().substring(0,1);
		
		if (tempRoom == floor){
			rooms.push(roomList[i]._id);
		}
	}

	return rooms.toString();
}

function getCourtesiesState(){
	var room = [];

	for(var i=0; i < courtesyCheckboxcount; i++){
		if ($("#courtesyCheckbox" + i).prop('checked')){
			room.push(
				{
					service: $("#courtesyCheckbox" + i).val(),
					state: $("input[name=courtesyState" + i + "]:checked").val()
				}
			);
		}
	}
	
	return room;
}

function getLightingState(){
	var room = [];

	for(var i=0; i < lightingCheckboxcount; i++){
		if ($("#lightingCheckbox" + i).prop('checked')){
			room.push(
				{
					type: $("#lightingCheckbox" + i).val(),
					state: $("input[name=lightingState" + i + "]:checked").val()
				}
			);
		}
	}
	
	return room;
}

function getSelfServiceState(){
	var room = [];

	for(var i=0; i < selfServiceCheckboxcount; i++){
		if ($("#selfServiceCheckbox" + i).prop('checked')){
			room.push(
				{
					service: $("#selfServiceCheckbox" + i).val(),
					state: $("input[name=selfServiceState" + i + "]:checked").val()
				}
			);
		}
	}
	
	return room;
}

function getHvacState(){
	var room = [];

	if ($("#hvacCheckbox").prop('checked')){
		room.push({ state: $("input[name=hvacState]:checked").val() });
	}
	
	return room;
}

function getTvState(){
	var room = [];

	if ($("#tvCheckbox").prop('checked')){
		room.push({ state: $("input[name=tvState]:checked").val() });
	}
	
	return room;
}

function getCurtainState(){
	var room = [];

	if ($("#curtainCheckbox").prop('checked')){
		room.push({ state: $("input[name=curtainState]:checked").val() });
	}
	
	return room;
}

$("#save").click(function(){
	var state = {
		content: {
			rooms: []
		}
	};

	if ($("#floorradio").prop('checked')){
		for(var i=0; i < floorcheckboxcount; i++){
			if ($("#floorcheckbox" + i).prop('checked')){
				for( var j=0; j < $("#floorcheckbox" + i).val().split(',').length; j++){
					state.content.rooms.push({
						room: $("#floorcheckbox" + i).val().split(',')[j], 
						courtesies : getCourtesiesState(),
						lighting: getLightingState(),
						selfservice: getSelfServiceState(),
						hvac: getHvacState(),
						tv: getTvState(),
						curtain: getCurtainState()
					});	
				}
			}
		}

	}else if ($("#roomradio").prop('checked')){
		for(var i=0; i < roomcheckboxcount; i++){
			if ($("#roomcheckbox" + i).prop('checked')){
				state.content.rooms.push({
					room: $("#roomcheckbox" + i).val(), 
					courtesies : getCourtesiesState(),
					lighting: getLightingState(),
					selfservice: getSelfServiceState(),
					hvac: getHvacState(),
					tv: getTvState(),
					curtain: getCurtainState()
				});	
			}
			
		}

	}else if ($("#allroomsradio").prop('checked')){
		for(var i=0; i < roomcheckboxcount; i++){	
			state.content.rooms.push({
				room: $("#roomcheckbox" + i).val(), 
				courtesies : getCourtesiesState(),
				lighting: getLightingState(),
				selfservice: getSelfServiceState(),
				hvac: getHvacState(),
				tv: getTvState(),
				curtain: getCurtainState()
			});	
		}
	}

	socket.emit('setroomservicelaunchandsuspendstate', JSON.stringify(state));
});

socket.on('updateResult', function(data){
	$("#successNotification").show();
	window.scrollTo(0,0);
})