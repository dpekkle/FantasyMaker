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
		$('#pagecontainers #pagetext').html(escapeHtml(selected.data('text')));	

		//create the decision buttons dynamically
		outgoingEdges = selected.outgoers().edges();
		for (var i = 0; i < outgoingEdges.size(); i++)
		{
			//one button per edge
			$("#pagecontainers").append("<button class = 'decisionbutton' id='decision" + i + "'>" + escapeHtml(outgoingEdges.eq(i).data('text')) + "</button>");
		}
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
		document.getElementById("controltext").value = element.data('text'); //jquery dodgey with textarea	
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
		document.getElementById("connectiontext").value = element.data('text'); //jquery dodgey with textarea			
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