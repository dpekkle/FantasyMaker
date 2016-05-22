goog.provide('pageOverlay')


/*
function addEdgeToPageOverlay(parent)
{
	$("#pagecontainers").append("<button class = 'decisionbutton drag-element' id='decision" + i + "'>" + escapeHtml(outgoingEdges.eq(i).data('text')) + "</button><br>");

	
}*/

//used to create dynamic html elements - see http://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

//containers
function addDecisionContainer(i, text, id)
{	
	var html_string  =  "<div id = 'decision-container" + i + "' class='drag-element' style='position:absolute;'>"
	html_string 	+= 		"<div class = 'handle'>Link " + (i + 1) + "</div>"
	html_string		+= 		"<div id = 'editdec' class = 'decisionbutton drag-element' contenteditable=true style='border:1px solid #F00;'>" + escapeHtml(text) + "</div>"
	html_string 	+= 	"</div>"
	
	new_container = htmlToElements(html_string);

	//$("#pagecontainers").append(new_container);	
	
	var container_array = cy.$(':selected').data('decisioncontainers');
	var newcontainer = {
		'edgeid' : id,
		'html' : html_string
	};
	container_array.push(newcontainer);
	cy.$(':selected').data('decisioncontainers', container_array);
}

function addTextContainer()
{
	//Create a new draggable div to hold the text container
	
	var size = cy.$(':selected').data('textcontainers').length;
	
	//create the container and append it to the pageX
	var html_string  =  "<div id = 'text-container" + size + "' class='drag-element' style='position:absolute;'>"
	html_string 	+= 		"<div class = 'handle'>Text "+ (size + 1) + "</div>"
	html_string		+=		"<div id = 'editdiv' contenteditable=true style='border:1px solid #F00; width:200px; height:200px;position:relative; max-height: 200px; overflow-x:hidden; overflow-y:auto;'></div>"
	html_string 	+= 	"</div>"
	
	new_container = htmlToElements(html_string);

	$("#pagecontainers").append(new_container);		
	$("#text-container" + size + " #editdiv").trigger('focus');
	
	var container_array = cy.$(':selected').data('textcontainers');
	var newcontainer = {
		'html': $("#text-container"+size)[0].outerHTML
		};
	container_array.push(newcontainer);
	cy.$(':selected').data('textcontainers', container_array);
}

//general overlay

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
		
		//clear page
		$('#pagecontainers').html('');
		
		//load any previously saved info
		//create text containers
		var text_cont = cy.$(':selected')[0].data('textcontainers');
		for (var j = 0; j < text_cont.length; j++)
		{
			$("#pagecontainers").append(text_cont[j].html);		
		}

		outgoingEdges = selected.outgoers().edges();	
		var dec_cont = cy.$(':selected')[0].data('decisioncontainers');

		//create decision buttons for the first time
		for (var i = 0; i < outgoingEdges.size(); i++)
		{
			var found = false;
			for (var j = 0; j < dec_cont.length; j++)
			{
				if (outgoingEdges[i].data('target') == dec_cont[j].edgeid)
				{
					found = true;
					//one button per edge
				}				
			}
			if (!found)
				addDecisionContainer(i, outgoingEdges.eq(i).data('text'), outgoingEdges[i].data('target'));
		}	//prob swap this order? Decision container has to append so we dont want to append a second time below ---------########

		//load saved decision containers
		for (var j = 0; j < dec_cont.length; j++)
		{
			var found = false;
			for (var i = 0; i < outgoingEdges.size(); i++)
			{
				if (dec_cont[j].edgeid == outgoingEdges[i].data('target'))
				{
					$("#pagecontainers").append(dec_cont[j].html);
					found = true;
				}
			}
			if (!found)
			{
				dec_cont.splice(j, 1); //remove from stored decision in page
			}
		}
		
	}
	
	if (selected.isEdge())
	{
		//this is where we define all the connection stuff that shows up in the overlay

		$("#connectioncontainers").show();
		populateEdgeOverlay(selected.json()); // pass edge as json obj to populate overlay
		
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
		//update containers
		$('#pagecontainers').children("div[id^='text-container']").each(function(index)
		{
			var html = this.outerHTML;
			selected.data('textcontainers')[index].html = html;
			console.log("Updating HTML for ", index);

		});
		
		$('#pagecontainers').children("div[id^='decision-container']").each(function(index)
		{
			var html = this.outerHTML;
			selected.data('decisioncontainers')[index].html = html;
			console.log("save html for decision ", index);
			//outgoingEdges.eq(index).data('text', this.innerHTML);
			//console.log("Set: ", outgoingEdges.eq(index).data('text'));
		});

		
	}
	
	if(selected.isEdge()){
		saveEdge();
		//remove html of condition/outcome lists
		$('#conditionsList').children().remove(); 
		$('#outcomeList').children().remove(); 
		
	}
	
	//var total_html =  stripDraggable($("#pagecontainers").html());
	//selected.data('styleHTML', total_html);
}

//We don't want users entering HTML within their text.
//For example, <hello!> would create a html tag rather than display that as a string
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};