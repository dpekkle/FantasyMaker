goog.provide('pageOverlay')
goog.require('generalOverlay')
goog.require('pageContainerHelpers')
goog.require('contextMenu')
goog.require('dragDrop') //for page dimensions
goog.require('prompts')

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
		$('.handlecontainer').show();
		$('.handlemode').html("Handles: Shown")
	}
	else
	{
		$('.handlecontainer').hide();
		$('.handlemode').html("Handles: Hidden")
	}
}

/*** ADD CONTAINERS ***/

function addDecisionContainer(selected, i, text, name) //automatic process, not a user action
{
	/*	called when page overlay is opened if there exists an edge in cytoscape that is not yet in the 'decisioncontainers' data array
		afterwards the entire array is loaded into the page overlay's div
	*/
	var position = genPageCenterHTML(300, 220, selected.data('decisioncontainers').length);

	var html_string  =  "<div class = 'decision-container drag-element' edgename = " + name + " style='position:absolute; z-index: " + bringContainerToFront('decision') + "; " + position + "'>"
	html_string		+= 		"<div class = 'editdec decisionbutton drag-element resize-element' contenteditable=true>" + escapeHtml("Go to: " + text) + "</div>"
	html_string 	+= 	"</div>"

	var container_array = selected.data('decisioncontainers');
	var newcontainer = {
		'name' : name,
		'html' : html_string
	};
	container_array.push(newcontainer);
	selected.data('decisioncontainers', container_array);

	//actually gets added to the page when in openeditpageoverlay
}

function addOutputContainer()
{
	if(!$("#pagecontainers div.player:last").length) //only want 1 output container per page
	{

		//create output container and append it to the page
		var position = genPageCenterHTML(300, 260);
		var html_string  =  "<div class='output-container player drag-element' style='position:absolute; " + position + "'>"
		html_string		+=		"<div class='editdiv resize-element' contenteditable=false ></div>"
		html_string 	+= 	"</div>"

		var new_container = htmlToElements(html_string);

		$("#pagecontainers").append(new_container);
		$("#pagecontainers div.output-container:last").prepend(genHandleHTML("output", 0));

		bringContainerToFront($("#pagecontainers div.output-container:last"));
		if (!show_handles)
			$('.handlecontainer').hide();
		bindHandleSelection();
	}
	if(!$("#pagecontainers div.maker:last").length) //only want 1 output container per page
	{
		//create output container and append it to the page
		var position = genPageCenterHTML(300, 180);
		var html_string  =  "<div class='output-container maker drag-element' style='position:absolute; " + position + "'>"
		html_string		+=		"<div class='editdiv resize-element' contenteditable=false ></div>"
		html_string 	+= 	"</div>"

		var new_container = htmlToElements(html_string);

		$("#pagecontainers").append(new_container);
		$("#pagecontainers div.output-container:last").prepend(genHandleHTML("debug", 1));

		bringContainerToFront($("#pagecontainers div.output-container:last"));
		if (!show_handles)
			$('.handlecontainer').hide();
		bindHandleSelection();
	}
}

function addTextContainer()
{
	//create the container and append it to the page
	var position = genPageCenterHTML(300, 220);
	var html_string  =  "<div class='text-container drag-element' style='position:absolute; " + position + "'>"
	html_string		+=		"<div class='editdiv resize-element' contenteditable=true ></div>"
	html_string 	+= 	"</div>"

	var size = $(".text-container").length;
	var new_container = htmlToElements(html_string);

	$("#pagecontainers").append(new_container);
	$("#pagecontainers div.text-container:last").prepend(genHandleHTML("text", size + 1));

	bringContainerToFront($("#pagecontainers div.text-container:last"));
	$("#pagecontainers div.text-container:last .editdiv").trigger('focus');
	if (!show_handles)
		$('.handlecontainer').hide();
	bindHandleSelection();
}

function addImageContainer()
{
	//ask user for URL
	var html_string;

	myModal.prompt("Add image", "Directly link a jpeg|jpg|gif|png", [{name: "Image URL", default: "http://i.imgur.com/ZeUPvbP.jpg", type: "text"}], function(results)
	{
		if (!myModal.confirm)
			return;
		var imgurl = results[0];
		var position = genPageCenterHTML(300, 220);
		//check if valid image
		if (imgurl != null )
		{
			html_string = "<div class='img-container drag-element' style='position:absolute; " + position + "'>";

			var valid = checkImageURL(imgurl, "img");
			if (valid)
				html_string += valid;
			else
				return;

			html_string += "</div>"

			//Create a new draggable div to hold the image containers
			var size = $(".img-container").length;
			var new_container = htmlToElements(html_string);

			$("#pagecontainers").append(new_container);
			$("#pagecontainers div.img-container:last").prepend(genHandleHTML("img", size + 1));

			bringContainerToFront($("#pagecontainers div.img-container:last"));
			if (!show_handles)
				$('.handlecontainer').hide();
			bindHandleSelection();
		}
	});
}

