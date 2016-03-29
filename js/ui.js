goog.provide('ui')
goog.require('initCanvas')
goog.require('states')

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
	
	console.log("For element ", cy.$(':selected').data('id'), "apply", this.value, " Now holds: ", cy.$(':selected').data('text'));
	
})

function removeNode()
{
	node = cy.$(':selected')
	if (!node.empty())
	{
		cy.remove(node);
		hideEditPanes();
	}
}

function createConnection(element)
{
	if (current_state == states.CONNECTING && element.isNode()) //don't want to make connections to edges
	{
		if (source_node == null) //on first selection store source node for connection
		{
			source_node = element;
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
			
				source_node = null; //remove stored source node
			}
		}
	}	
}