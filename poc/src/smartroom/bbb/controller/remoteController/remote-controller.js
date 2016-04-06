var asyn = require('async');
var config = require('./config.json');
var IRRemote = require('./../../device/ir-remote');

var remoteList = [];

asyn.waterfall([
    function(callback) {
      var masterio = connectMaster();
      callback(null, masterio);
    },
    function(masterio, callback) {
      initialize(masterio);
      callback(null);
    }
  ],
  // optional callback
  function(err, results) {}
);

function connectMaster() {
  var masterio = require('socket.io-client')(config.server);
  masterio.on('connect', function(data) {
    console.log('Connected to Master:' + config.server);
    for (var i = 0; i < config.subscribe.length; i++) {
      masterio.emit('join', config.subscribe[i]);
    }
  });
  return masterio;
}

function initialize(masterio) {
  console.log('initialize');
  for (var i = 0; i < config.devices.length; i++) {
    switch (config.devices[i].type) {
      case "IR_REMOTE":
        var device = config.devices[i];
        var commandSet = config.commandSet[device.type][device.brand];
        remoteList.push(new IRRemote(device.name, device.pin,
          masterio, commandSet, config.protocol[commandSet.protocol]));
        break;
    }
  }
}
