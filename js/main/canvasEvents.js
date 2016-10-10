goog.provide('canvasEvents')
goog.require('initCanvas')
goog.require('ui')
goog.require('states')
goog.require('pageTemplates')

console.log("Enter canvasEvents.js")

source_node = null;

//dragging orphan nodes into parents
cy.on('tapend', ':orphan', function(event)
{
	var node = event.cyTarget;
	var mouse = event.cyRenderedPosition;

	cy.$(':parent').each(function(i, ele)
	{
		if (ele !== node)
		{
			//check if in the bounding box
			var pos = ele.renderedBoundingBox();
			console.log(pos);
			if (mouse.x > pos.x1 && mouse.x < pos.x2)
			{
				if (mouse.y > pos.y1 && mouse.y < pos.y2)
				{
					console.log("Move ", node.id(), " into ", ele.id());
					node.move({
						parent: ele.id()
					});
				}
			}
		}
	});
});

cy.on('taphold', ':parent', function(event)
{
	//prevent dragging/repositioning parent node until it's done expanding
	if(parent.children().animated())
		return;
});

//colapse/expand compound nodes
cy.on('tap', ':parent', function(event)
{
	cy.$(':selected').unselect();
	if (this.hasClass('collapsed'))
	{
		expand(this);
		this.descendants().outgoers('edge').removeClass('hidden');
	}
	else if (this.hasClass('expanded'))
	{
		collapse(this);
		//also hide all the edges that connect nodes, edges connecting a child to a compound child will remain otherwise
		this.descendants().outgoers('edge').addClass('hidden');
	}
})

function expand(parent)
{
	var parent_position = parent.position();

	if (parent.hasClass('collapsed'))
	{
		parent.children().each( function(i, ele)
		{
			ele.stop(false, true);
			var dx = this.data('displacement').x;
			var dy = this.data('displacement').y;
			console.log(dx);
			console.log(dy);
			ele.animate({
					position: 
				  	{ 
				  		x: parent_position.x + dx, 
				  		y: parent_position.y + dy
				  	},
				  	style:
				  	{
				  		opacity: 1,
				  	},
				}, 
				{
					duration: 500
				});
			ele.removeClass('hidden');

		});
		parent.removeClass('collapsed');
		parent.addClass('expanded');
	}
	// //recursively expand children
	// parent.children(':parent').each(function(i, ele){
	// 	expand(ele);
	// })

}

function collapse(parent)
{

	//if(parent.children().animated())
		//return;
		
	//recursively collapse children
	// parent.children(':parent').each(function(i, ele){
	// 	collapse(ele);
	// })

	var parent_position = parent.position();

	if (parent.hasClass('expanded'))
	{
		parent.children().each( function(i, ele)
		{
			ele.stop(false, true);
			var rel = ele.relativePosition();
			ele.data('displacement', rel);
			ele.animate({
					position: 
				  	{ 
				  		x: parent_position.x, 
				  		y: parent_position.y
				  	},
				  	style:
				  	{
				  		opacity: 0,
				  	},
					complete: function(){
						ele.addClass('hidden');

					}
				}, 
				{
					duration: 500
				});
		})
		parent.addClass('collapsed');
		parent.removeClass('expanded');
	}

}

cy.on('tap', ':selected', function(event)
{
	console.log("Tapped on: ", cy.$(':selected').data('name'));
	if (current_state === states.CONNECTING)
	{
		createConnection(event.cyTarget);
	}
});

cy.on('tap', function(event)
{
	var evtTarget = event.cyTarget;
	
	if (evtTarget === cy)
		cy.$(':selected').unselect(); //touch screen doesn't seem to do this by default
	
	if (current_state === states.CONNECTING)
	{
		// method to "deselect" a source node for connections
		if (evtTarget === cy)
		{
			if (source_node !== null)
			{
				//remove source node
				source_node.removeClass("source_node"); //remove the style associated with source nodes
				source_node = null; //remove stored source node
			}
		}
	}
	
	if (current_state === states.NEWPAGE)
	{
		console.log("Add a node");
		if (evtTarget === cy) //tap on background
		{					
			console.log("Really Add a node" + cy.add(
			{
				data:
				{ 
					name: cy.nodes().difference(':parent').size() + 1, 
					pagestyle: selected_page_template.pagestyle,
					outputcontainer: selected_page_template.outputcontainer,
					imgcontainers: selected_page_template.imgcontainers,
					vidcontainers: selected_page_template.vidcontainers,
					textcontainers: selected_page_template.textcontainers,
					decisioncontainers: [],
					events: [],
					eventspane: '<div class= "eventscontainer">'
						+		'<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
						+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
						+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Trigger</span>'
						+		'</div>',
				},
				classes: "page",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			}).data());
		}
		if (cy.elements('.page').size() === 1)
			cy.$('.page').first().addClass('start');	
	}
	
	else if (current_state === states.NEWCONTROL)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: cy.nodes().difference(':parent').size() + 1, 
					priorityList: [],	//list to store order in which edges are assessed during gameplay
					defaultFailEdge: "none"
				},
				classes: "control",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	else if (current_state === states.NEWJUMP)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: cy.nodes().difference(':parent').size() + 1, 
					trigger: "none",
				},
				classes: "jump",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	else if (current_state === states.NEWFIGHT)
	{
		if (evtTarget === cy) //tap on background
		{		
			createFight(event);
		}		
	}
	else if (current_state === states.NEWSTORE)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: cy.nodes().difference(':parent').size() + 1, 
					title: "Store",
				},
				classes: "jump",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
})

