var bone = require('bonescript');
var dndPin,
	makeuproomPin,
	laundryPin,
	bellPin,
	dndName,
	makeuproomName,
	laundryName,
	bellName,
	dndValue,
	makeuproomValue,
	laundryValue,
	bellValue;

var dndConfig = {
		overrideAccessControl: 1,
		lightOnWhenActive: 1,
		notifyManagementSystem: 1
	},
	makeuproomConfig = {
		lightOnWhenActive: 1,
		notifyManagementSystem: 1
	},
	laundryConfig = {
		lightOnWhenActive: 1,
		notifyManagementSystem: 1
	},
	bellConfig = {
		lightOnWhenActive: 1,
		notifyBuzzer: 1
	};

module.exports = courtesy;

function courtesy(device){
	for(var i=0; i < device.length; i++){
		switch(device[i].name){
			case "dnd":
				this.dndName = device[i].name;
				this.dndPin = device[i].pin;
				//this.dndValue = 'READY';
				break;
			case "makeuproom":
				this.makeuproomName = device[i].name;
				this.makeuproomPin = device[i].pin;
				//this.makeuproomValue = 'READY';
				break;
			case "laundry":
				this.laundryName = device[i].name;
				this.laundryPin = device[i].pin;
				//this.laundryValue = 'READY';
				break;
			case "bell":
				this.bellName = device[i].name;
				this.bellPin = device[i].pin;
				//this.bellValue = 'READY';
				break;
		}
	}
}

courtesy.prototype.setDndValue = function(value){
	this.dndValue = value;
	if (this.dndPin != ''){
		bone.pinMode(this.dndPin, bone.OUTPUT);
		bone.digitalWrite(this.dndPin, this.dndValue == 'ACTIVE'? 1 : 0);
	}
}

courtesy.prototype.getDndValue = function(){
	return this.dndValue;
}

courtesy.prototype.getDndName = function(){
	return this.dndName;
}

courtesy.prototype.setMakeupRoomValue = function(value){
	this.makeuproomValue = value;
	if (this.makeuproomPin != ''){
		bone.pinMode(this.makeuproomPin, bone.OUTPUT);
		bone.digitalWrite(this.makeuproomPin, this.makeuproomValue == 'ACTIVE'? 1 : 0);
	}
}

courtesy.prototype.getMakeupRoomValue = function(){
	return this.makeuproomValue;
}

courtesy.prototype.getMakeupRoomName = function(){
	return this.makeuproomName;
}

courtesy.prototype.setLaundryValue = function(value){
	this.laundryValue = value;
	if (this.laundryPin != ''){
		bone.pinMode(this.laundryPin, bone.OUTPUT);
		bone.digitalWrite(this.laundryPin, this.laundryValue == 'ACTIVE'? 1 : 0);
	}
}

courtesy.prototype.getLaundryValue = function(){
	return this.laundryValue;
}

courtesy.prototype.getLaundryName = function(){
	return this.laundryName;
}

courtesy.prototype.setBellValue = function(value){
	console.log('bellConfig.notifyBuzzer:' + bellConfig.notifyBuzzer);
	if (bellConfig.notifyBuzzer == 1 || bellConfig.notifyBuzzer == 'true'){
		console.log('notifyBuzzer');
		this.bellValue = value;
		bone.pinMode(this.bellPin, bone.OUTPUT);
		bone.digitalWrite(this.bellPin, this.bellValue == 'ACTIVE'? 1 : 0);
	}
}

courtesy.prototype.getBellName = function(){
	return this.bellName;
}

courtesy.prototype.setConfig = function(config){
	if (config.Service == 'dnd'){
		dndConfig[config.Config] = config.Value;
		console.log('dndConfig:' + JSON.stringify(dndConfig));
	}else if (config.Service == 'makeuproom'){
		makeuproomConfig[config.Config] = config.Value;
		console.log('makeuproomConfig:' + JSON.stringify(makeuproomConfig));
	}else if (config.Service == 'laundry'){
		laundryConfig[config.Config] = config.Value;
		console.log('laundryConfig:' + JSON.stringify(laundryConfig));
	}else if (config.Service == 'bell'){
		bellConfig[config.Config] = config.Value;
		console.log('bellConfig:' + JSON.stringify(bellConfig));
	}
}

