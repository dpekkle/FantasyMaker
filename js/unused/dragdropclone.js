goog.provide('dragdrog')

interact('.draggable')
.draggable({ manualStart: true })
.on('move', function (event) {
var interaction = event.interaction;

// if the pointer was moved while being held down
// and an interaction hasn't started yet 
if (interaction.pointerIsDown && !interaction.interacting()) {
  var original = event.currentTarget,
	  // create a clone of the currentTarget element
	  clone = event.currentTarget.cloneNode(true);

  // insert the clone to the page
  // TODO: position the clone appropriately
  document.body.appendChild(clone);

  // start a drag interaction targeting the clone
  interaction.start({ name: 'drag' },
					event.interactable,
					clone);
}   
}); 