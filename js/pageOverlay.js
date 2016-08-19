goog.provide('pageOverlay')
goog.require('generalOverlay')
goog.require('contextMenu')
goog.require('dragDrop') //for page dimensions

function updatePageStyle(element) //used when we want to ensure unopened pages are saved for "export" (e.g saving/playing game)
{
	openEditPageOverlay(element);
	closeOverlay(element);
}

function genHandleHTML(containertype, id)
{
	var html_string;

	if (containertype == "img")
	{
		html_string = "<div id = 'img" + id + "'" + "class = 'handle'>Image Container " + id;
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
		html_string = "<div id = 'decision" + id + "'" + "class = 'handle'>Link " + id + "</div>";
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
	alert("Are you sure you want to delete" + containertype + "container" + id + "?");
	//remove from HTML
	$('#' + containertype + id).parent().remove();
}

function addDecisionContainer(selected, i, text, name) //automatic process, not a user action
{	
	var position = genPageCenterHTMLString(300, 220, cy.$(':selected')[0].data('decisioncontainers').length);
	var html_string  =  "<div class = 'decision-container drag-element' style='position:absolute; " + position + "'>"
	html_string		+= 		"<div class = 'editdec decisionbutton drag-element resize-element' contenteditable=true>" + escapeHtml(text) + "</div>"
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
	//create the container and append it to the page
	var position = genPageCenterHTMLString(300, 220);
	var html_string  =  "<div class='text-container drag-element' style='position:absolute; " + position + "'>"
	html_string		+=		"<div class='editdiv resize-element' contenteditable=true ></div>"
	html_string 	+= 	"</div>"
	
	var size = $(".text-container").length;
	var new_container = htmlToElements(html_string);

	$("#pagecontainers").append(new_container);
	$("#pagecontainers div.text-container:last").prepend(genHandleHTML("text", size + 1));

	//$(".text-container" + size + " .editdiv").trigger('focus');
	
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
		//image url?
		if (imgurl.match(/\.(jpeg|jpg|gif|png)$/) != null)
		{
			html_string  	 =  "<div class='img-container drag-element' style='position:absolute; " + position + "'>"
			html_string		+=		"<img class='editdiv resize-element' src=" + imgurl + "></img>"
			html_string 	+= 	"</div>"	
		}
		//video url?
		else if (imgurl.match(/\.(webm)$/) != null)
		{
			html_string  	 =  "<div class='img-container drag-element' style='position:absolute; " + position + "'>"
			html_string		+=	"<video preload='auto' autoplay='autoplay' loop='loop' class='editdiv resize-element'>"
			html_string		+=	"<source src= \"" + imgurl + "\"type='video/webm'></source>"
			html_string 	+= 	"</video></div>"	
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
			html_string  	 =  "<div class='img-container drag-element' style='position:absolute; " + position + "'>"
			html_string		+=	"<video preload='auto' autoplay='autoplay' loop='loop' class='editdiv resize-element'>"
			html_string		+=	"<source src= \"" + imgurl + "\"type='video/mp4'></source>"
			html_string 	+= 	"</video></div>"
		}

		else 
		{
			alert("Not a valid url");
			return;
		}

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
		  },
		  error: function(data)
		  {
			alert('file does not exist');
		  },
		})
	}
	
}

