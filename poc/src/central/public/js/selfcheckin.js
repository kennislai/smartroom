var socket = io.connect('http://' + $("meta[name=serverAddress]").attr("content"));

socket.on('connect', function(data){
	
});

socket.on('message', function(data){
	var json = JSON.parse(data);

	$("#resultSection").html('');
	$("#getKeySection").html('');
	$("#buttonSection").hide();
	if (json.request == 'search'){
		if (json.msgContent == ''){
			alert('Not found');
		}else if (json.msgContent.actualCheckinTime != null){
			$("#resultSection").append('<h3>This booking already Check-in.</h3>');
		}else{
			$("#searchSection").hide();
			$("#resultSection").append('<h3>Here is your booking. Please click confirm to get the room key.</h3>');
			$("#resultSection").append('<table>');
			$("#resultSection").append('<tr><td>Booking No:</td><td>' + json.msgContent[0]._id + '</td></tr>');
			$("#resultSection").append('<tr><td>Name:</td><td>' + json.msgContent[0].name + '</td></tr>');
			$("#resultSection").append('<tr><td>Arrival:</td><td>' + json.msgContent[0].arrival + '</td></tr>');
			$("#resultSection").append('<tr><td>Departure:</td><td>' + json.msgContent[0].departure + '</td></tr>');
			$("#resultSection").append('<tr><td>Room:</td><td>' + json.msgContent[0].room + '</td></tr>');
			$("#resultSection").append('<tr><td>Suite:</td><td>' + json.msgContent[0].suite + '</td></tr>');
			$("#resultSection").append('<tr><td>No. of Adult:</td><td>' + json.msgContent[0].noOfAdult + '</td></tr>');
			$("#resultSection").append('<tr><td>No. of Children:</td><td>' + json.msgContent[0].noOfChildren + '</td></tr>');
			$("#resultSection").append('<tr><td>Estimated Arrival Time:</td><td>' + json.msgContent[0].eta + '</td></tr>');
			$("#resultSection").append('</table>');
			$("#buttonSection").show();
		}
	}else if(json.request == 'confirm'){
		if (json.msgContent== ''){
			$("#getKeySection").append('<h3>No room is available yet. Please contact front desk for help.</h3>');
		}else{
			$("#getKeySection").append('<h3>Check-in process completed. Please get the key from the tray.</h3>');
			$("#getKeySection").append('<h3>Room:' + json.msgContent + '</h3>');
		}

		$("#searchSection").hide();
		$("#buttonSection").hide();
		$("#resultSection").hide();
		$("#getKeySection").show();
	}
});

$("#search").click(function(){
	var json = {
		func: 'search',
		bookingNo: $("#bookingNo").val()
	};

	socket.emit('onlineCheckInMessage', JSON.stringify(json));
});

$("#back").click(function(){
	$("#resultSection").html('');
	$("#searchSection").show();
	$("#buttonSection").hide();
});

$("#confirm").click(function(){
	var json = {
		func: 'confirm',
		bookingNo: $("#bookingNo").val(),
		actualCheckinTime: new Date().toJSON()
	};

	socket.emit('selfCheckInMessage', JSON.stringify(json));
});