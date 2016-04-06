var numpad = 
(function() {
  var pad = {
    activeClassTag : 'active',
    active_btn     : null,
    simulate       : true,  // is it a simulation?
  
    subscribers    : [],

    action_keyName: -1,   // positive integer; otherwise, -1 = unspecified


    subscribe: function(fn) {
       this.subscribers.push(fn);
    },

    unsubscribe : function(fn) {
      this.subscribers = this.subscribers.filter(
        function(item) {
          if (item != fn) return item;
        }
      );
    },

    notify: function(keyName) { 
      for (var i = 0; i < this.subscribers.length; i++) {
          this.subscribers[i](keyName);
      }
    },

    initialize: function() {  // add event handlers to number keys
      var obj = this;

      function action (evt) {  // event handler
        evt.preventDefault();
        var target = evt.srcElement;
        if (target.tagName == 'SPAN') {
            obj.action_keyName = target.innerText;
            target = target.parentElement;
        }
        else {
          var children = target.children;
          if (children.length == 0) { // something wrong - it shouldn't occur!!!
            return; // silently exit or raise error??
          }

          obj.action_keyName = children[0].innerText;  // always the 1st child
        }

        if (typeof debug != 'undefined' && debug) 
          console.info( 'action key : ' + obj.action_keyName );

        target.classList.add(obj.activeClassTag);

        /************************************/
        obj.notify(obj.action_keyName);
        //if (numpad) numpad(obj.action_keyName);
   
        if (!obj.simulate) {  
           // if not for simulation, send signal out for live action
// [todo] send signal for real action...
        }
        /************************************/

        var ms = 500;
        // wait 'ms' (e.g.,500ms) time-up and then remove 'active' from classList
        setTimeout(function() {
          var t = target, o = obj;

          if (typeof debug != 'undefined' && debug) {
            console.log('[' + ms + 'ms] Remove "' + o.activeClassTag +'" from ' + t.tagName 
                         + '\n --> ' + t.outerHTML);
          }

          t.classList.remove(o.activeClassTag);
        }, ms);

      }

      var numkeys = document.querySelectorAll('.pad .btn');

        for (var i=0; i < numkeys.length; i++) {
          numkeys[i].addEventListener('touchend', action, false);
          numkeys[i].addEventListener('mouseup', action, false);
       }
      }  // end of initialize()

    

  };  // end of "pad"


   pad.initialize();

   return pad;
   
})();
