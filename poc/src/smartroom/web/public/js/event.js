
  // obj: target object
  // classAttr: class name of CSS class
  function toggle(obj, classAttr) {
    var c = obj.attr('class');
    if (c && c.search(classAttr) != -1) {
      obj.removeClass(classAttr);
      //setTimeout(function(){ obj.removeClass(classAttr); }, 500);  // remove attr after 0.5s
    }
    else {
      obj.addClass(classAttr);
      //setTimeout(function(){ obj.addClass(classAttr); }, 500);    // add attr after 0.5s
    }
  }
 
  $('.btn').click( function() { 
    var gp = $(this).parent('.irm-btn-group'); 
    if (gp && gp.length > 0) { 
      gp.children().removeClass('active');
      $(this).addClass('active');      
    }
    else { 
      toggle($(this), 'active');
    } // else
  })