cy.on('select', function(event)
{
	//some dynamic colouring of relevant edges/nodes to the selected node
	if (event.cyTarget.isNode())
	{
		event.cyTarget.outgoers().addClass('parent-selected'); //distinguish edges coming from this node
		//event.cyTarget.successors().leaves().addClass('leaf'); //distinguish the end points reachable from this node	
	}
	
	console.log("Select event fired ", event.cyTarget.data('id'));
	//disable the additive selection behaviour when holding ctrl, alt, shift when we are in connection mode
	if (current_state === states.CONNECTING)
	{
		if (event.cyTarget.isEdge())
		{
			defaultState();		//leave connection state
			showOverlayLinks(event.cyTarget);
		}
		
		var oldselect = cy.$(':selected').diff(event.cyTarget);
		oldselect.left.unselect();
		
		//if adding a new connection
		createConnection(event.cyTarget);
	}
	showOverlayLinks(event.cyTarget);
	
	$(".selectionbutton").show();
})

cy.on('unselect', function(event)
{
	if (event.cyTarget.isNode())
	{
		event.cyTarget.outgoers().removeClass('parent-selected'); //distinguish edges coming from this node
		//event.cyTarget.successors().leaves().removeClass('leaf'); //distinguish the end points reachable from this node	
	}

	console.log("Unselect event fired ", event.cyTarget.data('id'));

	if (cy.$(':selected').size() === 0) //sometimes we had more than one selected
	{
		$(".editbutton").hide();
		$(".selectionbutton").hide(); //delete and edit buttons
	}
	else
	{
		showOverlayLinks(cy.$(':selected')[0])
	}
})

var fight = 0;
var fight_collection;
function createFight(event)
{
	var xy = event.cyRenderedPosition;
	console.log(event.cyRenderedPosition);

	var empty_graph = false;
	if (cy.elements('.page').size() === 0)
		empty_graph = true;
	
	fight++;
	fight_collection = cy.add([
		{
			data: { id: 'fightparent' + fight, name: "Fight"},
			classes: "expanded",
			group: "nodes",
			style:{
				'z-index': fight,
			}
		},
		{	//start node
			data:
			{
				displacement: {x: 0, y: 0},
				parent: 'fightparent' + fight,
				name: cy.nodes().difference(':parent').size() + 1, 
				pagestyle: selected_page_template.pagestyle,
				outputcontainer: selected_page_template.outputcontainer,
				imgcontainers: selected_page_template.imgcontainers,
				vidcontainers: selected_page_template.vidcontainers,
				textcontainers: selected_page_template.textcontainers,
				decisioncontainers: [],
				events: [],
				eventspane: '<div class= "eventscontainer">'
					+		'<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
					+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
					+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Trigger</span>'
					+		'</div>',
			},
			classes: "page",
			group: "nodes",
			renderedPosition: event.cyRenderedPosition,
		},
		{
			data:
			{ 
				displacement: {x: -40, y: 100},
				parent: 'fightparent' + fight,
				name: cy.nodes().difference(':parent').size() + 2, 
				pagestyle: selected_page_template.pagestyle,
				outputcontainer: selected_page_template.outputcontainer,
				imgcontainers: selected_page_template.imgcontainers,
				vidcontainers: selected_page_template.vidcontainers,
				textcontainers: selected_page_template.textcontainers,
				decisioncontainers: [],
				events: [],
				eventspane: '<div class= "eventscontainer">'
					+		'<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
					+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
					+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Trigger</span>'
					+		'</div>',
			},
			classes: "page",
			group: "nodes",
			renderedPosition: event.cyRenderedPosition,
		},
		{
			data:
			{ 
				displacement: {x: 40, y: 100},
				parent: 'fightparent' + fight,
				name: cy.nodes().difference(':parent').size() + 3, 
				pagestyle: selected_page_template.pagestyle,
				outputcontainer: selected_page_template.outputcontainer,
				imgcontainers: selected_page_template.imgcontainers,
				vidcontainers: selected_page_template.vidcontainers,
				textcontainers: selected_page_template.textcontainers,
				decisioncontainers: [],
				events: [],
				eventspane: '<div class= "eventscontainer">'
					+		'<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
					+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
					+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Trigger</span>'
					+		'</div>',
			},
			classes: "page",
			group: "nodes",
			renderedPosition: event.cyRenderedPosition,
		}
	]);
	if (empty_graph)
		fight_collection.eq(1).addClass('start');	

	//Create edges in pairs
	current_state = states.CONNECTING;
	source_node = null;
	cy.$(':selected').unselect();
	//connect F1 and F2
	createConnection(fight_collection.eq(1));
	createConnection(fight_collection.eq(2));
	createConnection(fight_collection.eq(1));
	createConnection(fight_collection.eq(3));

	$.each(fight_collection, function(index, val) {
		if (index > 0)
		{
			var dx = this.data('displacement').x;
			var dy = this.data('displacement').y;
			console.log(dx);
			console.log(dy);
			fight_collection[index].stop(false, true);
			fight_collection[index].animate({
				  position: { x: event.cyPosition.x + dx, y: event.cyPosition.y + dy},
				}, {
				  duration: 500
				});
		}
	});
	current_state = states.NEWFIGHT;
	cy.$('#fightparent' + fight).select();

}

