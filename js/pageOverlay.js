goog.provide('pageOverlay')
goog.require('generalOverlay')
goog.require('contextMenu')
goog.require('dragDrop') //for page dimensions

var show_handles = true;

function updatePageStyle(element) //used when we want to ensure unopened pages are saved for "export" (e.g saving/playing game)
{
	openEditPageOverlay(element);
	closeOverlay(element);
}

function toggleHandles()
{
	show_handles = !show_handles;
	$('.handlemode').toggleClass('activebutton');

	if (show_handles)
	{
		$('.handle').show();
		$('.handlemode').html("Handles: Shown")
	}
	else 
	{
		$('.handle').hide();
		$('.handlemode').html("Handles: Hidden")
	}
}

function genHandleHTML(containertype, id)
{
	var html_string;

	if (containertype == "img")
	{
		html_string = "<div id = 'img" + id + "'" + "class = 'handle'>Image Container " + id;
		html_string += ('<a style="float:right" class="imgmenu btn-floating btn waves-effect waves-light red">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');

	}

	else if (containertype == "text")
	{
		html_string = "<div id = 'text" + id + "'" + "class = 'handle'>Text Container " + id;
		html_string += ('<a style="float:right" class="textmenu btn-floating btn waves-effect waves-light red">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
		html_string += '</div>';

	}
	else if (containertype == "decision")
	{
		html_string = "<div id = 'decision" + id + "'" + "class = 'handle'>Link " + id;
		html_string += ('<a style="float:right" class="decmenu btn-floating btn waves-effect waves-light red">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
		html_string += '</div>';
		return html_string;
	}
	else if (containertype == "output")
	{
		html_string = "<div id = 'output" + id + "'" + "class = 'handle'>Control Output";
		html_string += ('<a style="float:right" class="controlmenu btn-floating btn waves-effect waves-light red">'
					+ 	 	'<i class="material-icons">settings</i>'
					+   '</a>');
		html_string += '</div>';
		return html_string;
	}

	else
	{
		console.log("Unknown container type when generating handle for HTML");
		return null;
	}

	return html_string;
}

function genPageCenterHTMLString(elew, eleh, iter)
{

	var x = ($('#pagecontainers').width()-elew)/2;
	var y = ($('#pagecontainers').height()-eleh)/2;

	if (iter >= 0)
		y += 30*iter;
	if (y > $('#pagecontainers').height())
		y = $('#pagecontainers').height();
	
	return "transform: translate(" + x + "px, " + y + "px);' data-x='" + x + "' data-y='" + y;
}

// page overlay functions
function removeContainer(containertype, id)
{

	//if an edge remove it from cytoscape based on it's ID
	if (containertype == "decision")
	{
		var selected = cy.$(':selected')[0];

		closeOverlay(selected);

		console.log("Removing link ", id, " from cytoscape");

		outgoingEdges = selected.outgoers().edges();

		var i = 0; 			
		var found = false;

		while (i < outgoingEdges.size() && !found)
		{
			console.log("Increment to ", i)
			if (outgoingEdges[i].data('name') == id)
			{
				console.log("Removing link ", id, " from cytoscape");
				found = true;
				cleanup_edge_labels(outgoingEdges[i]);
			}
			i++;
		}
		openEditPageOverlay(selected);
	}
	else
	{
		//remove from HTML
		$('#' + containertype + id).parent().remove();
	}
}

function addDecisionContainer(selected, i, text, name) //automatic process, not a user action
{	
	var position = genPageCenterHTMLString(300, 220, cy.$(':selected')[0].data('decisioncontainers').length);
	var html_string  =  "<div class = 'decision-container drag-element' style='position:absolute; " + position + "'>"
	html_string		+= 		"<div class = 'editdec decisionbutton drag-element resize-element' contenteditable=true>" + escapeHtml(text) + "</div>"
	html_string 	+= 	"</div>"
		
	var container_array = selected.data('decisioncontainers');
	var newcontainer = {
		'name' : name,
		'html' : html_string
	};
	container_array.push(newcontainer);
	selected.data('decisioncontainers', container_array);
}

function addOutputContainer()
{	
	if(!$("#pagecontainers div.output-container:last").length) //only want 1 output container per page
	{

		//create the container and append it to the page
		var position = genPageCenterHTMLString(300, 220);
		var html_string  =  "<div class='output-container drag-element' style='position:absolute; " + position + "'>"
		html_string		+=		"<div class='editdiv resize-element' contenteditable=false ></div>"
		html_string 	+= 	"</div>"
		
		var new_container = htmlToElements(html_string);

		$("#pagecontainers").append(new_container);
		$("#pagecontainers div.output-container:last").prepend(genHandleHTML("output", 0));	
		if (!show_handles)
			$('.handle').hide();
	}
	else
	{
		alert("You may only have one control output container per page")
	}
}


function addTextContainer()
{	
	//create the container and append it to the page
	var position = genPageCenterHTMLString(300, 220);
	var html_string  =  "<div class='text-container drag-element' style='position:absolute; " + position + "'>"
	html_string		+=		"<div class='editdiv resize-element' contenteditable=true ></div>"
	html_string 	+= 	"</div>"
	
	var size = $(".text-container").length;
	var new_container = htmlToElements(html_string);

	$("#pagecontainers").append(new_container);
	$("#pagecontainers div.text-container:last").prepend(genHandleHTML("text", size + 1));
	if (!show_handles)
		$('.handle').hide();

	//$(".text-container" + size + " .editdiv").trigger('focus');
}
function checkImageURL(imgurl, html_string)
{
	//image url?
	if (imgurl.match(/\.(jpeg|jpg|gif|png)$/) != null)
	{
		html_string		+=		"<img class='editdiv resize-element' src=" + imgurl + "></img>"
	}
	//video url?
	else if (imgurl.match(/\.(webm)$/) != null)
	{
		html_string		+=	"<video preload='auto' autoplay='autoplay' loop='loop' class='editdiv resize-element'>"
		html_string		+=	"<source src= \"" + imgurl + "\"type='video/webm'></source>"
		html_string 	+= 	"</video>"
	}
	//gifv video
	else if (imgurl.match(/\.(gifv|mp4)$/) != null)
	{
		var i = imgurl.lastIndexOf('.gifv'); //relabeled mp4s apparently...
		if (i != -1) 
		{
			imgurl = imgurl.substr(0, i) + ".mp4";
			console.log("Regexed to: ", imgurl);	
		}
		html_string		+=	"<video preload='auto' autoplay='autoplay' loop='loop' class='editdiv resize-element'>"
		html_string		+=	"<source src= \"" + imgurl + "\"type='video/mp4'></source>"
		html_string 	+= 	"</video>"
	}
	else 
	{
		alert("Not a valid url (must be a jpeg|jpg|gif|png|webm|gifv|mp4");
		return false;
	}

	return html_string;

}

function addImageContainer()
{
	//ask user for URL
	var html_string;
	var imgurl = prompt("Enter image url", "http://");
	var position = genPageCenterHTMLString(300, 220);
	
	//check if valid image
	if (imgurl != null )
	{
		html_string  	 =  "<div class='img-container drag-element' style='position:absolute; " + position + "'>"

		html_string = checkImageURL(imgurl, html_string)

		html_string 	+=  "</div>"	

		$.ajax(
		{
			url: imgurl, //or your url
			success: function(data)
			{
				//Create a new draggable div to hold the image containers	
				var size = $(".img-container").length;	
				var new_container = htmlToElements(html_string);

				$("#pagecontainers").append(new_container);
				$("#pagecontainers div.img-container:last").prepend(genHandleHTML("img", size + 1));	
				if (!show_handles)
					$('.handle').hide();
			},
			error: function(data)
			{
				alert('URL: ' + imgurl + ' does not exist');
			},
		})
	}
	
}

