goog.provide('ui')
goog.require('initCanvas')
goog.require('states')
goog.require('httpRequests')
goog.require('assetLoad')
goog.require('pageOverlay')
goog.require('layouts')

$(".textarea").on('input', function(event) //fires an event when the ui textarea is updated
{
	var text = this.value;
	cy.$(':selected').data('text', text);	
})

function removeElement()
{
	element = cy.$(':selected')
	if (!element.empty())
	{			
		//Add elements(edges) connected to node to http_modStack array for later deletion(on save).
		for(var i = 0; i<element.connectedEdges().jsons().length; i++){
			http_modStack.push(element.connectedEdges().jsons()[i]);//del edges (Danni note: removeElement will also delete edges, so this SHOULD return no edges in that case)
		}
		//add nodes to http_modStack array for later deletion(on save).
		for(var i = 0; i<element.jsons().length; i++){
			http_modStack.push(element.jsons()[i]);
		}			
		//remove nodes from graph(client-side)
		cy.remove(element);
		total_pages--;
		cleanup_titles();
		cy.$('node').first().addClass('start');
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
			if (source_node.data('id') != element.data('id'))
			{
				console.log("Creating link from ", source_node.data('id'), " to ", element.data('id'))

				var style = '';
				var makeedge = true;
				if (source_node.hasClass('control')) //control nodes only have two edges, a success and a fail fallback
				{
					var edge_list = source_node.edgesTo('*');
					console.log("Size from control: ", edge_list.size());
					if (edge_list.size() === 0) //add first success edge
					{
						style = 'success-edge';
					}
					else if (edge_list.size() === 1) //add second edge
					{
						if(edge_list.first().hasClass('success-edge'))
						{
							style = 'fail-edge';
						}
						else
						{
							style = 'success-edge'; //in case success edge was deleted and fail was not
						}
					}
					else
					{
						makeedge = false;
					}
				}
				
				if (makeedge)
				{
					var newEdge = cy.add(
					{
						data: {	
							source: source_node.data('id'), 
							target: element.data('id'), 
							text: '<Decision text to display)>',
						},
						classes: style,
						group: "edges",
					});	
					//edge selection is a bit buggy in chrome, so this should ensure it isn't.
					newEdge.on('tap', function(event){this.select();});		
				}
				source_node.removeClass("source_node"); //remove the style associated with source nodes
				source_node = null; //remove stored source node
				element.unselect();
			}
		}
	}	
}

//resize cytoscape canvas's div container (known as cy) based on container elements
function resizeCanvas()
{
	var x = $(window).width(); 	//row is the screen width
	var y = $(window).height();		//want total height of the page
	var buffer = $('#tabheadings').height();
	
	$('#cy').css('width', x*9/12 - 30);	//match the col-md-9 size, 9/12 of the row width, -30 for col padding
	$('#cy').css('height', y-buffer); //tabs at top are 42;
	$('#sidebar').css('height', y-buffer);

	console.log("We resized, width: " +	x + " height: " + y);	
	cy.resize();
}
$(window).resize(resizeCanvas)

//watch the tab changes in bootstrap, re-render canvas when we switch to it
{
	var observer = new MutationObserver(function(mutations) 
	{
		mutations.forEach(function(mutation) 
		{        
			if(mutation.oldValue == "tab-pane fade" && mutation.target.className == "tab-pane fade active in") 
			{
				cy.resize();
			}
		});    
	});

	var cytabNode = $('#cyTab')[0];
	var observerConfig = 
	{  
		attributes: true,
		childList: false,
		characterData: false,
		attributeOldValue: true, 
		'attributeFilter': ['class']
	};
	observer.observe(cytabNode, observerConfig);
}