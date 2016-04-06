var socket = io.connect('http://127.0.0.1:8088');
var servicecheckboxcount = 0, 
	floorcheckboxcount = 0,
	roomcheckboxcount = 0,
	checkboxcount = 0;

socket.on('connect', function(data){
	var config = {
		action: 'Get',
		content: {
			request: 'roomConfig',
			module: 'courtesies'
		}
	};
	socket.emit('message', JSON.stringify(config));

	var status = {
		action: 'Get',
		content: {
			request: 'roomStatus',
			module: 'courtesies'
		}
	};
	socket.emit('message', JSON.stringify(status));
});

socket.on('allRoomConfig', function(data){
	var json = JSON.parse(data);
	
	$("#roomConfig").html('');
	$("#roomConfig").append("<table>");
	$("#roomConfig").append("<tr><td></td><td><b>Service</b></td><td><b>State</b></td></tr>");
	checkboxcount = json[0].courtesies.length;
	for(var i=0; i < json[0].courtesies.length; i++){
		$("#roomConfig").append("<tr><td><input type='checkbox' id='checkbox" + i + "' value='" + json[0].courtesies[i].service + "'></td><td>" + json[0].courtesies[i].service + "</td><td><select id='select" + i + "'><option value='ACTIVE'>ACTIVE</option><option value='DISABLED'>DISABLED</option><option value='INACTIVE'>INACTIVE</option><option value='READY'>READY</option></select></td></tr>");
	}
	$("#roomConfig").append("</table>");
});


socket.on('allRoomStatus', function(data){
	var json = JSON.parse(data);
	var floorList = [];
	var floor;

	$("#roomList").html('');
	roomcheckboxcount = json.length;
	for(var i=0; i < json.length; i++){
		$("#roomList").append(" <input type='checkbox' id='roomcheckbox" + i + "' value='" + json[i]._id + "'>" + json[i]._id);

		floor = json[i]._id > 1000 ? json[i]._id.toString().substring(0,2) : json[i]._id.toString().substring(0,1);
		
		if ($.inArray(floor, floorList) == -1){
			floorList.push(floor);
		}
	}

	$('#floorList').html('');
	floorcheckboxcount = floorList.length;
	for(var i=0; i < floorList.length; i++){
		$("#floorList").append(" <input type='checkbox' id='floorcheckbox" + i + "' value='" + getRoomListByFloor(json, floorList[i]) + "'>" + floorList[i] + "/F");
	}
	
});

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

function getServiceState(){
	var room = [];

	for(var i=0; i < checkboxcount; i++){
		if ($("#checkbox" + i).prop('checked')){
			room.push(
				{
					service: $("#checkbox" + i).val(),
					serviceState: $("#select" + i).val()
				}
			);
		}
	}
	
	return room;
}

$("#save").click(function(){
	var status = {
		action: 'Set',
		content: {
			request: 'roomStatus',
			module: 'courtesies',
			rooms: []
		}
	};

	if ($("#floorradio").prop('checked')){
		for(var i=0; i < floorcheckboxcount; i++){
			if ($("#floorcheckbox" + i).prop('checked')){
				for( var j=0; j < $("#floorcheckbox" + i).val().split(',').length; j++){
					status.content.rooms.push({
						room: $("#floorcheckbox" + i).val().split(',')[j], 
						courtesies : getServiceState()
					});	
				}
			}
		}

	}else if ($("#roomradio").prop('checked')){
		for(var i=0; i < roomcheckboxcount; i++){
			if ($("#roomcheckbox" + i).prop('checked')){
				status.content.rooms.push({
					room: $("#roomcheckbox" + i).val(), 
					courtesies : getServiceState()
				});	
			}
			
		}

	}else if ($("#allroomsradio").prop('checked')){
		for(var i=0; i < roomcheckboxcount; i++){	
			status.content.rooms.push({
				room: $("#roomcheckbox" + i).val(), 
				courtesies : getServiceState()
			});	
		}
	}

	socket.emit('update', JSON.stringify(status));
});

socket.on('update', function(data){
	$("#successNotification").show();
})