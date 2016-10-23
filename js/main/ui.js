goog.provide('ui')
goog.require('initCanvas')
goog.require('states')
goog.require('httpRequests')
goog.require('generalOverlay')
goog.require('layouts')
goog.require('controlOverlay')
goog.require('pageOverlay')

function saveProject()
{
	//consider case where someone creates pages without opening the page style overlay, in which case no style is assigned
	//will probably be an empty page i.e. no html
	var eles = cy.elements('.page');
	for (var i = 0; i < eles.length; i++)
	{
		updatePageStyle(eles[i]);
	}

	project_saveProject()
}

function setStart(ele)
{
	cy.$('.start').removeClass('start');
	if (ele !== undefined)
	{
		ele.addClass('start');
		ele.removeClass('leaf');
	}
	else
	{
		cy.$(':selected')[0].addClass('start');
		cy.$(':selected')[0].removeClass('leaf');	
	}
}

function removeParent()
{
	cy.$(':selected')[0].move({
	 	parent: null,
	});
}

function removeElement()
{
	element = cy.$(':selected')
	parent = cy.$(':selected').parent();
	if (!element.empty())
	{
		if (element.isNode())
		{
			//handle connected edges to a control node
			if(element.connectedEdges().size() > 0){
				element.connectedEdges().forEach(function( edge ){
					if(edge.hasClass('controledge')){
						removeEdgeFromPriorityList(edge)
					}
				});
			}
			if (!(element.hasClass('jump') || element.hasClass('jumpend')))
				cleanup_node_labels(element);
			else
				cy.remove(element);
		}
		else if (element.isEdge())
		{
			//if multiple edges should loop through them all
			if(element.hasClass('controledge')){
				removeEdgeFromPriorityList(element)
			}
			cleanup_edge_labels(element);
			style_end_nodes();
		}

		//delete compound parent if there's nothing left in it (or it looks like a normal node after)
		if (!parent.empty())
		{
			if (parent.children().empty())
			{
				parent.remove();
			}
		}

	}
	$(".editbutton").hide();
	$(".selectionbutton").hide(); //delete button
}

function createConnection(element)
{
	if (current_state == states.CONNECTING && element.isNode()) //don't want to make connections to edges
	{
		if (source_node == null) //on first selection store source node for connection
		{
			if (!element.hasClass('jumpend'))
			{
				source_node = element;
				source_node.addClass("source_node"); //lets style the source node a bit?
				console.log("Source node assigned as node", source_node.data('id'));
			}
		}
		else
		{
			if (source_node.data('id') != element.data('id'))
			{
				console.log("Creating link from ", source_node.data('id'), " to ", element.data('id'))

				var style = '';
				var makeedge = true;
				if (element.hasClass('jump'))
				{
					//can't make an edge TO a jump start node
					makeedge = false;
				}
				else if (source_node.hasClass('jump'))
				{
					style += 'jumpedge';
					if (source_node.edgesTo('*').length != 0)
						makeedge = false;
				}
				else if (source_node.hasClass('control')) //control nodes only have two edges, a success and a fail fallback
				{

					var edge_list = source_node.edgesTo('*');

					style = 'fail-edge';
					edge_list.forEach(function(ele){
						if (ele.hasClass('fail-edge')){
							style = 'success-edge';
							return;
						}
					});
					style += ' controledge';
				}
				else if (source_node.hasClass('page'))
				{
					style += 'pageedge';
				}

				if (makeedge)
				{
					// First edge 'A', second 'B', third 'C' etc...
					var edge_label = String.fromCharCode('A'.charCodeAt() + source_node.edgesTo('*').size());
					var newEdge = cy.add(
					{
						data: {
							name: edge_label,
							source: source_node.data('id'),
							target: element.data('id'),
							text: '',
							conditions: [],
							outcomes: []
						},
						classes: style,
						group: "edges",
					});
					//edge selection is a bit buggy in chrome, so this should ensure it isn't.
					newEdge.on('tap', function(event){this.select();});

					//add new edge to control nodes priority list of edges
					if(source_node.hasClass('control')){
						//console.log(source_node.json())
						source_node.json().data.priorityList.push(newEdge.json().data.id)
						console.log("control nodes defaultFailEdge: " + source_node.json().data.defaultFailEdge)
						if(source_node.json().data.defaultFailEdge === "none"){
							console.log("setting initial default fail edge to " + newEdge.json().data.id)
							source_node.json({ data:{ defaultFailEdge: newEdge.json().data.id }})
							console.log("default fail edge is " + source_node.json().data.defaultFailEdge)
						}
					}

					console.log(cy.elements().jsons())
				}
				source_node.removeClass("source_node"); //remove the style associated with source nodes
				source_node = null; //remove stored source node

				style_end_nodes();
			}
		}
	}
}

//resize cytoscape canvas's div container (known as cy) based on container elements
function resizeCanvas()
{
	var x = $(window).width(); 	//row is the screen width
	var y = $(window).height();		//want total height of the page
	var buffer = $('#tabheadings').height() + $('.nav-wrapper').height();

	//$('#cy').css('width', x*9/12 - 17);	//match the col-md-9 size, 9/12 of the row width, -30 for col padding
	$('#cy').css('height', y-buffer); //tabs at top are 42;
	$('#sidebar').css('height', y-buffer);

	console.log("We resized, width: " +	x + " height: " + y);
	cy.resize();

	//also rescale pageoverlay stuff
	resizePageContainerDiv();
}

$(window).resize(resizeCanvas);

//watch the tab changes in bootstrap, re-render canvas when we switch to it
{
	var observer = new MutationObserver(function(mutations)
	{
		mutations.forEach(function(mutation)
		{
			if (mutation.oldvalue = "display: none;" && mutation.target.style.display == "block")
				cy.resize();
		});
	});

	var cytabNode = $('#cyTab')[0];
	var observerConfig =
	{
		attributes: true,
		childList: false,
		characterData: false,
		attributeOldValue: true,
		'attributeFilter': ['style']
	};
	observer.observe(cytabNode, observerConfig);
}



function createModule_playGame(){
	cy.$(':selected').unselect();
	$('#cyTab').hide(); 
	prepareForGame();
	$('#Play').show();
}

function createModule_showProject() {
	$('#Play').hide();
	wipeGame();
	$('#cyTab').show();
	
}