function addVideoContainer()
{
	//ask user for URL
	var html_string;

	myModal.prompt("Add Video", "Supports links to .webm, .mp4, .gifv and (soon) youtube", [{name: "Video URL", default: "https://www.youtube.com/watch?v=4vKmEmY8ZD8", type: "text"}], function(results)
	{
		if (!myModal.confirm)
			return;
		var vidurl = results[0];
		var position = genPageCenterHTML(300, 220);
		//check if valid image
		if (vidurl != null )
		{
			html_string = "<div class='vid-container drag-element' style='position:absolute; " + position + "'>"

			var valid = checkImageURL(vidurl, "vid");
			console.log("Valid: ", valid)
			if (valid)
				html_string += valid;
			else
				return;

			html_string += "</div>"

			$.ajax(
			{
				url: vidurl, //or your url
				success: function(data)
				{
					//Create a new draggable div to hold the image containers
					var size = $(".vid-container").length;
					var new_container = htmlToElements(html_string);

					$("#pagecontainers").append(new_container);
					$("#pagecontainers div.vid-container:last").prepend(genHandleHTML("vid", size + 1));

					bringContainerToFront($("#pagecontainers div.vid-container:last"));
					if (!show_handles)
						$('.handlecontainer').hide();
					bindHandleSelection();
				},
				error: function(data)
				{
					alert('URL: ' + vidurl + ' does not exist');
				},
			})
		}
	});
}

/*** ADD CONTAINER HELPERS ***/
function checkImageURL(imgurl, type)
{
	var html_string = "";
	var ytreg = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

	//image url?
	if (imgurl == "")
	{
		alert("Not a valid url")
		return false;
	}
	else if (imgurl.match(/\.(jpeg|jpg|gif|png)$/) != null && type == "img")
	{
		html_string		+=		"<img class='editdiv resize-element' src=" + imgurl + "></img>"
	}
	//webm video
	else if (imgurl.match(/\.(webm)$/) != null && type == "vid")
	{
		html_string		+=	"<video preload='auto' autoplay='autoplay' loop='loop' class='editdiv resize-element'>"
		html_string		+=	"<source src= \"" + imgurl + "\"type='video/webm'></source>"
		html_string 	+= 	"</video>"
	}
	//youtube
	else if (imgurl.match(ytreg) ? RegExp.$1 : false && type == "vid")
	{
		var yt_id = imgurl.match(ytreg) ? RegExp.$1 : false;
		var div_id = "youtube_video_" + yt_id;
		if ($(div_id).length !== 0)
		{
			//youtube video alreay exists
			return;
		}

		var position = genPageCenterHTML(300, 220);
		html_string = "<div class='vid-container drag-element' style='position:absolute; " + position + "'>"
		html_string += "<div class='editdiv resize-child'>"

		html_string += "<div id='" + div_id + "'></div></div></div>";

		var size = $(".vid-container").length;
		var new_container = htmlToElements(html_string);

		$("#pagecontainers").append(new_container);
		$("#pagecontainers div.vid-container:last").prepend(genHandleHTML("vid", size + 1));

		bringContainerToFront($("#pagecontainers div.vid-container:last"));
		if (!show_handles)
			$('.handlecontainer').hide();
		bindHandleSelection();

		console.log("videoID:", yt_id);

		new YT.Player(div_id, {
		  origin: 'https://www.youtube.com',
		  height: '220',
		  width: '300',
		  playerVars: { 'autoplay': 1, 'controls': 1 }, //not needed with playVideo call
		  videoId: yt_id,
		  events: {
		  	'onError': function(event){
		  		this.destroy();
		  	},
		  }
		});
		$(div_id).addClass('resize-element');
		return false; //break ajax call
	}
	//gifv video
	else if (imgurl.match(/\.(gifv|mp4)$/) != null && type == "vid")
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
		alert("Not a valid url");
		return false;
	}

	return html_string;
}

