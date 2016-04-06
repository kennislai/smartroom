var PythonShell = require('python-shell');
var path = require("path");

var MESSAGE_CHANNEL = 'message';

module.exports = irRemote;

function irRemote(name, pin, masterio, commandSet, protocol) {
	this.pin = pin;
	this.name = name;
	this.connectMaster(masterio, name, commandSet, protocol);
}

irRemote.prototype.getName = function getName() {
	return this.name;
};

irRemote.prototype.connectMaster = function connectMaster(masterIO, deviceName,
	commandSet, protocol) {
	var self = this;
	masterIO.on(MESSAGE_CHANNEL, function(data) {
		var json = JSON.parse(data);
		for (var i = 0; i < json.length; i++) {
			if (json[i].deviceName == deviceName) {
				self.sendIRCommand(commandSet[json[i].type], protocol, null);
			}
		}
	});
};

irRemote.prototype.sendIRCommand = function(code, protocol, callback) {
	var options = {
		scriptPath: path.resolve(__dirname,
			'../../libraries/IR_Remote/'),
		args: [JSON.stringify(protocol), code, this.pin]
	};

	PythonShell.run('IRSend.py', options,
		function(err, results) {
			if (err) {
				console.log(err);
			}
			if (callback) {
				console.log(result);
				callback(results);
			}
		});
};
