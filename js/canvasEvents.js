goog.provide('canvasEvents')
goog.require('initCanvas')
goog.require('ui')
goog.require('states')

console.log("Enter canvasEvents.js")

total_pages = 0;
source_node = null;

//tap event has concurrency differences between touchscreen and mouse in chrome
cy.on('tap', function(event)
{
	var evtTarget = event.cyTarget;
	
	if (evtTarget === cy)
		cy.$(':selected').unselect(); //touch screen doesn't seem to do this by default
	
	if (current_state === states.CONNECTING)
	{
		// method to "deselect" a source node for connections
		if (evtTarget === source_node || evtTarget === cy)
		{
			if (source_node !== null)
			{
				//remove source node
				source_node.removeClass("source_node"); //remove the style associated with source nodes
				source_node = null; //remove stored source node
			}
		}
	}
	
	if (current_state === states.NEWPAGE)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					id: ++total_pages, 
					text: "page text",
					img: "none",
					audio: "none",
				},
				classes: "page",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	
	else if (current_state === states.NEWCONTROL)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					id: ++total_pages, 
					text: "control node text"
				},
				classes: "control",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	//make the "first" node a start node, needn't run with every tap though
})

cy.on('select', function(event)
{
	console.log("Select event fired ", event.cyTarget.data('id'));
	
	//disable the additive selection behaviour when holding ctrl, alt, shift when we are in connection mode
	if (current_state === states.CONNECTING)
	{
		var oldselect = cy.$(':selected').diff(event.cyTarget);
		oldselect.left.unselect();
		
		//if adding a new connection
		createConnection(event.cyTarget);
	}
	
	hideEditPanes();
	updateEditPane(event.cyTarget);

	// Selected element functions
	$(".selectionbutton").show();
})

cy.on('unselect', function(event)
{
	console.log("Unselect event fired ", event.cyTarget.data('id'));

	//only want to display the edit pane when one node is selected
	if (cy.$(':selected').size() !== 1)
	{
		//hide pane
		hideEditPanes();
	}
	else
	{
		console.log("Only one selected")
		hideEditPanes();
		updateEditPane(cy.$(':selected'));
	}
})