/*** MODIFY CONTAINERS ***/

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
		$('#' + containertype + id).parent().parent().remove();
	}
}
function bindHandleSelection()
{
	$('.handle').last().on('mousedown touch', function(event){
		$(this).siblings().trigger('focus');
		bringContainerToFront($(this).parent().parent());
		console.log("trigger handle")
	})
}
function bringContainerToFront(element)
{
	console.log("Bring to front: ", element);
	var max = 50;
	$('#pagecontainers').children('div').each(function()
	{
		var z = $(this).css('zIndex');
		if (z > max)
			max = z;
	});
	max++;

	if (element == 'decision')
		return max;
	else
	{
		console.log("Set zIndex to ", max);
		element.css("zIndex", max);
	}
}

/*** Open/close Page overlay ***/

function populatePageOverlay(selected)
{
	console.log("Populate page " + selected.data('name'));

	$('#pagename').html('Design Page: ' + selected.data('name'));
	//load any previously saved info
	$("#pagecontainers").append('<a style="float:right" class="pagemenu btn-floating waves-effect waves-light gray"><i class="material-icons">settings</i></a>');

	var page_style = selected.data('pagestyle');
	$("#pagecontainers").attr("style", page_style);

	var output_cont = selected.data('outputcontainer');
	$("#pagecontainers").append(output_cont);
	$("#pagecontainers .player").prepend(genHandleHTML("output", 0));

	var debug_cont = selected.data('debugcontainer');
	$("#pagecontainers").append(debug_cont);
	$("#pagecontainers .maker").prepend(genHandleHTML("debug", 1));

	//create text containers
	var text_cont = selected.data('textcontainers');
	for (var j = 0; j < text_cont.length; j++)
	{
		$("#pagecontainers").append(text_cont[j].html);
		$("#pagecontainers div.text-container:last").prepend(genHandleHTML("text", text_cont[j].name));
	}

	//create image containers
	var img_cont = selected.data('imgcontainers');
	for (var j = 0; j < img_cont.length; j++)
	{
		$("#pagecontainers").append(img_cont[j].html);
		$("#pagecontainers div.img-container:last").prepend(genHandleHTML("img", img_cont[j].name));
	}

	//create video containers
	var vid_cont = selected.data('vidcontainers');
	for (var j = 0; j < vid_cont.length; j++)
	{
		$("#pagecontainers").append(vid_cont[j].html);
		$("#pagecontainers div.vid-container:last").prepend(genHandleHTML("vid", vid_cont[j].name));
	}

	//create special buttons
	var special_cont = selected.data('specialbuttons');
	for (var j = 0; j < special_cont.length; j++)
	{
		$("#pagecontainers").append(special_cont[j].html);
		//jumpnode only needed and defined for jump buttons, others ignore second parameter of genHandleHTML
		$("#pagecontainers div.button-container:last").prepend(genHandleHTML(special_cont[j].type, special_cont[j].jumpnode));
	}


	//load event list

	$('#eventspane').append('<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
					+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
					+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Time</span>');


	var events_cont = selected.data('events');
	for (var i = 0; i < events_cont.length; i++)
	{
		//check type of event
		//audio event
		if (project_project.audio.getAsset(events_cont[i].id))
		{
			//make sure we didnt delete the audio without deleting related events!
			project_project.audio.getAsset(events_cont[i].id).addEvent();
		}

		$('.eventtrigger input').last().val(events_cont[i].trigger)
		$('.eventtype select').last().val(events_cont[i].action);
		$('.eventtype .setting').last().val(events_cont[i].setting);
		if (events_cont[i].action == "Volume")
		{
			$('.eventtype .setting').last().show();
		}
		$('.eventscontainer').last().find('select').material_select();
	}

	//create decision buttons for the first time
	outgoingEdges = selected.outgoers().edges();
	var dec_cont = selected.data('decisioncontainers');
	for (var i = 0; i < outgoingEdges.size(); i++)
	{
		var found = false;
		for (var j = 0; j < dec_cont.length; j++)
		{
			if (outgoingEdges[i].data('name') == dec_cont[j].name)
			{
				found = true;
				//only want one button per edge
			}
		}
		if (!found)
		{
			var target_name = cy.getElementById(outgoingEdges.eq(i).data('target')).data('name');
			addDecisionContainer(selected, i, target_name, outgoingEdges[i].data('name'));
		}
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
				$("#pagecontainers div.decision-container:last").prepend(genHandleHTML("decision", dec_cont[j].name));

				$("#pagecontainers div.decision-container:last").attr('edgename', dec_cont[j].name);
				found = true;
			}
		}
		if (!found)
		{
			dec_cont.splice(j, 1); //remove from stored decision in page
		}
	}
	if (!show_handles)
		$('.handle').hide();

	$('.handle').on('mousedown touch', function(event){
		$(this).siblings().trigger('focus');
		bringContainerToFront($(this).parent().parent());
		console.log("trigger handle")
	});
}

