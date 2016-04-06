
var debug = true;

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

  var c = {
    activeClassTag : 'active',
    open : function() {
       console.log('[curtain] does fullyopen');
       sendSignal("OPEN", 'CURTAIN', 'roomCurtain', null);
    },
    close : function() {
       console.log('[curtain] does fullyclose');
        sendSignal("CLOSE", 'CURTAIN', 'roomCurtain', null);
    },
    stopAll : function () {
       console.log('--> Do stop()');
        sendSignal("STOP", 'CURTAIN', 'roomCurtain', null);
    } ,

    _stop : function (direction) {
       console.log('--> Do _stop() for direction = ' + direction);
    } ,
    stopOpen : function () {
       console.log('[curtain] stops open');
       this._stop(1);
    } ,
    stopClose : function () {
       console.log('[curtain] stops close');
       this._stop(0);
    } ,

    initialize: function() {
      var obj = this;

      var btns = document.querySelectorAll('.curtain .btn[data-role="curtain"]');
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('touchend', action , false);
        btns[i].addEventListener('mouseup', action , false);
      }

      // Find the parent of obj with a specific classname
      // By default, hop 2 times up to locate the parent if 'hop' is undefined
      // Return 'undefined' for parent not found; otherwise the parent of the obj.
      function parent(obj, classname, hop) { /* hop is optional */
        if (!hop) hop = 2;
        if (hop > 0) {
          hop--;
          var p = obj.parentElement;
          if (p.classList.contains(classname)) 
            return p;
          else  {
            return parent(p, classname, hop);
          }
        }
        else  // no more hop
          return 'undefined';  // parent not found
      }

      function action(evt) { // event handler
        evt.preventDefault();  

        var target = evt.srcElement;   
        if (!target.classList.contains('btn')) {
           target = parent(target, 'btn');
        }

        if (target) {
          if (typeof debug != 'undefined' && debug) {
            console.log('[btn pressed] ' +  target.tagName +': ' + target.classList);
          }

          target.classList.add(obj.activeClassTag);

          var fnName = target.getAttribute('data-fn');
          if (fnName) {
            var fn = eval('(function(){ obj.'+fnName+'() } )');
            fn();
          }

          var ms = 500;
          // wait 'ms' (e.g.,500ms) time-up and then remove 'active' from classList
          setTimeout(function() {
            var t = target, o = obj;

            if (typeof debug != 'undefined' && debug) {
               console.log('[' + ms + 'ms] Remove "' + o.activeClassTag +'" from ' + t.tagName 
                           + '\n --> ' + t.classList);
            }

            t.classList.remove(o.activeClassTag);
          }, ms);  

       }
      }  // end of 'action' event handler


    } // end of "initialize"
  };  // end of "c"

  c.initialize();
  return c;

})();