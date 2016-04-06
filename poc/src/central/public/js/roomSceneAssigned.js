var debug = true;
if (debug) {
  $("#sceneAdd").removeClass('hide');
}

var socket = io.connect('ws://' + $("#serverAddress").text());

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName;

  for (var i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

socket.on('connect', function(data) {
  socket.emit('join', 'monitor');
});

var id = getUrlParameter('id');
if (id !== undefined) {
  socket.emit('getRoomScenesByRoomId', id);
  socket.emit('getRoomAvailableScenesByRoomId', id);
}

socket.on('roomAssignedScenes', function(data) {
  $("#detailBack").html('Cancel');

  $("#header").html("Room " + id + " Scene");
  var json = JSON.parse(data);
  $('#roomScenes').find("tr:gt(0)").remove();
  for (var i = 0; i < json.length; i++) {
    $('#roomScenes tr:last').after("<tr><td>" + json[i].name + "</td>" +
      "<td>" + json[i].state + "</td>" +
      "<td>" + convertBoolToYesNo(json[i].backEndOnly) + "</td>" +
      '<td><a href="#" onclick="runScene(\'' + json[i]._id + '\')"">Run</a></td>' +
      '<td><a href="#" onclick="editScene(\'' + json[i]._id + '\')"">Edit</a></td>' +
      '<td ' + (debug === true ? '' : 'class="hide"') + '><a href="#" onclick="removeRoomScene(\'' + json[i]._id + '\')">Remove</a></td></tr>');
  }
});

socket.on('roomAvailableScene', function(data) {
  var json = JSON.parse(data);
  var result = '<form role="form">';
  for (var i = 0; i < json.length; i++) {
    result += '<div class="checkbox"><label><input type="checkbox" name="availableScene" value="' +
      json[i]._id + '"> ' + json[i].name + '</label></div>';
  }
  result += '</form>';
  $('#sceneAddList').html(result);
});

function convertBoolToYesNo(bool) {
  return bool ? "Yes" : "No";
}

function runScene(sceneId) {
  socket.emit('runRoomScene', JSON.stringify({
    sceneId: sceneId,
    roomId: id
  }));
}

function editScene(sceneId) {
  $("#roomSceneDetailContentPanel").attr('class', '');
  socket.emit('getRoomSceneById', sceneId);
}

socket.on('roomScene', function(data) {
  jsonObj = JSON.parse(data);
  showDetail(jsonObj);
});

$(document).on('click', "#detailSave", function() {
  socket.emit('updateRoomScene', JSON.stringify(getRoomScene(jsonObj)));
});

$(document).on('click', "#detailBack", function() {
  $("#roomSceneDetailContentPanel").attr('class', 'hide');
});

function removeRoomScene(sceneId) {
  var json = {
    sceneId: sceneId,
    roomId: id
  };
  socket.emit('removeRoomScene', JSON.stringify(json));
}

$("#sceneAddSave").click(function() {
  var json = {
    sceneIds: [],
    roomId: id
  };
  $("input:checkbox[name=availableScene]:checked").each(function() {
    json.sceneIds.push($(this).val());
  });
  socket.emit('addRoomScene', JSON.stringify(json));
});

$("#sceneBack").click(function() {
  window.location = "/roomState";
});

socket.on('updateResult', function() {
  window.location = "/roomSceneAssigned?id=" + id;
});
