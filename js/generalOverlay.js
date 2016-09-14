goog.require('events')
goog.provide('generalOverlay')

$(document).ready(function(){
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal-trigger').leanModal({
		dismissible: true,
		//callback for when overlay is triggered from html
		ready: function() {
			var selected = cy.$(':selected')[0];
			if(selected != null) {
				if (selected.hasClass('page')) {
					openEditPageOverlay(selected);
					console.log("Opening page overlay");
				}
				else if (selected.isEdge()) {
					openEditConnectionOverlay(selected);
					console.log("Opening Edge Overlay")
				}
				else if (selected.hasClass('control')) {
					openEditControlOverlay(selected);
					console.log("Opening Control Overlay")
				}
			}
			//TODO - Handle Opening Attributes Overlay
		},
		complete: function () { closeOverlay(null);} //callback for when modal is dismissed
	});
});

function openEditPageOverlay(element){
	//Make Modal take up 100% of screen space
	//$("#page-modal").css("top","0");

	//element is null when we are simply opening a selected node in cy.
	//if we pass an element we are creating the HTML markup of the page, 
	//e.g. imagine if we add a bunch of edges to a node but dont open it afterwards! we still need to create the html links before we could play the game
	var selected = element;
	if (element === null)
	{
		var selected = cy.$(':selected')[0];
	}

	if (element === null)
		overlayToolbar(selected);

	//update contents of page view
	if (selected.hasClass('page'))
	{
		$('#pagename').html('Design Page: ' + selected.data('name'));

		//load any previously saved info
		$("#pagecontainers").append('<a style="float:right" class="pagemenu btn-floating btn waves-effect waves-light gray"><i class="material-icons">settings</i></a>');

		var page_style = selected.data('pagestyle');
		$("#pagecontainers").attr("style", page_style);

		var output_cont = selected.data('outputcontainer');
		$("#pagecontainers").append(output_cont);
		$("#pagecontainers div.output-container:last").prepend(genHandleHTML("output", 0));
	
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

		//load event list

		$('#eventspane').append('<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
						+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
						+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Time</span>');


		var events_cont = selected.data('events');
		for (var i = 0; i < events_cont.length; i++)
		{
			//check type of event
			//audio event
			if (audio.getAsset(parseInt(events_cont[i].id)))
			{
				//make sure we didnt delete the audio without deleting related events!
				audio.getAsset(parseInt(events_cont[i].id)).addEvent();
			}

			$('.eventtrigger input').last().val(events_cont[i].trigger)
			$('.eventtype select').last().val(events_cont[i].action);
			$('#eventspane select').last().material_select();

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
					$("#pagecontainers div.decision-container:last").prepend(genHandleHTML("decision", dec_cont[j].name));
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
		bindHandleSelection();
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
	populateControlOverlay(selected);
}

function openAudioOverlay(){
	console.log("Audio overlay opened")
	$('#audio-modal').openModal({
		dismissible: true,
		//callback for when overlay is triggered from html
		ready: function() {
			audio.selected_audio = null;
			$('#audiolist').html('');
			$('#audiolist').append(audio.getAssetAsModalList());
			$('#audiolist li').on('click', function(event) {
				event.preventDefault();
				$('#audiolist li').removeClass('highlighted');
				$(this).toggleClass('highlighted');
				audio.selected_audio = $(this).attr('id');
			});
		},
		complete: function(){
			// $('#audiolist').html('');
		}
	});
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
	}
	else if (element.isEdge()) //will probably need checks for each type of edge
	{
		$("#connectiontoolbar").show();
		$("#connectionname").text("Connection " + element.data('name'));
	}
}

function closeOverlay(element)
{	
	//save the contents of the page to the associated page
	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];
	if (selected != null) {

		if (selected.hasClass('page')) {

			$('#pagecontainers .handle').remove();

			//clear saved info
			selected.data('textcontainers', []);
			selected.data('imgcontainers', []);
			selected.data('events', []);

			//update containers
			selected.data('pagestyle', $('#pagecontainers').attr("style"));
			selected.data('outputcontainer', $('.output-container').outerHTML);

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

			$('#pagecontainers').children("div[class^='decision-container']").each(function (index) {
				var html = this.outerHTML;
				selected.data('decisioncontainers')[index].html = html;
				console.log("Save HTML for decision ", index);
			});

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
			selected.data('imgcontainers', img_container_array);



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

		if (selected.hasClass('control')) {
			saveControl(selected)
			$('#connectedEdgesList').children().remove();
		}

		if (selected.isEdge()) {
			saveEdge(selected, "EDGE_OVERLAY");
			//remove html of condition/outcome lists
			$('#conditionsList').children().remove();
			$('#outcomesList').children().remove();

		}
	}else{
		//Modal is independent of cytoscape (Attributes)
		//TODO - Handle Attributes Overlay Closure
	}
	
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
		//show page-edge edit button
		$('a[href="#connection-modal"]').show();
	}
	else if (element.hasClass('controledge'))
	{
		//show control edge button, slightly different to page-edge overlay
		$('a[href="#connection-modal"]').show(); //change this link if you want a new overlay
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
