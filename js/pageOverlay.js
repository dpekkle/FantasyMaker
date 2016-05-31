goog.provide('pageOverlay')

$(document).ready(function(){
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal-trigger').leanModal({
		dismissible: true,
		//callback for when overlay is triggered from html
		ready: function() {
			var selected = cy.$(':selected')[0];
			if (selected.hasClass('page')) {
				openEditPageOverlay(selected);
				console.log("Opening page overlay");
			}
			else if(selected.isEdge()) {
				openEditConnectionOverlay(selected);
				console.log("Opening Edge Overlay")
			}
			else if(selected.hasClass('control')) {
				openEditControlOverlay(selected);
				console.log("Opening Control Overlay")
			}
		},
		complete: function () { closeOverlay(null);} //callback for when modal is dismissed
	});
});

// page overlay functions
function addDecisionContainer(selected, i, text, name)
{	
	var html_string  =  "<div id = 'decision-container' class='drag-element' style='position:absolute;'>"
	html_string		+= 		"<div id = 'editdec' class = 'decisionbutton drag-element resize-element' contenteditable=true>" + escapeHtml(text) + "</div>"
	html_string 	+= 	"</div>"
	
	//new_container = htmlToElements(html_string);

	//$("#pagecontainers").append(new_container);	
	
	var container_array = selected.data('decisioncontainers');
	var newcontainer = {
		'name' : name,
		'html' : html_string
	};
	container_array.push(newcontainer);
	selected.data('decisioncontainers', container_array);
}

function addTextContainer()
{
	//Create a new draggable div to hold the text container
	
	var size = cy.$(':selected')[0].data('textcontainers').length;
	
	//create the container and append it to the pageX
	var html_string  =  "<div id = 'text-container' class='drag-element' style='position:absolute;'>"
	html_string		+=		"<div id = 'editdiv' class='resize-element' contenteditable=true ></div>"
	html_string 	+= 	"</div>"
	
	var new_container = htmlToElements(html_string);

	$("#pagecontainers").append(new_container);
	$("#pagecontainers div#text-container:last").prepend("<div class='handle'>Text Container " + (size + 1) + "</div>");

	$("#text-container" + size + " #editdiv").trigger('focus');
	
	var container_array = cy.$(':selected')[0].data('textcontainers');
	var newcontainer = {
		'name' : size+1,
		'html' : html_string
		};
	container_array.push(newcontainer);
	cy.$(':selected')[0].data('textcontainers', container_array);
}

//general overlay
function updatePageStyle(element)
{
	openEditPageOverlay(element);
	closeOverlay(element);
}

function openEditPageOverlay(element){
	//element is null when we are simply opening a selected node in cy.
	//if we pass an element we are creating the HTML markup of the page
	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];

	if (element === null)
		overlayToolbar(selected);

	//update contents of page view
	if (selected.hasClass('page'))
	{
		//$("#pagecontainers").show();

		//clear page
		$('#pagecontainers').html('');

		//load any previously saved info
		//create text containers
		var text_cont = selected.data('textcontainers');
		for (var j = 0; j < text_cont.length; j++)
		{
			$("#pagecontainers").append(text_cont[j].html);
			$("#pagecontainers div#text-container:last").prepend("<div class='handle'>Text Container " + text_cont[j].name + "</div>");
		}

		outgoingEdges = selected.outgoers().edges();
		var dec_cont = selected.data('decisioncontainers');

		//create decision buttons for the first time
		for (var i = 0; i < outgoingEdges.size(); i++)
		{
			var found = false;
			for (var j = 0; j < dec_cont.length; j++)
			{
				if (outgoingEdges[i].data('name') == dec_cont[j].name)
				{
					found = true;
					//one button per edge
				}
			}
			if (!found)
				addDecisionContainer(selected, i, outgoingEdges.eq(i).data('text'), outgoingEdges[i].data('name'));
		}

		//load saved decision containers
		for (var j = 0; j < dec_cont.length; j++)
		{
			var found = false;
			for (var i = 0; i < outgoingEdges.size(); i++)
			{
				if (dec_cont[j].name == outgoingEdges[i].data('name'))
				{
					$("#pagecontainers").append(dec_cont[j].html);
					//handles added each time, as we want to draw on updated names
					$("#pagecontainers div#decision-container:last").prepend("<div class='handle'>Link " + dec_cont[j].name + "</div>");
					found = true;
				}
			}
			if (!found)
			{
				dec_cont.splice(j, 1); //remove from stored decision in page
			}
		}
	}
}

function openEditConnectionOverlay(element){
	//element is null when we are simply opening a selected node in cy.
	//if we pass an element we are creating the HTML markup of the page
	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];

	populateEdgeOverlay(selected.json()); // pass edge as json obj to populate overlay

	//TODO (Russell) - Fix this method to properly populate connection edit overlay
}

function openEditControlOverlay(element){

	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];

	$("#controlcontainers #controltext").val(escapeHtml(selected.data('text')));
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
		$("#pagename").text("Page " + element.data('name'));					
		changeImage(element);
		changeAudio(element);
	}
	else if (element.isEdge()) //will probably need checks for each type of edge
	{
		$("#connectiontoolbar").show();
		$("#connectionname").text("Connection " + element.data('name'));
	}
}

function closeOverlay(element)
{
	//if (element === null)
	//	document.getElementById("Modal").close();
	
	//save the contents of the page to the associated page
	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];
	
	if (selected.hasClass('page'))
	{
		$('#pagecontainers .handle').remove();

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

function showOverlayLinks(element) //"edit page" button etc..
{
	$(".editbutton").hide();

	if (element.hasClass('page'))
	{
		//show page edit button
		$('a[href="#page-modal"]').show();
	}
	else if (element.hasClass('control'))
	{
		//show control eddit button
		$('a[href="#control-modal"]').show();

	}
	else if (element.hasClass('pageedge'))
	{
		//show edge edit button
		$('a[href="#connection-modal"]').show();
	}
}

//Misc string and html auxillary functions

function escapeHtml(str) 
{
	//We don't want users entering HTML within their text.
	//For example, <hello!> would create a html tag rather than display that as a string
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function htmlToElements(html) 
{
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}
