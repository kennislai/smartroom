function injectChunk(chunkSelector, targetSelector) {
  var links = document.querySelectorAll('link[rel="import"]');
  if (links) {
    for (var i = 0; i < links.length; i++) {
      var segments = links[i].import.querySelectorAll(chunkSelector);
      if (segments && segments.length > 0) {
        for (var j = 0; j < segments.length; j++) {
          document.querySelector(targetSelector).appendChild(segments[j].cloneNode('true'));
        }
      }
    } // for
  } // links
}


// Inject code segment by template into a single target element.
// If no chunk is found, silently exit.
function injectChunkTemplate(chunkSelector, targetSelector) {
  var imported = document.querySelectorAll('link[rel="import"]');
  
  if (imported) {
    for (var i = 0; i < imported.length; i++) {
      var templateDoc = imported[i].import;
      var templates = templateDoc.querySelectorAll('template');      

      if (templates && templates.length > 0) {
        for (var j = 0; j < templates.length; j++) {
          var segments = templates[j].content.querySelectorAll(chunkSelector);
          if (segments && segments.length > 0) {
            for (var k = 0; k < segments.length; k++) {
              var clone = document.importNode(segments[k], true);
              document.querySelector(targetSelector).appendChild(clone);   
            }
          }
        }
      }
    }
  }
}
