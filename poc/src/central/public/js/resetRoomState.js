var socket = io.connect('ws://' + $("#serverAddress").text());
var floorcheckboxcount = 0,
	roomcheckboxcount = 0;

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
});

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

$("#reset").click(function(){
	var userConfirm = confirm('Are you sure to reset the state?');

	if (userConfirm){
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
							room: $("#floorcheckbox" + i).val().split(',')[j]
						});	
					}
				}
			}

		}else if ($("#roomradio").prop('checked')){
			for(var i=0; i < roomcheckboxcount; i++){
				if ($("#roomcheckbox" + i).prop('checked')){
					state.content.rooms.push({
						room: $("#roomcheckbox" + i).val()
					});	
				}
				
			}

		}else if ($("#allroomsradio").prop('checked')){
			for(var i=0; i < roomcheckboxcount; i++){	
				state.content.rooms.push({
					room: $("#roomcheckbox" + i).val()
				});	
			}
		}

		socket.emit('resetroomstate', JSON.stringify(state));
	}
});

socket.on('updateResult', function(data){
	$("#successNotification").show();
})