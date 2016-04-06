var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var MESSAGE_CHANNEL = 'message';
var ACK_CHANNEL = 'acknowledge';
var MODULE_FUNC = {
  COMMAND: 'COMMAND'
};

module.exports = speakup;

function speakup(deviceType, deviceName, port, baudRate, commands, socketio) {
  var sp = new SerialPort(port, {
    baudrate: baudRate
  });

  sp.on('error', function(error){
    console.log(error);
  });
  
  sp.on("open", function() {
    sp.on('data', function(data) {
      if (data !== undefined && Buffer.isBuffer(data)) {
        var index = data.toJSON()[0];
        console.log(index);
        for (var i in commands) {
          if (commands[i].index === index) {
            console.log(commands[i].name);
            sendMessage(socketio, MODULE_FUNC.COMMAND, deviceType, deviceName, commands[i].name);
          }
        }
      }
    });
  });

  var cleanup = require('./../utility/cleanup').Cleanup(function() {
    sp.close();
  });
}

function sendMessage(masterIO, msgType, deviceType, deviceName, value) {
  if (masterIO !== undefined && masterIO !== null) {
    var jsonObj = {
      type: msgType,
      deviceType: deviceType,
      deviceName: deviceName,
      value: value
    };
    masterIO.emit(MESSAGE_CHANNEL, JSON.stringify([jsonObj]));
    masterIO.emit(ACK_CHANNEL, JSON.stringify([jsonObj]));
  }
}
