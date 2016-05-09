goog.provide('canvasEvents')
goog.require('initCanvas')
goog.require('ui')
goog.require('states')

console.log("Enter canvasEvents.js")

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
		console.log("Add a node");
		if (evtTarget === cy) //tap on background
		{					
			console.log("Really Add a node");
			cy.add(
			{
				data: { 
					name: ++total_pages,
					text: "page text",
					img: "none",
					audio: "none",
					textcontainers: [],
					decisioncontainers: [],
					styleHTML: ""
				},
				classes: "page",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}
		if (cy.elements().size() === 1)
			cy.$('node').first().addClass('start');		
	}
	
	else if (current_state === states.NEWCONTROL)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: ++total_pages, 
					text: "control node text"
				},
				classes: "control",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
})

cy.on('select', function(event)
{
	//some dynamic colouring of relevant edges/nodes to the selected node
	if (event.cyTarget.isNode())
	{
		event.cyTarget.outgoers().addClass('parent-selected'); //distinguish edges coming from this node
		event.cyTarget.successors().leaves().addClass('leaf'); //distinguish the end points reachable from this node
	}
	
	console.log("Select event fired ", event.cyTarget.data('id'));
	//disable the additive selection behaviour when holding ctrl, alt, shift when we are in connection mode
	if (current_state === states.CONNECTING)
	{
		var oldselect = cy.$(':selected').diff(event.cyTarget);
		oldselect.left.unselect();
		
		//if adding a new connection
		createConnection(event.cyTarget);
	}
	
	$(".selectionbutton").show();
})

cy.on('unselect', function(event)
{
	if (event.cyTarget.isNode())
	{
		event.cyTarget.outgoers().removeClass('parent-selected');
		event.cyTarget.successors().leaves().removeClass('leaf');
	}

	console.log("Unselect event fired ", event.cyTarget.data('id'));

	if (cy.$(':selected').size() === 0) //sometimes we had more than one selected
		$(".selectionbutton").hide(); //delete and edit buttons

})
