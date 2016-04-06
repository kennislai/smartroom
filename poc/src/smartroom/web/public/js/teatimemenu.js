sendSignal('SERVICE', 'SELFSERVICE', 'TEATIMEMENU', '');
var teatimeJson;

socket.on('teatimeorder', function(message) {
	alert('Your order has been recevied.');
});

socket.on('teatimemenu', function(message) {
	teatimeJson = JSON.parse(message);
	teatimeJson = teatimeJson[0].value;

	$('#teatimemenu').empty();
	for(var i=0; i < teatimeJson.length; i++){
		$("#teatimemenu").append("<tr><td>" + teatimeJson[i].TeaSet + "</td><td>" + teatimeJson[i].Item + "</td><td>" + teatimeJson[i].Price + "</td><td>" + generateAdjustButton("add", "teaset" + teatimeJson[i].TeaSet) + " <input type='text' maxlength='1' value='0' class='teatime-quantity' id='teaset" + teatimeJson[i].TeaSet + "'> " + generateAdjustButton("minus",  "teaset" + teatimeJson[i].TeaSet) + "</td></tr>");
	}
});

function generateAdjustButton(func, target){
	var button;

	if (func == 'add'){
		button = '<button type="button" class="btn btn-default" onclick="addTeaQuantity(\'' + target + '\');">+</button>';
	} else if (func == 'minus'){
		button = '<button type="button" class="btn btn-default" onclick="minusTeaQuantity(\'' + target + '\');">-</button>';
	}

	return button;
}

function addTeaQuantity(target){
	if (parseInt($("#" + target).val()) < 9)
		$("#" + target).val(parseInt($("#" + target).val()) + 1);
}

function minusTeaQuantity(target){
	if (parseInt($("#" + target).val()) > 0)
		$("#" + target).val(parseInt($("#" + target).val()) - 1);
}


function teatimemenu_initialize() {
	$("#teaTimeBack").click(function() {
		$("div[name=mainPanel]").hide();
		$("div[name=mainPanel][id=selfServicePanel]").show();
	});

	$("#teaTimeHour").change(function() {
		if ($("#teaTimeHour").val().length == 1){
			$("#teaTimeHour").val("0" + $("#teaTimeHour").val());
		}
	});

	$("#teaTimeMinute").change(function() {
		if ($("#teaTimeMinute").val().length == 1){
			$("#teaTimeMinute").val("0" + $("#teaTimeMinute").val());
		}
	});

	$("#addTeaTimeHour").click(function() {
		if (parseInt($("#teaTimeHour").val()) < 23){
			$("#teaTimeHour").val(parseInt($("#teaTimeHour").val()) + 1);
			$("#teaTimeHour").change();
		}
	});

	$("#addTeaTimeMinute").click(function() {
		if (parseInt($("#teaTimeMinute").val()) < 59){
			$("#teaTimeMinute").val(parseInt($("#teaTimeMinute").val()) + 1);
			$("#teaTimeMinute").change();
		}
	});
	
	$("#minusTeaTimeHour").click(function() {
		if (parseInt($("#teaTimeHour").val()) > 0){
			$("#teaTimeHour").val(parseInt($("#teaTimeHour").val()) - 1);
			$("#teaTimeHour").change();
		}
	});

	$("#minusTeaTimeMinute").click(function() {
		if (parseInt($("#teaTimeMinute").val()) > 0){
			$("#teaTimeMinute").val(parseInt($("#teaTimeMinute").val()) - 1);
			$("#teaTimeMinute").change();
		}
	});

	$("#teaTimeSubmit").click(function() {
		var jsonObj = {
			deliverytime: $("#teaTimeHour").val() + ":" + $("#teaTimeMinute").val(),
			order: []
		};

		var order = [];
		for(var i=0; i < teatimeJson.length; i++){
			if (parseInt($("#teaset" +teatimeJson[i].TeaSet).val()) > 0){
				var json = {
					teaset: teatimeJson[i].TeaSet,
					quantity: $("#teaset" +teatimeJson[i].TeaSet).val()
				}
				order.push(json);
			}
		}
		jsonObj.order = order;

		sendSignal("SERVICE", "SELFSERVICE", "TEATIMEORDER", JSON.stringify(jsonObj));
	});
}
