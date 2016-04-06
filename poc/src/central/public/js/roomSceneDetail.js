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

var jsonObj = null;
socket.on('connect', function(data) {
  socket.emit('join', 'monitor');
});

var id = getUrlParameter('id');
if (id !== undefined) {
  socket.emit('getRoomSceneById', id);
} else {
  socket.emit('createRoomScene');
  $("#header").html('Add Scene');
}

var updated = getUrlParameter('updated');
if (updated !== undefined && updated == 1)
{
  $("#successNotification").show();
  window.scrollTo(0, 0);
}

socket.on('newRoomScene', function(data){
  jsonObj = JSON.parse(data);
  showDetail(jsonObj);
});

socket.on('roomScene', function(data) {
  jsonObj = JSON.parse(data);
  showDetail(jsonObj);
});

$(document).on('click', "#detailSave", function () {
    socket.emit('updateRoomScene', JSON.stringify(getRoomScene(jsonObj)));
});

$(document).on('click', "#detailBack", function () {
    window.location = "/roomScene";
});

socket.on('updateResult', function(data) {
  window.location = "/roomSceneDetail?id=" + data._id + "&updated=1";
});
