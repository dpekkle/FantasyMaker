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
		populatePageOverlay(selected);
		$('#pagecontainers').width(project_project.resolution.x);
		$('#pagecontainers').height(project_project.resolution.y);
		resizePageContainerDiv();
	}
}

function openEditConnectionOverlay(element){
	//element is null when we are simply opening a selected node in cy.
	//if we pass an element we are creating the HTML markup of the page
	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];

	populateEdgeOverlay(selected.json()); // pass edge as json obj to populate overlay
}

function openEditControlOverlay(element){

	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];

	$("#controlcontainers #controltext").val(escapeHtml(selected.data('text')));
	populateControlOverlay(selected);
}

function openAttributesOverlay()
{
	$('#attributes-modal').openModal(
		{
			dismissible: true,
			ready: function () {
				gameAttributes_loadAttributes();
			},
			complete: function () {
				gameAttributes_saveAttributes();
			}

	});

}

function openAudioOverlay()
{
	console.log("Audio overlay opened")
	$('#audio-modal').openModal(
	{
		dismissible: true,
		//callback for when overlay is triggered from html
		ready: function() {
			project_project.audio.selected_audio = null;
			$('#audiolist').html('');
			$('#audiolist').append(project_project.audio.getAssetAsModalList());
			$('#audiolist li').on('click', function(event)
			{
				event.preventDefault();
				$('#audiolist li').removeClass('highlighted');
				$(this).toggleClass('highlighted');
				project_project.audio.selected_audio = $(this).attr('id');
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
			savePage(selected);
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
		//daznote - set this to run only on newProject-modal closure
		$('#projName').val('') //empties newProject-modal input field
		if( !$('#projNameAcceptButton').hasClass('disabled') ){
			$('#projNameAcceptButton').addClass('disabled')
		}
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
		$('button[data-target="page-modal"]').show();
	}
	else if (element.hasClass('control'))
	{
		//show control eddit button
		$('button[data-target="control-modal"]').show();

	}
	else if (element.hasClass('pageedge'))
	{
		//show page-edge edit button
		$('button[data-target="connection-modal"]').show();
	}
	else if (element.hasClass('controledge'))
	{
		//show control edge button, slightly different to page-edge overlay
		$('button[data-target="connection-modal"]').show(); //change this link if you want a new overlay
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

/*** Scale the display to match ***/
function resizePageContainerDiv()
{
	$('#pagecontainers').width(project_project.resolution.x);
	$('#pagecontainers').height(project_project.resolution.y);

	var scale;

	if (!$('#page-modal').hasClass('open'))
		return;

	var w = $('.screenwrapper').width();
	var h = $('.screenwrapper').height();
	var inner_w = $('#pagecontainers').width();
	var inner_h = $('#pagecontainers').height();
	// don't make resolution larger than the set resolution
	// if (w > inner_w && h > inner_h)
	// {
	// 	$('#pagecontainers').css({'transform': ''});
	// 	return;
	// }
	scale = Math.min(w/inner_w, h/inner_h);

	$('#pagecontainers').css({'transform': 'scale(' + scale + ')'});
	$('#pagecontainers').css({'-ms-transform': 'scale(' + scale + ')'});
	$('#pagecontainers').css({'-webkit-transform': 'scale(' + scale + ')'});
}