goog.provide('ui')
goog.require('initCanvas')
goog.require('states')
goog.require('httpRequests')

function updateEditPane(element)
{
	//display control info on selection
	if (element.hasClass('control'))
	{
		$("#editcontrol").show();	
		$("#controlname").text("control " + element.data('id'));
		document.getElementById("controltext").value = element.data('text'); //jquery dodgey with textarea	
	}
	//display page info on selection	
	else if (element.hasClass('page'))
	{
		$("#editpage").show();				
		$("#pagename").text("Page " + element.data('id'));
		document.getElementById("pagetext").value = element.data('text'); //jquery dodgey with textarea	
	}
	else if (element.hasClass('connection'))
	{
		$("#editconnection").show();
		$("#connectionname").text("Connection");
		document.getElementById("connectiontext").value = element.data('text'); //jquery dodgey with textarea			
	}
}
function hideEditPanes()
{
	//hide all possible panes
	$("#editpage").hide();
	$("#editcontrol").hide();		
	$("#editconnection").hide();

	//hide buttons that are only visible when something is selected
	$(".connectionmode").hide();
	$(".deletebutton").hide();
}

$(".textarea").on('input', function(event) //fires an event when the ui textarea is updated
{
	var text = this.value;
	cy.$(':selected').data('text', text);	
})

function removeNode()
{
	node = cy.$(':selected')
	if (!node.empty())
	{
		if (confirm("Are you sure you want to delete this element and all it's links?")) //we can make this prettier than default confirm
		{
			
			//remove elements from DB
			//done in 2 requests due to something adding indexs as parents to json objects during concat and stringify
			//need to fix at some point
			http_delete(node.connectedEdges().jsons());//del edges
			http_delete(node.jsons());//del nodes
			
			//remove nodes from graph
			cy.remove(node);
			hideEditPanes();
			
		}
	}
}

function createConnection(element)
{
	if (current_state == states.CONNECTING && element.isNode()) //don't want to make connections to edges
	{
		if (source_node == null) //on first selection store source node for connection
		{
			source_node = element;
			source_node.addClass("source_node"); //lets style the source node a bit?
			console.log("Source node assigned as node", element.data('id'));
		}
		else 
		{
			console.log("Creating link from ", source_node.data('id'), " to ", element.data('id'))

			if (source_node.data('id') != element.data('id'))
			{
				cy.add(
				{
					data: {	
						source: source_node.data('id'), 
						target: element.data('id'), 
						text: '<Decision text to display)>',
					},
					classes: 'connection',
					group: "edges",
				})	
			
				source_node.removeClass("source_node"); //remove the style associated with source nodes
				source_node = null; //remove stored source node
			}
		}
	}	
}
//resize cytoscape canvas's div container (known as cy) based on container elements
function resizeCanvas()
{
	var x = $('#rowbg').width(); 	//row is the screen width
	var y = $(window).height();		//want total height of the page
	
	$('#cy').css('width', x*9/12);	//match the col-md-9 size, 9/12 of the row width
	$('#cy').css('height', y-70);	//this div is offset by 70 pixels from the top, so the height is total screen height -70
	console.log("We resized, width: " +	x + " height: " + y);	
}
$(window).resize(resizeCanvas)