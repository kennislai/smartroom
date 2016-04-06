var socket = io.connect('http://' + $("meta[name=serverAddress]").attr("content"));

socket.on('connect', function(data){
	
});

socket.on('message', function(data){
	var json = JSON.parse(data);

	$("#resultSection").html('');
	$("#buttonSection").hide();
	if (json.request == 'search'){
		if (json.msgContent == ''){
			alert('Not found');
		}else{
			$("#searchSection").hide();
			$("#resultSection").append('<table>');
			$("#resultSection").append('<tr><td>Booking No:</td><td>' + json.msgContent[0]._id + '</td></tr>');
			$("#resultSection").append('<tr><td>Name:</td><td>' + json.msgContent[0].name + '</td></tr>');
			$("#resultSection").append('<tr><td>Arrival:</td><td>' + json.msgContent[0].arrival + '</td></tr>');
			$("#resultSection").append('<tr><td>Departure:</td><td>' + json.msgContent[0].departure + '</td></tr>');
			$("#resultSection").append('<tr><td>Room:</td><td>' + json.msgContent[0].room + '</td></tr>');
			$("#resultSection").append('<tr><td>Suite:</td><td>' + json.msgContent[0].suite + '</td></tr>');
			$("#resultSection").append('<tr><td>No. of Adult:</td><td>' + json.msgContent[0].noOfAdult + '</td></tr>');
			$("#resultSection").append('<tr><td>No. of Children:</td><td>' + json.msgContent[0].noOfChildren + '</td></tr>');
			$("#resultSection").append('<tr><td>Estimated Arrival Time:</td><td><select id="eta"></select></td></tr>');
			$("#resultSection").append('</table>');
			$("#buttonSection").show();

			for(var i=0; i < 24; i++){
				var hour = i < 10 ? '0'+i : i;
				$('#eta').append('<option>' + hour + ':00</option>');
				$('#eta').append('<option>' + hour + ':30</option>');
			}
			
		}
	}else if(json.request == 'submit'){
		$("#searchSection").hide();
		$("#buttonSection").hide();
		$("#resultSection").hide();

		$("#printSection").append('<table>');
		$("#printSection").append('<tr><td>Booking No:</td><td>' + json.msgContent[0]._id + '</td></tr>');
		$("#printSection").append('<tr><td>Name:</td><td>' + json.msgContent[0].name + '</td></tr>');
		$("#printSection").append('<tr><td>Arrival:</td><td>' + json.msgContent[0].arrival + '</td></tr>');
		$("#printSection").append('<tr><td>Departure:</td><td>' + json.msgContent[0].departure + '</td></tr>');
		$("#printSection").append('<tr><td>Room:</td><td>' + json.msgContent[0].room + '</td></tr>');
		$("#printSection").append('<tr><td>Suite:</td><td>' + json.msgContent[0].suite + '</td></tr>');
		$("#printSection").append('<tr><td>No. of Adult:</td><td>' + json.msgContent[0].noOfAdult + '</td></tr>');
		$("#printSection").append('<tr><td>No. of Children:</td><td>' + json.msgContent[0].noOfChildren + '</td></tr>');
		$("#printSection").append('<tr><td>Estimated Arrival Time:</td><td>' + json.msgContent[0].eta + '</td></tr>');
		$("#printSection").append('</table>');


		$("#printSection").show();

		generateBarcode();
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
	$("#printSection").hide();
	$("#buttonSection").hide();
});

$("#save").click(function(){
	var json = {
		func: 'submit',
		bookingNo: $("#bookingNo").val(),
		checkinTime: new Date().toJSON(),
		eta: $("#eta").val()
	};

	socket.emit('onlineCheckInMessage', JSON.stringify(json));
});


    
function generateBarcode(){
	var value = $("#bookingNo").val();
	
	var btype = 'code128';
	var renderer = 'css';
	var quietZone = false;

	var settings = {
		output:renderer,
		bgColor: '#af9b82',
		color: '#000000',
		barWidth: '2',
		barHeight: '50',
		moduleSize: '5',
		posX: '10',
		posY: '20',
		addQuietZone: '1'
	};

	$("#barcodeTarget").html("").show().barcode(value, btype, settings);
}