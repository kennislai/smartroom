var socket = io.connect('ws://' + $("#serverAddress").text());

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
});

socket.emit('getselfcheckout', null);

socket.on('selfcheckout', function(data){
	var json = JSON.parse(data);

	$('#selfCheckout').find("tr:gt(0)").remove();
	for(var i=0; i < json.length; i++){
		$('#selfCheckout tr:last').after("<tr><td>" + json[i]._id + "</td><td>" + json[i].room + "</td><td>" + selfCheckoutName[json[i].luggageservice] + "</td><td>" + selfCheckoutName[json[i].taxiservice] + "</td><td>" + dateFormatter(json[i].requestdatetime) + " " + timeFormatter(json[i].requestdatetime)  + "</td><td><a onclick='removeCheckout(\"" + json[i]._id + "\")'>Remove</a></td></tr>");
	}
});

function removeCheckout(id){
	socket.emit('deleteselfcheckout', id);
}

function dateFormatter(date){
    var d = new Date(date);
    //return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    return d.toLocaleDateString();
}

function timeFormatter(date){
    var d = new Date(date);
    //return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    return d.toLocaleTimeString();
}