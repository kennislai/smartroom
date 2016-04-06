var socket = io.connect('ws://' + $("#serverAddress").text());
var json;

socket.on('connect', function(data){
	socket.emit('join', 'monitor');
});

socket.emit('getteatimeorder', null);

socket.on('teatimeorder', function(data){
	json = JSON.parse(data);

	$('#teaTimeOrder').find("tr:gt(0)").remove();
	for(var i=0; i < json.length; i++){
		$('#teaTimeOrder tr:last').after("<tr><td>" + json[i]._id + "</td><td>" + json[i].room + "</td><td>" + json[i].deliverytime + "</td><td>" +  dateFormatter(json[i].requestdatetime) + " " + timeFormatter(json[i].requestdatetime)  + "</td><td><a data-toggle='modal' data-target='#teaTimeOrderModal' onclick='showDetailPage(\"" + json[i]._id + "\")' >Detail</a></td><td><a onclick='removeTeaTimeOrder(\"" + json[i]._id + "\")'>Remove</a></td></tr>");
	}
});

function showDetailPage(id){
	for(var i=0; i < json.length; i++){
		if (json[i]._id == id){
			var order = json[i].order;
			$('#teaTimeOrderDetail').find("tr:gt(0)").remove();
			for(var j=0; j < order.length; j++){
				$('#teaTimeOrderDetail tr:last').after("<tr><td>" + order[j].teaset + "</td><td>" + order[j].quantity + "</td></tr>");
			}
			
			break;
		}
	}
}

function removeTeaTimeOrder(id){
	socket.emit('deleteteatimeorder', id);
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