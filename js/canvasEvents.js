goog.provide('canvasEvents')
goog.require('initCanvas')
goog.require('ui')
goog.require('states')

console.log("Enter canvasEvents.js")

total_pages = 0;
source_node = null;

cy.on('tap', function(event)
{
	var evtTarget = event.cyTarget;
	if (current_state === states.CONNECTING)
	{
		// if someone is trying to connect nodes but doesn't click on a node then we give them another shot
		if (cy.$(':selected').empty())
		{
			console.log("USER: please select a valid node to connect to")
			if (source_node !== null)
				source_node.select();
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
	cy.$('node').first().addClass('start');
})

cy.on('select', function(event)
{
	console.log("Select event fired ", event.cyTarget.data('id'));
	
	//disable the additive selection behaviour when holding ctrl, alt, shift when we are in connection mode
	if (current_state === states.CONNECTING)
	{
		var oldselect = cy.$(':selected').diff(event.cyTarget);
		oldselect.left.unselect();
	}
	
	//if adding a new connection
	createConnection(event.cyTarget);

	hideEditPanes();
	updateEditPane(event.cyTarget);
	$(".deletebutton").show();
})

/* 	if someone clicks on an element already selected while trying to connect nodes the "select" event doesn't fire, 
	but they clearly want the selected node as a target/source for a connection	*/
cy.on('tap', ':selected', function(event)
{
	if (current_state === states.CONNECTING)
	{
		if (source_node == null)
		{
			console.log("Connection node registered as currently selected node")
			createConnection(cy.$(':selected')) 
		}	
		else
		{
			console.log("tapped the source_node");
			source_node.removeClass("source_node");
			source_node = null;	
		}
	}
})

cy.on('unselect', function(event)
{
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
