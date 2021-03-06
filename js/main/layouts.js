/*
	Name: layouts
	Created By: Danielle
	Purpose: handles layouts for page overlay
*/

goog.provide('layouts')
goog.require('initCanvas')
goog.require('pageOverlay') //for updating page overlay

var cose_layout = {
	name: 'cose',
	// Called on `layoutready`
	ready               : function() {},
	// Called on `layoutstop`
	stop                : function() {},
	// Whether to animate while running the layout
	animate             : true,
	// The layout animates only after this many milliseconds
	// (prevents flashing on fast runs)
	animationThreshold  : 250,
	// Number of iterations between consecutive screen positions update
	// (0 -> only updated on the end)
	refresh             : 1,
	// Whether to fit the network view after when done
	fit                 : true,
	// Padding on fit
	padding             : 30,
	// Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	boundingBox         : undefined,
	// Extra spacing between components in non-compound graphs
	componentSpacing    : 100,
	// Node repulsion (non overlapping) multiplier
	nodeRepulsion       : function( node ){ return 400000; },
	// Node repulsion (overlapping) multiplier
	nodeOverlap         : 10,
	// Ideal edge (non nested) length
	idealEdgeLength     : function( edge ){ return 10; },
	// Divisor to compute edge forces
	edgeElasticity      : function( edge ){ return 100; },
	// Nesting factor (multiplier) to compute ideal edge length for nested edges
	nestingFactor       : 5,
	// Gravity force (constant)
	gravity             : 80,
	// Maximum number of iterations to perform
	numIter             : 1000,
	// Initial temperature (maximum node displacement)
	initialTemp         : 200,
	// Cooling factor (how the temperature is reduced between consecutive iterations
	coolingFactor       : 0.95,
	// Lower temperature threshold (below this point the layout will end)
	minTemp             : 1.0,
	// Whether to use threading to speed up the layout
	useMultitasking     : true
};

var grid_layout = {
	name: 'grid',

	fit: true, // whether to fit the viewport to the graph
	padding: 30, // padding used on fit
	boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
	avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
	condense: false, // uses all available space on false, uses minimal space on true
	rows: undefined, // force num of rows in the grid
	cols: undefined, // force num of columns in the grid
	position: function( node ){}, // returns { row, col } for element
	sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
	animate: true, // whether to transition the node positions
	animationDuration: 500, // duration of animation in ms if enabled
	animationEasing: undefined, // easing of animation if enabled
	ready: undefined, // callback on layoutready
	stop: undefined // callback on layoutstop
};

var cose_bilkent = {
	name: 'cose-bilkent',
	// Called on `layoutready`
	ready: function () {
	},
	// Called on `layoutstop`
	stop: function () {
	},
	// Whether to fit the network view after when done
	fit: true,
	// Padding on fit
	padding: 10,
	// Whether to enable incremental mode
	randomize: true,
	// Node repulsion (non overlapping) multiplier
	nodeRepulsion: 4500,
	// Ideal edge (non nested) length
	idealEdgeLength: 120,
	// Divisor to compute edge forces
	edgeElasticity: 0.45,
	// Nesting factor (multiplier) to compute ideal edge length for nested edges
	nestingFactor: 0.1,
	// Gravity force (constant)
	gravity: 0.25,
	// Maximum number of iterations to perform
	numIter: 2500,
	// For enabling tiling
	tile: true,
	// Type of layout animation. The option set is {'during', 'end', false}
	animate: 'end',
	// Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
	tilingPaddingVertical: 10,
	// Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
	tilingPaddingHorizontal: 10,
	// Gravity range (constant) for compounds
	gravityRangeCompound: 1.5,
	// Gravity force (constant) for compounds
	gravityCompound: 4.0,
	// Gravity range (constant)
	gravityRange: 3.8
};

var breadth_first_layout = {
	name: 'breadthfirst',

	fit: true, // whether to fit the viewport to the graph
	directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
	padding: 30, // padding on fit
	circle: false, // put depths in concentric circles if true, put depths top down if false
	spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
	boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
	roots: false, // the roots of the trees
	maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
	animate: true, // whether to transition the node positions
	animationDuration: 500, // duration of animation in ms if enabled
	animationEasing: undefined, // easing of animation if enabled
	ready: undefined, // callback on layoutready
	stop: undefined // callback on layoutstop
};

function style_end_nodes()
{
	cy.elements('.leaf').removeClass('leaf');
	cy.$('node').successors().leaves('.page').addClass('leaf'); //end points of graph
}

function cleanup_node_labels(element)
{
	var newstart = false;
	if (element.hasClass('start'))
		newstart = true
	//remove element from graph(client-side)
	cy.remove(element);

	var i = 0;
	for (i; i < cy.nodes('.page, .control').size(); i++)
	{
		var ele = cy.nodes('.page, .control')[i];
		name = parseInt(ele.data('name'));
		if (!isNaN(name))
		{
			ele.style('label', i+1);
			ele.data('name', i+1);
		}
		else
		{
			console.log("Not a number")
		}
	}
	if (newstart)
	{
		var node = cy.$('.page').first();
		node.addClass('start');
		node.removeClass('leaf');
	}
}

function cleanup_edge_labels(element)
{
	//get parent node
	var parent = element.source();

	if (parent.hasClass('page'))
	{
		//find decision container of edge we are deleting, if it even exists (maybe we didnt open since adding it)
		for (var i = 0; i < parent.data('decisioncontainers').length; i++)
		{
			if (parent.data('decisioncontainers')[i].name == element.data('name'))
			{
				//remove decision container of edge we are deleting
				parent.data('decisioncontainers').splice(i, 1);
				break;
			}
		}
	}

	// delete edge
	cy.remove(element);


	//cleanup the displayed name for each edge from parent of this edge
	var edge_list = parent.edgesTo('*');

	updatePageStyle(parent);//make sure decision containers in the page have been created

	for (var i = 0; i < edge_list.size(); i++)
	{
		//update edges in cytoscape

		var edge_label = String.fromCharCode('A'.charCodeAt() + i);
		edge_list[i].style('label', edge_label);
		edge_list[i].data('name', edge_label);
		if (parent.hasClass('page'))
		{
			//update decision containers in the parent
			parent.data('decisioncontainers')[i].name = edge_label;
		}
	}

}

var layout_restore = null;

function layout_save()
{
	if (layout_restore === null)
		layout_restore = cy.elements().clone();
}

function layout_driver(sel)
{
	if (sel == "none")
		return;

	var type = sel;
	var options = null;

	if (type == "Tree")
		options = breadth_first_layout;
	else if (type == "Grid")
		options = grid_layout;
	else if (type == "Spread")
		options = cose_layout;
	else if (type == "Smart Spread")
		options = cose_bilkent;
	else if (type == "Undo")
	{
		cy.remove(cy.elements());
		cy.add(layout_restore);
		layout_restore = null;
	}
	else if (type == "Clear")
	{
		layout_restore = null;
	}
	else if (type == "Lock")
	{
		if (!cy.elements()[0].locked())
			cy.elements().lock();
		else
			cy.elements().unlock();
	}

	if (options !== null)
		change_layout(options);
	else
		console.log("No layout selected");
}

function change_layout(options)
{
	//set a root for tree
	if (options.name == 'breadthfirst')
	{
		console.log("Set root");
		options.roots = cy.$('.start');
	}

	cy.layout( options );
};
