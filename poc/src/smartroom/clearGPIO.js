var b = require('bonescript');

var pins = [
'P9_18',
'P9_17',
'P8_13',

'P9_23',
'P9_25',

'P9_11',
'P9_13',
'P9_15',

'P9_12',
];

for (var i in pins) {
  b.digitalWrite(pins[i], 0);
}

var dimmingPin = 'P9_14';
b.analogWrite(dimmingPin, 0);
