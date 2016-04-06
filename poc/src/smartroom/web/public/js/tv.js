var tv =
  (function() {

    var socket = io.connect('http://192.168.0.3:3002');
    function sendSignal(type, deviceType, name, value) {
      var jsonObj = [{
        type: type,
        deviceType: deviceType,
        deviceName: name,
        value: value
      }];
      socket.emit('message', JSON.stringify(jsonObj));
    }

    var controlPad = {
      activeClassTag: 'active',
      volume: {
        up: function() {
          console.log('ACTION --> volume up');
          sendSignal("VolumeUp", 'IR_REMOTE', 'remoteTVLG', null);
          /*
           if (!obj.simulate) {
            // if not for simulation, send signal out for live action
            // [todo] send signal for real action...
          }
          */

        },
        down: function() {
          console.log('ACTION --> volume down');
          sendSignal("VolumeDown", 'IR_REMOTE', 'remoteTVLG', null);
        }
      },
      channel: {
        up: function() {
          console.log('ACTION -->channel up');
          sendSignal("ChannelUp", 'IR_REMOTE', 'remoteTVBox', null);
        },
        down: function() {
          console.log('ACTION --> channel down');
          sendSignal("ChannelDown", 'IR_REMOTE', 'remoteTVBox', null);
        }
      },

      keyNumPressed: function(keyNum) {
        // 'action_keyname' from numpad
        console.log('[TV] keyNum Pressed: ' + keyNum);
        sendSignal(keyNum.toString(), 'IR_REMOTE', 'remoteTVBox', null);
      },

      power: function(obj) { // 0 = off; 1 = on
        //obj.classList.toggle(this.activeClassTag);
        // toggle 0 or 1 on the data-value attribute

        obj.classList.add(this.activeClassTag);
        var curVal = this.getDataValue(obj);
        console.log('ACTION --> power: cur=' + curVal);
        sendSignal("Power", 'IR_REMOTE', 'remoteTVLG', null);
      },

      mute: function(obj) { // 0 = off; 1 = on
        //obj.classList.toggle(this.activeClassTag);
        // toggle 0 or 1 on the data-value attribute

        obj.classList.add(this.activeClassTag);
        var curVal = this.getDataValue(obj);
        console.log('ACTION --> mute: cur=' + curVal);
        sendSignal("Mute", 'IR_REMOTE', 'remoteTVLG', null);
      },

      getDataValue: function(obj) {
        return obj.getAttribute('data-value');
      },
      initialize: function() {
        var obj = this;

        var numkeys = document.querySelectorAll('.tv-control .btn[data-role="tv"]');

        for (var i = 0; i < numkeys.length; i++) {
          numkeys[i].addEventListener('touchend', action, false);
          numkeys[i].addEventListener('mouseup', action, false);
        }

        if (numpad) {
          var obj;
          numpad.subscribe(obj.keyNumPressed);
          if (typeof debug != 'undefined' && debug)
            console.info('Subscribing numpad...');
        }

        // set 'active' mode for mute and power buttons if their data-value = 1
        var mute = document.querySelector('.tv-control .btn[data-role="tv"][data-key="mute"]');
        var power = document.querySelector('.tv-control .btn[data-role="tv"][data-key="power"]');
        if (obj.getDataValue(mute) == 1) mute.classList.add(obj.activeClassTag);
        if (obj.getDataValue(power) == 1) power.classList.add(obj.activeClassTag);

        function action(evt) { // event handler
          evt.preventDefault();
          var target = evt.srcElement;
          if (target.tagName == 'SPAN' || target.tagName == 'I') {
            target = target.parentElement;
          }

          var datakey = target.getAttribute('data-key');
          if (typeof debug != 'undefined' && debug)
            console.log('Key pressed : ' + datakey);

          var fn = target.getAttribute('data-fn');
          if (fn) eval('obj.' + fn + '(target)');

          if (datakey != 'mute' && datakey != 'power') {
            target.classList.add(obj.activeClassTag);

            var ms = 500;
            // wait 'ms' (e.g.,500ms) time-up and then remove 'active' from classList
            setTimeout(function() {
              var t = target,
                o = obj;

              if (typeof debug != 'undefined' && debug) {
                console.log('[' + ms + 'ms] Remove "' + o.activeClassTag + '" from ' + t.tagName + '\n --> ' + t.outerHTML);
              }

              t.classList.remove(o.activeClassTag);
            }, ms);
          }

        }

      }

    }; // end of "controlPad"

    controlPad.initialize();

    return controlPad;

  })();
