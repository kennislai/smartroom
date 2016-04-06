var asyn = require('async');
var config = require('./config.json'),
  curtain = require('./../../device/curtain/curtain');

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
  function(err, results) {
    console.log(err);
  }
);

function connectMaster() {
  var masterio = require('socket.io-client')(config.server);
  masterio.on('connect', function(data) {
    console.log('Connected to Master:' + config.server);
    for (var i = 0; i < config.subscribe.length; i++) {
      masterio.emit('join', config.subscribe[i]);
    }
    masterio.emit('refreshStatusFromState');
  });
  return masterio;
}

function initialize(masterio) {
  console.log('initialize');
  var c1 = new curtain('c1');

  masterio.on('message', function(data) {
    console.log('Message from Master:' + data);
    var json = JSON.parse(data);
    for (var i = 0; i < json.length; i++) {
      if (json[i].deviceType == 'CURTAIN') {
        if (json[i].type == "OPEN") {
          c1.open();
        } else if (json[i].type == "CLOSE") {
          c1.close();
        } else if (json[i].type == "STOP") {
          c1.stop();
        }

        masterio.emit('acknowledge', JSON.stringify([json[i]]));
      }
    }
  });
}
