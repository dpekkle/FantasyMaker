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
	$("#page-modal").css("top","0");
	//element is null when we are simply opening a selected node in cy.
	//if we pass an element we are creating the HTML markup of the page, 
	//e.g. imagine if we add a bunch of edges to a node but dont open it afterwards! we still need to create the html links before we could play the game
	var selected = element;
	if (element === null)
		var selected = cy.$(':selected')[0];

	if (element === null)
		overlayToolbar(selected);

	//update contents of page view
	if (selected.hasClass('page'))
	{
		//load any previously saved info
		//create text containers

		var output_cont = selected.data('outputcontainer');
		$("#pagecontainers").append(output_cont);
		$("#pagecontainers div.output-container:last").prepend(genHandleHTML("output", 0));
	

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
			selected.data('outputcontainer', "");

			//update containers
			$('#pagecontainers').children("div[class^='text-container']").each(function (index) {
				var html = this.outerHTML;
				//selected.data('textcontainers')[index].html = html;

				console.log("Updating HTML for ", index);

				var container_array = selected.data('textcontainers');
				var newcontainer = {
					'name' : index+1,
					'html' : html
					};
				container_array.push(newcontainer);
				selected.data('textcontainers', container_array);

			});

			$('#pagecontainers').children("div[class^='decision-container']").each(function (index) {
				var html = this.outerHTML;
				selected.data('decisioncontainers')[index].html = html;
				console.log("Save HTML for decision ", index);
			});

			$('#pagecontainers').children("div[class^='img-container']").each(function (index) {
				var html = this.outerHTML;
				console.log("Save HTML for img ", index);

				var container_array = selected.data('imgcontainers');
				var newcontainer = {
					'name' : index+1,
					'html' : html
					};
				container_array.push(newcontainer);
				selected.data('imgcontainers', container_array);
			});

			$('#pagecontainers').children("div[class^='output-container']").each(function (index) {
				var html = this.outerHTML;
				selected.data('outputcontainer', html);
				console.log("Save HTML for output ");
			
			});


			//clear page
			$('#pagecontainers').html('');
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
