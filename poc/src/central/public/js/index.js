var socket = io.connect('ws://' + $("#serverAddress").text());

socket.on('connect', function(data) {
	socket.emit('join', 'monitor');
	socket.emit('getallroom', '');
});

socket.on('allroom', function(data) {
    updateTable(data);   
});

socket.on('refreshroomstate', function(data) {
    updateTable(data);    
});

function updateTable(data){
    var json = JSON.parse(data);

    $('#monitorTable').find("tr:gt(0)").remove();

    for(var i=0; i < json.length; i++){
        $('#monitorTable tr:last').after('<tr><td><a href=/roomStateDetail?id=' + json[i]._id + '>' + json[i]._id + '</a></td><td>' + stateName[json[i].state] + '</td><td>' + getCourtesyState(json[i].courtesies, 'dnd') + '</td><td>' + getCourtesyState(json[i].courtesies, 'makeuproom') + '</td><td>' + getCourtesyState(json[i].courtesies, 'laundry') + '</td><td>' + json[i].temperature + '</td><td>' + json[i].humidity + '</td></tr>');
    }   
}

function getCourtesyState(list, service){
    var value;

	for(var i=0; i < list.length; i++){
		if (list[i].service == service){
            value = stateName[list[i].state];

            if (list[i].activeDate != ""){
                value += "<br>" + dateFormatter(list[i].activeDate) + "<br>" + timeFormatter(list[i].activeDate);
            }

			return changeColor(list[i].state, value);
		}
	}
}

function changeColor(state, value){
    if(state == "ACTIVE")
        return "<p class='text-danger'>" + value + "</p>";
    else
        return value;
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