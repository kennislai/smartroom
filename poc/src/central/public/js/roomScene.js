var socket = io.connect('ws://' + $("#serverAddress").text());

socket.on('connect', function(data) {
  socket.emit('join', 'monitor');
});

socket.emit('getRoomScenes');

socket.on('roomAllScenes', function(data) {
  var json = JSON.parse(data);
  $('#roomScenes').find("tr:gt(0)").remove();
  for (var i = 0; i < json.length; i++) {
    $('#roomScenes tr:last').after("<tr><td>" + json[i].name + "</td>" +
      "<td>" + json[i].state + "</td>" +
      '<td><a href="/roomSceneDetail?id=' + json[i]._id + '">Edit</a></td>' +
      '<td><a href="#" onclick="deleteScene(\'' + json[i]._id + '\')">Delete</a></td></tr>');
  }
});

function deleteScene(sceneId) {
  socket.emit('deleteRoomScene', sceneId);
}

$("#sceneAdd").click(function() {
  window.location = "/roomSceneDetail";
});

socket.on('updateResult', function() {
  window.location = "/roomScene";
});
