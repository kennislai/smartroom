var socket = io.connect('ws://' + $("#serverAddress").text());
var menuList;

socket.on('connect', function(data) {
	socket.emit('join', 'monitor');
	socket.emit('getteatimeallmenu', null);
});

socket.on('teatimeallmenu', function(data) {
    menuList = JSON.parse(data);

    $('#monitorTable').find("tr:gt(0)").remove();

    for(var i=0; i < menuList.length; i++){
    	$('#monitorTable tr:last').after("<tr><td>" + dateFormatter(convertObjectIdToDate(menuList[i]._id)) + " " + timeFormatter(convertObjectIdToDate(menuList[i]._id)) + "</td><td>"+ menuList[i]._id + "</td><td>" + menuList[i].filename + "</td><td><button type='button' class='btn btn-default' data-toggle='modal' data-target='#myModal' onclick='previewTeaTimeMenu(\"" + menuList[i]._id + "\")'>Preview</button></td></tr>");
	}
});

socket.on('deleteteatimemenu', function(data) {
	alert(data);
	$("#myModal").modal('hide');
});

socket.on('publishteatimemenu', function(data) {
	alert(data);
	$("#myModal").modal('hide');
});

function deleteTeaTimeMenu(objectId){
	socket.emit('deleteteatimemenu', JSON.stringify(objectId));
}

function publishTeaTimeMenu(objectId){
	socket.emit('publishteatimemenu',JSON.stringify(objectId));
}

function convertObjectIdToDate(objectId){
	return new Date(parseInt(objectId.substring(0,8), 16) * 1000).toISOString();
}

function previewTeaTimeMenu(objectId){
	$('#previewTable').find("tr:gt(0)").remove();
	for(var i=0; i< menuList.length; i++){
		if(menuList[i]._id == objectId){
			$("#modalid").html(objectId);
			$("#modalfilename").html(menuList[i].filename);

			for(var j=0; j < menuList[i].menu.length ; j++){
				$('#previewTable tr:last').after("<tr><td>" + menuList[i].menu[j].teaset + '</td><td>'  + menuList[i].menu[j].item + '</td><td>' + menuList[i].menu[j].price + '</td>/tr>');
			}
		}
	}
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

$("#publish").click(function(){
	publishTeaTimeMenu($("#modalid").html());
});

$("#delete").click(function(){
	deleteTeaTimeMenu($("#modalid").html());
});