goog.provide('layouts')
goog.require('initCanvas')
//goog.require('pageOverlay') //for containers

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

var concentric_layout = {
  name: 'concentric',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  startAngle: 3/2 * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: true, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 30, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  height: undefined, // height of layout area (overrides container height)
  width: undefined, // width of layout area (overrides container width)
  concentric: function(node){ // returns numeric value for each node, placing higher nodes in levels towards the centre
  return node.degree();
  },
  levelWidth: function(nodes){ // the variation of concentric values in each level
  return nodes.maxDegree() / 4;
  },
  animate: true, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
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
	//remove element from graph(client-side)
	cy.remove(element);
	
	//cleanup the displayed name for each label
	var i = 1;
	for (i; i < cy.nodes().size(); i++)
	{
		cy.nodes()[i].style('label', i+1);
		cy.nodes()[i].data('name', i+1);		
	}
	cy.$('node').first().addClass('start');
}

function cleanup_edge_labels(element)
{	
	//get parent node
	var parent = element.source();
	
	//find decision container of edge we are deleting
	for (var i = 0; i < parent.data('decisioncontainers').length; i++)
	{
		if (parent.data('decisioncontainers')[i].name == element.data('name'))
		{
			//remove decision container of edge we are deleting
			parent.data('decisioncontainers').splice(i, 1);
			break;
		}
	}
	
	// delete edge
	cy.remove(element);

	//cleanup the displayed name for each edge from parent of this edge
	var i = 0;
	var edge_list = parent.edgesTo('*');
	for (i; i < edge_list.size(); i++)
	{
		//update edges in cytoscape
		
		//update decision containers in the parent
		updatePageStyle(parent);//make sure decision containers in the page have been created and are up to date (normally done when you open the overlay)

		var edge_label = String.fromCharCode('A'.charCodeAt() + i);
		edge_list[i].style('label', edge_label);
		edge_list[i].data('name', edge_label);
		parent.data('decisioncontainers')[i].name = edge_label;
	}
	
}

function layout_driver(sel)
{
	if (sel.value == "none")
		return;
	
	var type = sel.value;	
	var options = null;
	
	if (type == "Tree")
		options = breadth_first_layout;
	else if (type == "Grid")
		options = grid_layout;
	else if (type == "Circle")
		options = concentric_layout;
	else if (type == "Spread")
		options = cose_layout;
	
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