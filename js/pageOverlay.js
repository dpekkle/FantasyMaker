goog.provide('pageOverlay')

function prepareForGame() //this updates the HTML for every page etc... into the appropriate cytoscape node
{
	var eles = cy.elements();
	for (var i = 0; i < eles.length; i++)
	{
		showPageOverlay(eles[i]);
		closeOverlay(eles[i]);
	}
}

function showPageOverlay(element)
{
	//element is null when we are simply opening a selected node in cy. 
	//if we pass an element we are creating the HTML markup of the page
	var selected = element;
	if (element === null) 
		var selected = cy.$(':selected')[0];	

	$(".toolbar").hide(); //hide all toolbars
	$("#modalcontainers").children().hide();
	overlayToolbar(selected);
	
	//update contents of page view
	if (selected.hasClass('page'))
	{
		$("#pagecontainers").show();
		$('#pagecontainers #pagetext').val(escapeHtml(selected.data('text')));	

		//create the decision buttons dynamically
		outgoingEdges = selected.outgoers().edges();
		for (var i = 0; i < outgoingEdges.size(); i++)
		{
			//one button per edge
			//$("#drag-container").append("<button class = 'decisionbutton' id='decision" + i + "'>" + escapeHtml(outgoingEdges.eq(i).data('text')) + "</button>");
			$("#drag-container").append("<button class = 'drag-element' id='decision" + i + "'>" + escapeHtml(outgoingEdges.eq(i).data('text')) + "</button>");
			//CHANGED CLASS TO DRAG-ELEMENT
		
		}
	}
	
	if (selected.isEdge())
	{
		$("#connectioncontainers").show();
		//this is where we define all the connection stuff that shows up in the overlay
		$('#connectioncontainers #decisiontext').val(escapeHtml(selected.data('text')));	
		
	}
	if (selected.hasClass('control'))
	{
		$("#controlcontainers").show();
		$("#controlcontainers #controltext").val(escapeHtml(selected.data('text')));		
	}
	
	
	//now lets actually show the modal i.e. overlay
	if (element === null)
		document.getElementById("Modal").showModal();
}

function overlayToolbar(element)
{
	//display control info on selection
	if (element.hasClass('control'))
	{
		$("#controltoolbar").show();	
		$("#controlname").text("control " + element.data('id'));
	}
	//display page info on selection	
	else if (element.hasClass('page'))
	{
		$("#pagetoolbar").show();				
		$("#pagename").text("Page " + element.data('id'));					
		changeImage(element);
		changeAudio(element);
	}
	else if (element.isEdge()) //will probably need checks for each type of edge
	{
		$("#connectiontoolbar").show();
		$("#connectionname").text("Connection");
	}
}

function closeOverlay(element)
{
	if (element === null)
		document.getElementById("Modal").close();
	
	//save the contents of the page to the associated page
	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];
	
	if (selected.hasClass('page'))
	{
		//store the innerHTML of the page overlay in the actual cytoscape page data
		selected.data('styleHTML', $('#pagecontainers').html());
		console.log(selected.data('styleHTML'));
		
		//remove the dynamic buttons created for each decision
		$(".decisionbutton").remove();
	}
}

//We don't want users entering HTML within their text.
//For example, <hello!> would create a html tag rather than display that as a string
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};