var socket = io.connect('ws://' + $("#serverAddress").text());
var json;

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

var id = getUrlParameter('id');

socket.on('connect', function(data) {
  socket.emit('join', 'monitor');
});

socket.emit('getroomdefaultsetting', id);

socket.on('roomdefaultsetting', function(data) {
  json = JSON.parse(data);
  showDetail(id);
});

function showDetail(objectId) {

  for (var i = 0; i < json.length; i++) {
    if (json[i]._id == objectId) {
      $('#detailRoomNumber').html(json[i]._id);
      $("input[name=roomState][value=" + json[i].state + "]").attr('checked', 'checked');

      $('#roomName').val(json[i].room);
      $('#suiteName').val(json[i].suite);

      $('#detailCourtesyConfig').find("tr:gt(0)").remove();
      for (var j = 0; j < json[i].courtesies.length; j++) {
        $('#detailCourtesyConfig tr:last').after("<tr><td><b>" + courtesyName[json[i].courtesies[j].service] + "</b></td><td>" + generateStateControl(json[i].courtesies[j].service, true, true, true, true) + "</td></tr>");
        setState(json[i].courtesies[j].state, json[i].courtesies[j].service);
      }

      $('#detailLightingConfig').find("tr:gt(0)").remove();
      for (var j = 0; j < json[i].lighting.length; j++) {
        $('#detailLightingConfig tr:last').after("<tr><td><b>" + lightingName[json[i].lighting[j].type] + "</b></td><td>" + lightingDimmableName[json[i].lighting[j].dimmable] + "</td><td>" + generateStateControl(json[i].lighting[j].type, true, false, true, true) + "</td><td>" + generatePowerControl("lightingPower" + j) + "</td><td>" + generateDropDown("lightingDimming" + j, 1, 10) + "</td></tr>");
        setState(json[i].lighting[j].state, json[i].lighting[j].type);
        setLightingPower(json[i].lighting[j].power, "lightingPower" + j, json[i].lighting[j].type);
        setLightingDimming(json[i].lighting[j].dimming, "lightingDimming" + j, json[i].lighting[j].type, json[i].lighting[j].dimmable);
      }

      $('#detailSelfServiceConfig').find("tr:gt(0)").remove();
      for (var j = 0; j < json[i].selfservice.length; j++) {
        $('#detailSelfServiceConfig tr:last').after("<tr><td><b>" + selfserviceName[json[i].selfservice[j].service] + "</b></td><td>" + generateStateControl(json[i].selfservice[j].service, true, false, true, true) + "</td></tr>");
        setState(json[i].selfservice[j].state, json[i].selfservice[j].service);

      }

      $("#detailHvacState").html(generateStateControl("hvacState", true, false, true, true));
      $("#detailHvacMode").html(generateHvacModeControl("hvacMode"));
      $("#detailHvacFanSpeed").html(generateHvacFanSpeedControl("hvacFanSpeed"));
      $("#detailHvacAcTemperature").html(generateDropDown("hvacAcTemperature", 18, 29) + " \xb0C");
      $("#detailHvacHeaterTemperature").html(generateDropDown("hvacHeaterTemperature", 18, 29) + " \xb0C");

      setState(json[i].hvac.state, "hvacState");
      setHvacMode(json[i].hvac.mode, "hvacMode", json[i].hvac.state);
      setHvacFanSpeed(json[i].hvac.fanspeed, "hvacFanSpeed", json[i].hvac.state);
      setHvacTemperature(json[i].hvac.temperature.ac, "hvacAcTemperature", json[i].hvac.state);
      setHvacTemperature(json[i].hvac.temperature.heater, "hvacHeaterTemperature", json[i].hvac.state);

      $("#detailCurtainState").html(generateStateControl("curtainState", true, false, true, true));
      $("#detailCurtainMode").html(generateCurtainModeControl("curtainMode"));
      setState(json[i].curtain.state, "curtainState");
      setCurtainMode(json[i].curtain.mode, "curtainMode", json[i].curtain.state);

      $("#detailTvState").html(generateStateControl("tvState", true, false, true, true));
      //$("#detailTvMode").html(generateTvModeControl("tvMode"));
      setState(json[i].tv.state, "tvState");
      //setTvMode(json[i].tv.mode, "tvMode", json[i].tv.mode);
    }
  }

}

function generateDropDown(name, start, end) {
  var control = "<select id='" + name + "'>";
  for (var i = start; i <= end; i++) {
    control += "<option value='" + i + "'>" + i + "</option>";
  }
  control += "</select>";

  return control;
}

/*function generateTvModeControl(name){
	var control = "<input type='radio' name='" + name+ "' value='ON'>On ";
	control += "<input type='radio' name='" + name + "' value='OFF'>Off";

	return control;
}*/

function generatePowerControl(name) {
  var control = "<input type='radio' name='" + name + "' value='ON'>On ";
  control += "<input type='radio' name='" + name + "' value='OFF'>Off";

  return control;
}

function generateLightingDimmableControl(name) {
  var control = "<input type='radio' name='" + name + "' value='true'>Yes ";
  control += "<input type='radio' name='" + name + "' value='false'>No";

  return control;
}

function generateCurtainModeControl(name) {
  var control = "<input type='radio' name='" + name + "' value='OPEN'>Open ";
  control += "<input type='radio' name='" + name + "' value='CLOSE'>Close";

  return control;
}

function generateHvacModeControl(name) {
  var control = "<input type='radio' name='" + name + "' value='AIRCON'>Air Conditioner ";
  control += "<input type='radio' name='" + name + "' value='HEATER'>Heater ";
  control += "<input type='radio' name='" + name + "' value='OFF'>Off";

  return control;
}

