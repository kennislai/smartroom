var socket = io.connect('ws://' + $("#serverAddress").text());
var json;

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
});

socket.emit('getwakeupcall', null);

socket.on('wakeupcall', function(data){
	json = JSON.parse(data);

	$('#wakeupCall').find("tr:gt(0)").remove();
	for(var i=0; i < json.length; i++){
		$('#wakeupCall tr:last').after("<tr><td>" + json[i]._id + "</td><td>" + wakeupCallPowerName[json[i].power] + "</td><td>" + json[i].time + "</td><td><a data-toggle='modal' data-target='#myModal' onclick='showEditPage(\"" + json[i]._id + "\")' >Edit</a></td></tr>");
	}
});

socket.on('updateResult', function(data) {
	alert('Wakeup Call is updated');
	$("#myModal").modal('hide');
});

function showEditPage(id){
	for(var i=0; i < json.length; i++){
		if (json[i]._id == id){
			$("#roomNum").html(id);
			$("input[name=power][value=" + json[i].power + "]").attr('checked', 'checked');
			$("#wakeupcallhour").val(json[i].time.split(':')[0]);
			$("#wakeupcallminute").val(json[i].time.split(':')[1]);
			break;
		}
	}
}

$("#save").click(function(){
	var state = {
		content: {
			rooms: [{
				room: $("#roomNum").html(),
				power: $("input[name=power]:checked").val(),
				time: $("#wakeupcallhour").val() + ":" + $("#wakeupcallminute").val()
			}]
		}
	};

	socket.emit('setwakeupcall', JSON.stringify(state));
});

$("#wakeupcallhour").change(function() {
	if ($("#wakeupcallhour").val().length == 1){
		$("#wakeupcallhour").val("0" + $("#wakeupcallhour").val());
	}
});

$("#wakeupcallminute").change(function() {
	if ($("#wakeupcallminute").val().length == 1){
		$("#wakeupcallminute").val("0" + $("#wakeupcallminute").val());
	}
});