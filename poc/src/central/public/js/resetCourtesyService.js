var socket = io.connect('http://127.0.0.1:8088');
var servicecheckboxcount = 0, 
	floorcheckboxcount = 0,
	roomcheckboxcount = 0;
var jsonDefaultSetting;

socket.on('connect', function(data){
	var config = {
		action: 'Get',
		content: {
			request: 'roomDefaultSetting',
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

socket.on('roomDefaultSetting', function(data){
	jsonDefaultSetting = JSON.parse(data);
	
	$("#roomDefaultSetting").html('');
	$("#roomDefaultSetting").append("<table>");
	$("#roomDefaultSetting").append("<tr><th colsapn='2'>Default Setting</th></tr>");
	$("#roomDefaultSetting").append("<tr><td><b>Service</b></td><td><b>State</b></td></tr>");
	for(var i=0; i < jsonDefaultSetting[0].courtesies.length; i++){
		$("#roomDefaultSetting").append("<tr><td>" + jsonDefaultSetting[0].courtesies[i].service + "</td><td>" + jsonDefaultSetting[0].courtesies[i].serviceState + "</td></tr>");
	}
	$("#roomDefaultSetting").append("</table>");
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

	for(var i=0; i < jsonDefaultSetting[0].courtesies.length; i++){
		room.push(
			{
				service: jsonDefaultSetting[0].courtesies[i].service,
				serviceState: jsonDefaultSetting[0].courtesies[i].serviceState
			}
		);
	}
	
	return room;
}

$("#reset").click(function(){
	var userConfirm = confirm('Are you sure to reset the state?');

	if (userConfirm){
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
	}
});

socket.on('update', function(data){
	$("#successNotification").show();
})