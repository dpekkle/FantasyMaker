goog.provide('canvasEvents')
goog.require('initCanvas')
goog.require('ui')
goog.require('states')

console.log("Enter canvasEvents.js")

total_pages = 0;

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
					text: "page text"
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
	cy.$('node').first().addClass('start');
})

cy.on('select', function(event)
{
	//update UI
	var element = cy.$(':selected') //get the currently selected element
	$(".deletebutton").show();
	
	console.log("Select: ", element.data('id'))
	
	//if adding a new connection
	createConnection(element);
	updateEditPane(element);
})

/* 	if someone clicks on an element already selected while trying to connect nodes the "select" event doesn't fire, 
	but they clearly want the selected node as a target/source for a connection	*/
cy.on('tap', ':selected', function(event)
{
	if (current_state === states.CONNECTING && source_node == null)
	{
		console.log("Connection node registered as currently selected node")
		createConnection(cy.$(':selected')) 
	}	
	else if(source_node !== null)
	{
		console.log("tapped the source_node");
		source_node.removeClass("source_node");
		source_node = null;	
	}
})

cy.on('unselect', function(event)
{
	if (cy.$(':selected').empty())
	{
		//hide pane
		hideEditPanes();
	}
})