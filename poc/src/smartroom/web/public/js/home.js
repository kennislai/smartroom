var weatherIcon = {
	Sunny: 'sunny.png',
	Rainy: 'rain_dn.png',
	Cloudy: 'cloudy_dn.png'
}

socket.on('connect', function(message) {
	socket.emit('join', 'MASTER-CONTROLLER-UI');
	sendSignal('INITIAL', '', '', '');
});

socket.on('message', function(message) {
	var json = JSON.parse(message);

	for (var i = 0; i < json.length; i++) {
		if (json[i].type == 'INITIAL') {
			$("#w_roomnumber").html("Room " + json[i].roomNumber);
			$("#w_guestname").html("Mr Lawrence Ho");

		} else if (json[i].type == 'COMMAND') {
			if (json[i].deviceType == 'TEMPERATURE_SENSOR') {
				$('#w_room_temperature').html(json[i].value);
			
			} else if (json[i].deviceType == 'HUMIDITY_SENSOR') {
				$('#w_room_humidity').html(json[i].value);
			} 
		} else if (json[i].type == 'WEATHERUPDATE') {
			$("#w_icon").attr("src", "img/weather/" + weatherIcon[json[i].msgContent.weather]);
			$("#w_dayhigh").html(json[i].msgContent.dayHigh);
			$("#w_daylow").html(json[i].msgContent.dayLow);
			$("#w_current_temp_celsius").html(json[i].msgContent.temperature);
		}
	}
});



function date_time() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth();
	var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
	var d = date.getDate();
	var day = date.getDay();
	var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	
	var h = date.getHours();
	if (h < 10)
	h = "0" + h;

	var m = date.getMinutes();
	if (m < 10)
	m = "0" + m;

	var s = date.getSeconds();
	if (s < 10)
	s = "0" + s;

	$('#today').html(days[day] + ' ' + months[month] + ' ' + d + ', ' + year + ' ' +  h + ':' + m);

	setTimeout(date_time, '1000');

	return true;
}