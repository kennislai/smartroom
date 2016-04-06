function showDetail(json) {
  $('#detailName').val(json.name);
  $("input[name=sceneState][value=" + json.state + "]").attr('checked', 'checked');
  $("#activateByBackendOnly").attr('checked', json.backEndOnly);

  $('#detailLightingConfig').find("tr:gt(0)").remove();
  for (var j1 = 0; j1 < json.lighting.length; j1++) {
    $('#detailLightingConfig tr:last').after("<tr><td><b>" + lightingName[json.lighting[j1].type] + "</b></td>" +
      "<td>" + generatePowerControl("lightingPower" + j1) + "</td>" +
      "<td>" + generateDropDown("lightingDimming" + j1, 1, 10) + "</td></tr>");
    setLightingPower(json.lighting[j1].power, "lightingPower" + j1, json.lighting[j1].type);
    setLightingDimming(json.lighting[j1].dimming, "lightingDimming" + j1, json.lighting[j1].type, json.lighting[j1].dimmable);
  }

  $("#detailHvacMode").html(generateHvacModeControl("hvacMode"));
  $("#detailHvacFanSpeed").html(generateHvacFanSpeedControl("hvacFanSpeed"));
  $("#detailHvacAcTemperature").html(generateDropDown("hvacAcTemperature", 18, 29) + " \xb0C");
  $("#detailHvacHeaterTemperature").html(generateDropDown("hvacHeaterTemperature", 18, 29) + " \xb0C");
  setHvacMode(json.hvac.mode, "hvacMode", json.hvac.state);
  setHvacFanSpeed(json.hvac.fanspeed, "hvacFanSpeed", json.hvac.state);
  setHvacTemperature(json.hvac.temperature.ac, "hvacAcTemperature", json.hvac.state);
  setHvacTemperature(json.hvac.temperature.heater, "hvacHeaterTemperature", json.hvac.state);

  $("#detailCurtainMode").html(generateCurtainModeControl("curtainMode"));
  setCurtainMode(json.curtain.mode, "curtainMode", json.curtain.state);
}

function generateDropDown(name, start, end) {
  var control = "<select id='" + name + "'>";
  for (var i = start; i <= end; i++) {
    control += "<option value='" + i + "'>" + i + "</option>";
  }
  control += "</select>";

  return control;
}

function generatePowerControl(name) {
  var control = "<input type='radio' name='" + name + "' value='ON'>On ";
  control += "<input type='radio' name='" + name + "' value='OFF'>Off";

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

function getRoomScene(json) {
  json.name = $('#detailName').val();
  json.backEndOnly = $('#activateByBackendOnly').is(':checked');
  json.state = $("input[name=sceneState]:checked").val();
  for (var j1 = 0; j1 < json.lighting.length; j1++) {
    json.lighting[j1].power = $("input[name=lightingPower" + j1 + "]:checked").val();
    json.lighting[j1].dimming = $("#lightingDimming" + j1).val();
  }
  json.hvac.mode = $("input[name=hvacMode]:checked").val();
  json.hvac.fanspeed = $("input[name=hvacFanSpeed]:checked").val();
  json.hvac.temperature.ac = $("#hvacAcTemperature").val();
  json.hvac.temperature.heater = $("#hvacHeaterTemperature").val();
  json.curtain.mode = $("input[name=curtainMode]:checked").val();
  return json;
}
