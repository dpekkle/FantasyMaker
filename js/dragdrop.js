goog.provide('dragdrog')
goog.require('clickBehaviour')

//defines the behaviour of all elements with the CSS class type "drag-element"
interact('.drag-element')
	.preventDefault('always')
	.allowFrom('.handle') //not working, making it so that you cant really drag textarea
	.draggable({
		'manualStart' : true,      
		'onmove' : function (event) 
		{
			var target = event.target;
			event.target.classList.remove('dropped'); //if we are moving an element for a second time

			var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

			// translate the element
			target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

			// update the position attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		},
		'onend' : function (event) 
		{
			//destroy the element if we place it anywhere EXCEPT the drop zone
			if (event.currentTarget.classList.contains('can-drop'))
			{
				console.log('Keep element');
			}
			else
			{
				console.log('Remove element ', event.currentTarget.classList)
				event.currentTarget.parentNode.removeChild(event.currentTarget);
			}
		}
	})
	.on('move', function (event) //manual start definition, needed to clone the element when selected
	{
		var interaction = event.interaction;

		// if the pointer was moved while being held down
		// and an interaction hasn't started yet
		if (interaction.pointerIsDown && !interaction.interacting() && event.currentTarget.classList.contains('drag-element-source')) 
		{
			var original = event.currentTarget;
			
			// create a clone of the currentTarget element
			
			var clone = original.cloneNode(true);
			
			console.log("Element id: ", original.className);
			console.log("clone id: ", clone.className);
					
			clone.className = clone.className.replace(/\bdrag-element-source\b/,''); // Remove CSS class - http://stackoverflow.com/a/2155786/4972844
			
			//TODO: move the clone to the mouse, or the location of the source
			// insert the clone to the page		
			document.getElementById('form-container').appendChild(clone); 
			
			// start a drag interaction targeting the clone
			interaction.start({ name: 'drag' }, event.interactable, clone);	
		} 
		else 
		{
			interaction.start({ name: 'drag' }, event.interactable, event.currentTarget);
		}
	});	
// defines the drop area and it's behaviour, drag elements above are received here
interact('#drop-container').dropzone(
{
	// only accept elements matching this CSS selector
	accept: '.drag-element',
	// Require a 75% element overlap for a drop to be possible
	overlap: 0.75,

	// listen for drop related events:
	ondropactivate: function (event) 
	{      
		// add active dropzone feedback
		event.target.classList.add('drop-active');     
	},
	ondragenter: function (event) 
	{      
		var draggableElement = event.relatedTarget;
		var dropzoneElement = event.target;

		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target');
		draggableElement.classList.add('can-drop');     
	},
	ondragleave: function (event) 
	{     
		// remove the drop feedback style
		event.target.classList.remove('drop-target');
		event.relatedTarget.classList.remove('can-drop');	  
	},
	ondrop: function (event) 
	{
		console.log('Drop Zone: ', event);
		console.log('Dropped Element: ', event.relatedTarget);

		event.relatedTarget.classList.remove('can-drop');
		event.relatedTarget.classList.add('dropped');
	},
	ondropdeactivate: function (event) 
	{   
		// remove active dropzone feedback
		event.target.classList.remove('drop-active');
		event.target.classList.remove('drop-target');
		  
	}
});
