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
		
		//load any previously saved info
		//var styleHTML = selected.data('styleHTML');
		//$('#pagecontainers').html(styleHTML);

		//clear page
		$('#pagecontainers').html('');		
		var text_cont = cy.$(':selected')[0].data('textcontainers');
		for (var i = 0; i < text_cont.length; i++)
		{
			$("#pagecontainers").append(text_cont[i].html);
			$("#text-area"+i).val(escapeHtml(text_cont[i].contents));
			
			$("#text-area"+i).on('input', function(event) //fires an event when the container's textarea has a value entered
			{
				var text = this.value;
				console.log("Text: ", text);
				cy.$(':selected').data('textcontainers')[i].contents = text;	
			})
			
			console.log("Display:", escapeHtml(text_cont[i].contents));
		}
		
		//create the decision buttons dynamically
		outgoingEdges = selected.outgoers().edges();
		for (var i = 0; i < outgoingEdges.size(); i++)
		{
			//one button per edge
			$("#pagecontainers").append("<button class = 'decisionbutton drag-element' id='decision" + i + "'>" + escapeHtml(outgoingEdges.eq(i).data('text')) + "</button><br>");
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
		$('#pagecontainers').children("div[id^='text-container']").each(function(index)
		{
			var html = this.outerHTML;
			selected.data('textcontainers')[index].html = html;
			console.log("Updating HTML for ", index);
		});
	}
}

//We don't want users entering HTML within their text.
//For example, <hello!> would create a html tag rather than display that as a string
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};