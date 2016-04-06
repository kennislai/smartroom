var socket = io.connect('ws://' + $("#serverAddress").text());

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
});

socket.emit('getallroom', null);

socket.on('allroom', function(data){
	var json = JSON.parse(data);

	$('#roomState').find("tr:gt(0)").remove();
	for(var i=0; i < json.length; i++){
		$('#roomState tr:last').after("<tr><td>" + json[i]._id + "</td><td>" + json[i].room + "</td><td>" + json[i].suite + "</td>"+
		"<td><a href='/roomStateDetail?id=" + json[i]._id + "'>Detail</a></td>"+
		"<td><a href='/roomSceneAssigned?id=" + json[i]._id + "'>Scene</a></td>"+
		"<td><a href='/roomStateDefaultSetting?id=" + json[i]._id + "'>Default Setting</a></td>"+
		"<td><a href='/roomStateReset?id=" + json[i]._id + "'>Reset</a></td></tr>");
	}
});
