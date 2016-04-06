sendSignal('SERVICE', 'SELFSERVICE', 'ROOMSERVICEMENU', '');
var roomservicejson;

socket.on('roomservicemenu', function(message) {
	roomservicejson = JSON.parse(message);
	roomservicejson = roomservicejson[0].value;

	var categories = getCategories(roomservicejson);
	$('#roomServiceMenuCategory').empty();
	for(var i=0; i < categories.length; i++){
		$("#roomServiceMenuCategory").append("<button type='button' name='roomServiceMenu' id='" + categories[i].replace(" ", "") + "Id' onclick='loadRoomServiceMenuByCategory(\"" + categories[i] + "\");'>" + categories[i] + "</button>");

		if (i == 0){
			loadRoomServiceMenuByCategory(categories[i]);
		}
	}
});

function loadRoomServiceMenuByCategory(category){
	$('#roomservicemenu').find("tr:gt(0)").remove();
	$("button[name=roomServiceMenu]").removeClass("button-on");
	$("button[name=roomServiceMenu]").addClass("button-off");

	$("button[name=roomServiceMenu][id=" + category.replace(" ", "") + "Id]").addClass("button-on");

	for(var i=0; i < roomservicejson.length; i++){
		if (roomservicejson[i].Category == category){
			$('#roomservicemenu tr:last').after("<tr><td>" + roomservicejson[i].SubCategory + "</td><td>" + roomservicejson[i].Item + "</td><td>" + roomservicejson[i].Price + "</td></tr>")
		}
	}
}

function getCategories(json){
	var uniqueCategories = [];
	
	for(i = 0; i< json.length; i++){    
	    if(uniqueCategories.indexOf(json[i].Category) === -1){
	        uniqueCategories.push(json[i].Category);        
	    }        
	}

	return uniqueCategories;
}
