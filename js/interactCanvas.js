goog.provide('interactCanvas')
goog.require('initCanvas')
goog.require('ui')

console.log("Enter interactCanvas.js")

total_pages = 0;

cy.on('tap', function(event){
	var evtTarget = event.cyTarget;

	if (current_state === states.CONNECTING)
	{
		// if someone is trying to connect nodes but doesn't click on a node then we give them another shot
		if (cy.$(':selected').empty())
		{
			console.log("USER: please select a valid node to connect to")
			source_node.select();
		}
	}
	
	if (current_state === states.NEWPAGE)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add({
				data: { id: ++total_pages, text: "new element text"},
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
				classes: "page"
			})
		}		
	}
	
	else if (current_state === states.NEWDECISION)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add({
				data: { id: ++total_pages},
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
				classes: "decision"
			})
		}		
	}
})

cy.on('select', function(event){
	
	//update UI
	var element = cy.$(':selected') //get the currently selected element
	$(".connectionmode").show(); //we only want connectionmode to be visible if an element is selected
	
	console.log("Select: ", element.data('id'))
	
	//if adding a new link
	if (current_state == states.CONNECTING)
	{
		console.log("Creating link from ", source_node.data('id'), " to ", element.data('id'))

		if (source_node.data('id') != element.data('id'))
		{
			cy.add({
				data: {	source: source_node.data('id'), target: element.data('id')},
				group: "edges",
			})	
		
			source_node = cy.$(':selected'); //set the newly selected page as the source node
		}
	}
	
	//display decision info on selection
	if (element.hasClass('decision'))
	{
		$("#editdecision").show();	
		$("#decisionname").text("Decision " + element.data('id'));
	}
	
	//display page info on selection	
	else if (element.hasClass('page'))
	{
		$("#editpage").show();		
		
		$("#pagename").text("Page " + element.data('id'));
		document.getElementById("pagetext").value = element.data('text'); //jquery dodgey with textarea
		
	}
})

cy.on('unselect', function(event)
{
	if (cy.$(':selected').empty())
	{
		console.log("No element selected");
		$("#editpage").hide();
		$("#editdecision").hide();		
		$(".connectionmode").hide();
	}
})