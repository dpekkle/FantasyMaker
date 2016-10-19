goog.provide('canvasEvents')
goog.require('initCanvas')
goog.require('ui')
goog.require('states')
goog.require('pageTemplates')

console.log("Enter canvasEvents.js")

compound_group_num = 0;
source_node = null;
held_node = null;


//****** dropping into compound nodes *******

cy.on('tapstart', 'node', function(event)
{
	//sometimes tapend fires on a different element than the one we dragged due to z-axis issues.
	held_node = event.cyTarget;
});

//dragging nodes into parents
cy.on('tapend', function(event)
{
	if (held_node == null)
		return;

	console.log("Check for dropping into parents:" , cy.$(':parent').length)
	var group = cy.$(':parent:orphan.expanded')
	var mouse = event.cyRenderedPosition;

	testobj = {"added": false, "parent": "none"};

	//check if we placed it into a parent
	checkCompoundBounds(group, mouse, testobj);

	console.log("Finished: ", testobj)
	if (testobj.added)
	{
		if (testobj.parent !== held_node.parent().id())
		{
			console.log("Move ", held_node.id(), " into ", testobj.parent);
			//If we've selected a bunch of nodes we probably want to move them all into the group, not just the held node.
			if (cy.$(':selected').length > 1)
				held_node = held_node.union('node:selected:orphan');

			held_node.move({
			 	parent: testobj.parent,
			});
		}
	}
	held_node = null

});


//****** compound node functions *********

cy.on('taphold', ':parent', function(event)
{
	//prevent dragging/repositioning parent node until it's done expanding
	if(parent.children().animated())
		return;
});

//colapse/expand compound nodes
cy.on('tap', ':parent:selected', function(event)
{
	cy.$(':selected').unselect();
	if (this.hasClass('collapsed'))
	{
		expand(this);
		this.descendants().outgoers('edge').removeClass('hidden');
	}
	else if (this.hasClass('expanded'))
	{
		this.descendants().each( function(i, ele)
		{
			if (ele.parent().hasClass('expanded'))
			{
				var x = ele.position().x;
				var y = ele.position().y;
				var rel = {x: x, y: y};
				console.log("Save position for: ", ele.id(), " at: ", rel)
				ele.data('displacement', rel);		
			}
		});

		collapse(this);

		//also hide all the edges that connect nodes, edges connecting a child to a compound child will remain otherwise

		this.descendants().outgoers('edge').addClass('hidden');
	}
})

function checkCompoundBounds(compounds, mouse, testobj)
{
	compounds.forEach(function(ele)
	{
		var pos = ele.renderedBoundingBox();
		//check if in the bounding box
		if (mouse.x > pos.x1 && mouse.x < pos.x2)
		{
			if (mouse.y > pos.y1 && mouse.y < pos.y2)
			{
				if (held_node !== ele)
				{
					//held_node was dropped here
					testobj.added = true;
					testobj.parent = ele.id();
					//held_node was dropped into a compound node, but we need to check for nested compound nodes within
					checkCompoundBounds(ele.children(':parent.expanded').difference(ele), mouse, testobj);
				}
			}
		}
	})
}

function expand(parent)
{
	console.log("Expand:", parent.id());
	var parent_position = parent.position();

	if (parent.hasClass('collapsed'))
	{
		parent.descendants().each( function(i, ele)
		{
			ele.stop(false, true);
			var dx = this.data('displacement').x;
			var dy = this.data('displacement').y;
			console.log(ele.id(), "X: ", + dx, "Y: ", dy);
			ele.animate({
					position: 
				  	{ 
				  		x: dx, 
				  		y: dy
				  	},
				  	style:
				  	{
				  		opacity: 1,
				  	},
				  	complete: function()
					{
						if (ele.isParent())
						{
							ele.removeClass('collapsed');
							ele.addClass('expanded');
						}
				  	}
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
	console.log("Collapse:", parent.id());

	if (parent.animated())
		return;
	var parent_position = parent.position();

	if (parent.hasClass('expanded'))
	{
		parent.descendants().each( function(i, ele)
		{
			ele.stop(false, true);
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
					complete: function()
					{
						ele.addClass('hidden');
						if (ele.isParent())
						{
							ele.addClass('collapsed');
							ele.removeClass('expanded');
						}
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

//****** General canvas events ********

cy.on('tap', ':selected', function(event)
{
	console.log("Tapped on: ", cy.$(':selected').data('name'));
	if (current_state === states.CONNECTING)
	{
		createConnection(event.cyTarget);
	}
});

//add nodes/edges to page
cy.on('tap', function(event)
{
	var evtTarget = event.cyTarget;
	
	if (evtTarget === cy)
		cy.$(':selected').unselect(); //touch screen doesn't seem to do this by default
	else
	{
		return;
	}
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
					name: cy.nodes('.page, .control').size() + 1, 
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
					name: cy.nodes('.page, .control').size() + 1, 
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
					name: "Jump " + (cy.nodes('.jump').size() + 1),
					triggerType: null,
					button: null,
					conditions: [],
					origin: null,
				},
				classes: "jump",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	else if (current_state === states.NEWJUMPEND)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					trigger: "none",
				},
				classes: "jumpend",
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
					name: "Group", 
				},
				classes: "expanded",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			},
			{

			})
		}		
	}
	else if (current_state === states.NEWEMPTY)
	{
		if (evtTarget === cy) //tap on background
		{		
			empty_collection = cy.add([
				{
					data: { 
						id: "Emptyparent" + cy.nodes(':parent').size() + 1,
						name: "Group", 
					},
					classes: "expanded",
					group: "nodes",
				},
				{
					data:
					{
						displacement: {x: 0, y: 0},
						parent: "Emptyparent" + cy.nodes(':parent').size() + 1,
						name: cy.nodes('.page, .control').size() + 1, 
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
			])
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

function createFight(event)
{
	var xy = event.cyRenderedPosition;
	console.log(event.cyRenderedPosition);

	var empty_graph = false;
	if (cy.elements('.page').size() === 0)
		empty_graph = true;
	
	var fight_collection = cy.add([
		{
			data: { id: 'fightparent' + cy.nodes(':parent').size() + 1, name: "Fight"},
			classes: "expanded",
			group: "nodes",
			style:{
				'z-index': cy.nodes(':parent').size() + 1,
			}
		},
		{	//start node
			data:
			{
				displacement: {x: 0, y: 0},
				parent: 'fightparent' + cy.nodes(':parent').size() + 1,
				name: cy.nodes('.page, .control').size() + 1, 
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
				parent: 'fightparent' + cy.nodes(':parent').size() + 1,
				name: cy.nodes('.page, .control').size() + 2, 
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
				parent: 'fightparent' + cy.nodes(':parent').size() + 1,
				name: cy.nodes('.page, .control').size() + 3, 
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
	cy.$('#fightparent' + cy.nodes(':parent').size() + 1).select();
}

//***** BUG FIX LOOP *******

function fixDisappearingBug()
{
	if (cy.$('.start').size() !== 0)
		cy.$('.start').data('fakeattribute', 1);
}

var fixbug = setInterval(function()
{
	fixDisappearingBug();
}, 200);