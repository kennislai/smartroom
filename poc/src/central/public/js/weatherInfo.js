var socket = io.connect('ws://' + $("#serverAddress").text());

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
	socket.emit('getweatherinfo', '');
});

socket.on('weatherinfo', function(data){
	var json = JSON.parse(data);
	json = json[0];
	$("#temperature").val(json.temperature);
	$("#dayhigh").val(json.dayHigh);
	$("#daylow").val(json.dayLow);
	$("#weather").val(json.weather);

});

$("#save").click(function(){

	var weatherInfo = {
		content: {
			value: {
				temperature: $("#temperature").val(),
				dayHigh: $("#dayhigh").val(),
				dayLow: $("#daylow").val(),
				weather: $("#weather").val()
			}
		}
	};

	socket.emit('setweatherinfo', JSON.stringify(weatherInfo));

});

socket.on('updateResult', function(data){
	$("#successNotification").show();
})