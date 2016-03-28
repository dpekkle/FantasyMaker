goog.provide('interactCanvas')
goog.require('initCanvas')

console.log("Enter interactCanvas.js")

total_pages = 0;

//little state enum for the current state the canvas is in
states = {
	DEFAULT: 0,
	CONNECTING: 1, //i.e. connecting two pages
};

current_state = states.DEFAULT;

cy.on('tap', function(event){
	var evtTarget = event.cyTarget;
	
	if (evtTarget === cy) //tap on background
	{		
		cy.add({
			data: { id: ++total_pages, text: "new element text"},
			group: "nodes",
			renderedPosition: event.cyRenderedPosition,
			classes: "page"
		})
	}
	else
	{

	}
})

cy.on('select', function(event){
	
	//update UI
	var element = cy.$(':selected') //get the currently selected element
	
	console.log("Select: ", element.data('id'))
	
	//if adding a new link
	if (current_state == states.CONNECTING)
	{
		console.log("Creating link from ", source_node.data('id'), " to ", element.data('id'))

		cy.add({
			data: {	source: source_node.data('id'), target: element.data('id')},
			group: "edges",
		})
		
		current_state = states.DEFAULT;
		
		$('.linkbutton').css("background-color", "#dddddd");

	}
	
	if (element.hasClass('page'))
	{
		$("#editpage").show();		
		
		$("#pagename").text("Page " + element.data('id'));
		document.getElementById("pagetext").value = element.data('text'); //jquery dodgey with textarea
		
	}
	else if (element.hasClass('decision'))
	{
		$("#editdecision").show();
		$("#decisionname").text("Decision " + element.data('id'));
	}
})

cy.on('unselect', function(event)
{
	if (cy.$(':selected').empty())
	{
		console.log("No element selected");
		$("#editpage").hide();
		$("#editdecision").hide();
		
	}
})