var debug = false;
if (debug) {
  $("#clearAllData").removeClass('hide');
}

var socket = io.connect('ws://' + $("#serverAddress").text());

socket.on('connect', function(data) {
  socket.emit('join', 'monitor');
});

socket.emit('getDeviceAlarm');

socket.on('deviceAlarm', function(data) {
  var json = JSON.parse(data);
  var result = '<table class="table">';

  result += generateTableRow(['Room#', 'Name', 'Out Room Time', 'In Room Time']);
  json.forEach(function(item) {
    result += generateTableRow([item.roomId, item.name, dateTimeFormatter(item.outDateTime), dateTimeFormatter(item.inDateTime)]);
  });

  result += '</table>';
  $('#alarmTable').html(result);
});

function generateTableRow(array) {
  var result = '<tr>';
  array.forEach(function(item) {
    result += '<th>' + item + '</th>';
  });
  result += '<tr>';
  return result;
}

function dateTimeFormatter(date) {
  if (date !== null) {
    var d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  } else {
    return '';
  }
}

$("#clearAllData").click(function() {
  socket.emit('deleteAllDeviceAlarm');
});