function generateHvacFanSpeedControl(name) {
  var control = "<input type='radio' name='" + name + "' value='LOW'>Low";
  control += "<input type='radio' name='" + name + "' value='MID'>Mid ";
  control += "<input type='radio' name='" + name + "' value='HIGH'>High";

  return control;
}

function generateStateControl(name, needReady, needActive, needDisabled, needInactive) {
  var control = "";

  if (needReady)
    control += "<input type='radio' name='" + name + "' value='READY'>Ready ";

  if (needActive)
    control += "<input type='radio' name='" + name + "' value='ACTIVE'>Active ";

  if (needDisabled)
    control += "<input type='radio' name='" + name + "' value='DISABLED'>Disabled ";

  if (needInactive)
    control += "<input type='radio' name='" + name + "' value='INACTIVE'>Inactive";

  return control;
}

function setState(state, name) {
  $("input[name=" + name + "][value=" + state + "]").attr('checked', 'checked');

  if (state == "INACTIVE") {
    $("input[name=" + name + "][value=READY]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=ACTIVE]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=DISABLED]").attr('disabled', 'disabled');
  } else {
    $("input[name=" + name + "][value=INACTIVE]").attr('disabled', 'disabled');
  }
}

function setLightingDimming(dimming, name, state, dimmable) {
  if (dimmable == 'true') {
    $("#" + name).val(dimming);
    if (state == "INACTIVE") {
      $("#" + name).attr('disabled', 'disabled');
    }
  } else {
    $("#" + name).hide();
  }
}

function setLightingPower(power, name, state) {
  $("input[name=" + name + "][value=" + power + "]").attr('checked', 'checked');

  if (state == "INACTIVE") {
    $("input[name=" + name + "][value=ON]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=OFF]").attr('disabled', 'disabled');
  }
}

function setHvacMode(mode, name, state) {
  $("input[name=" + name + "][value=" + mode + "]").attr('checked', 'checked');

  if (state == "INACTIVE") {
    $("input[name=" + name + "][value=AIRCON]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=HEATER]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=OFF]").attr('disabled', 'disabled');
  }
}

function setCurtainMode(mode, name, state) {
  $("input[name=" + name + "][value=" + mode + "]").attr('checked', 'checked');

  if (state == "INACTIVE") {
    $("input[name=" + name + "][value=OPEN]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=CLOSE]").attr('disabled', 'disabled');
  }
}

/*function setTvMode(mode, name, state){
	$("input[name=" + name + "][value=" + mode + "]").attr('checked', 'checked');

	if (state == "INACTIVE"){
		$("input[name=" + name + "][value=ON]").attr('disabled', 'disabled');
		$("input[name=" + name + "][value=OFF]").attr('disabled', 'disabled');
	}
}*/

function setHvacFanSpeed(fanspeed, name, state) {
  $("input[name=" + name + "][value=" + fanspeed + "]").attr('checked', 'checked');

  if (state == "INACTIVE") {
    $("input[name=" + name + "][value=LOW]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=MID]").attr('disabled', 'disabled');
    $("input[name=" + name + "][value=HIGH]").attr('disabled', 'disabled');
  }
}

function setHvacTemperature(temperature, name, state) {
  $("#" + name).val(temperature);

  if (state == "INACTIVE") {
    $("#" + name).attr('disabled', 'disabled');
  }
}


function getRoomState(objectId) {
  var state = {
    room: objectId,
    roomName: $('#roomName').val(),
    suiteName: $('#suiteName').val(),
    state: $("input[name=roomState]:checked").val(),
    courtesies: [],
    lighting: [],
    selfservice: [],
    hvac: "",
    tv: "",
    curtain: ""
  };

  for (var i = 0; i < json.length; i++) {
    if (json[i]._id == objectId) {
      for (var j = 0; j < json[i].courtesies.length; j++) {
        state.courtesies.push({
          service: json[i].courtesies[j].service,
          state: $("input[name=" + json[i].courtesies[j].service + "]:checked").val()
        });
      }

      for (var j = 0; j < json[i].lighting.length; j++) {
        state.lighting.push({
          type: json[i].lighting[j].type,
          //dimmable: $("input[name=lightingDimmable" + j + "]:checked").val(),
          dimmable: json[i].lighting[j].dimmable,
          state: $("input[name=" + json[i].lighting[j].type + "]:checked").val(),
          power: $("input[name=lightingPower" + j + "]:checked").val(),
          dimming: $("#lightingDimming" + j).val()
        });
      }

      for (var j = 0; j < json[i].selfservice.length; j++) {
        state.selfservice.push({
          service: json[i].selfservice[j].service,
          state: $("input[name=" + json[i].selfservice[j].service + "]:checked").val()
        });
      }

      state.hvac = {
        state: $("input[name=hvacState]:checked").val(),
        mode: $("input[name=hvacMode]:checked").val(),
        fanspeed: $("input[name=hvacFanSpeed]:checked").val(),
        temperature: {
          ac: $("#hvacAcTemperature").val(),
          heater: $("#hvacHeaterTemperature").val()
        }
      }

      state.tv = {
        state: $("input[name=tvState]:checked").val()
      }

      state.curtain = {
        state: $("input[name=curtainState]:checked").val(),
        mode: $("input[name=curtainMode]:checked").val()
      }
    }
  }

  return state;
}

$("#detailSave").click(function() {
  var state = {
    content: {
      rooms: []
    }
  };

  state.content.rooms.push(
    getRoomState($('#detailRoomNumber').html())
  );

  socket.emit('setroomdefaultsetting', JSON.stringify(state));
});

$("#detailBack").click(function() {
  window.location = "/roomState";
});

socket.on('updateResult', function(data) {
  $("#successNotification").show();
  window.scrollTo(0, 0);
})