function savePage(selected)
{
	$('#pagecontainers .handlecontainer').remove();

	//clear saved info
	selected.data('textcontainers', []);
	selected.data('imgcontainers', []);
	selected.data('vidcontainers', []);
	selected.data('events', []);

	//update containers
	selected.data('pagestyle', $('#pagecontainers').attr("style"));

	if ($('#pagecontainers .player').length)
		selected.data('outputcontainer', $('.player')[0].outerHTML);
	else
		selected.data('outputcontainer', "");

	if ($('#pagecontainers .maker').length)
		selected.data('debugcontainer', $('.maker')[0].outerHTML);
	else
		selected.data('debugcontainer', "");

	var text_container_array = [];
	$('#pagecontainers').children("div[class^='text-container']").each(function (index) {
		var html = this.outerHTML;
		//selected.data('textcontainers')[index].html = html;
		console.log("Updating HTML for ", index);
		var newcontainer = {
			'name' : index+1,
			'html' : html
			};
		text_container_array.push(newcontainer);
	});
	selected.data('textcontainers', text_container_array);

	var img_container_array = [];
	$('#pagecontainers').children("div[class^='img-container']").each(function (index) {
		var html = this.outerHTML;
		console.log("Save HTML for img ", index);
		var newcontainer = {
			'name' : index+1,
			'html' : html
			};
		img_container_array.push(newcontainer);
	});
	//console.log(img_container_array);
	selected.data('imgcontainers', img_container_array);

	var vid_container_array = [];
	$('#pagecontainers').children("div[class^='vid-container']").each(function (index) {
		var html = this.outerHTML;
		//console.log("Save HTML for vid ", index);
		var newcontainer = {
			'name' : index+1,
			'html' : html,
			};
		vid_container_array.push(newcontainer);
	});
	//console.log(vid_container_array);
	selected.data('vidcontainers', vid_container_array);

	var jump_button_array = [];
	$('#pagecontainers').children("div[class^='button-container']").each(function (index) {
		var html = this.outerHTML;
		var type = $(this).children('.editdec').attr('handle');
		var jumpnode = $(this).children('.editdec').attr('jumpnode');

		//console.log("Save HTML for buttons ", index);
		if (type == "jump")
		{
			var newcontainer = {
				'jumpnode': jumpnode,
				'type' : type,
				'html' : html,
				};
		}
		else
		{
			var newcontainer = {
				'type' : type,
				'html' : html,
				};
		}
		jump_button_array.push(newcontainer);
	});
	//console.log(vid_container_array);
	selected.data('specialbuttons', jump_button_array);

	//decisions
	$('#pagecontainers').children("div[class^='decision-container']").each(function (index) {
		var html = this.outerHTML;
		selected.data('decisioncontainers')[index].html = html;
		//console.log("Save HTML for decision ", index);
	});

	var event_array = [];
	$('#eventspane').children(".eventscontainer").each(function(index)
	{
		var name = $(this).children('.eventname');
		var eventtype = $(this).attr("class").split(' ')[0];
		var action = name.nextAll('.eventtype:first');
		var trigger = action.nextAll('.eventtrigger:first');
		var eventid = $(this).attr('id');

		var newcontainer = {
			'eventtype': eventtype,
			'id': eventid,
			'name' : name.html(),
			'action' : action.find('div input').val(),
			'setting' : action.find('.setting').val(),
			'trigger' : trigger.find('input').val(),
			};

		action.material_select('destroy'); //convert html back to pre-materialise base


		event_array.push(newcontainer);
	});
	event_array.sort(function(a, b) {
		return parseFloat(a.trigger) - parseFloat(b.trigger);
	});

	selected.data('events', event_array);


	//events pane
	selected.data('eventspane', $('#eventspane').html());


	//clear page
	$('#pagecontainers').html('');
	$('#eventspane').html('');
	selected_event = null;
}

/*** Scale the display to match ***/
function resizePageContainerDiv()
{
	if (!$('#page-modal').hasClass('open'))
		return;
	console.log("Resizing page container div")
	var w = $('.screenwrapper').width();
	var h = $('.screenwrapper').height();
	var scale;
	var inner_w = $('#pagecontainers').width();
	var inner_h = $('#pagecontainers').height();

	scale = Math.min(w/inner_w, h/inner_h);

	$('#pagecontainers').css({'transform': 'scale(' + scale + ')'});
}
