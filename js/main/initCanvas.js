goog.provide('initCanvas')

console.log("Enter initCanvas.js")


//HACK TO FIX CURRENT STATE UNDEFINED
//little state enum for the current state the UI is in
states = {
	DEFAULT: 0,
	CONNECTING: 1, //i.e. connecting two nodes with an edge
	NEWPAGE: 2, // adding a new page node
	NEWCONTROL: 3, // adding a new control node
};

current_state = states.DEFAULT;


var cy = cytoscape({
	container: document.getElementById('cy'), // container to render in

	//predefined layout, mostly used for static graphs
	layout: {
			},

	// appearance for elements in canvas, similar to CSS
	style: [
		{
			selector: 'node',
			style: {
				'label': 'data(name)',
				'text-opacity': 1,
				'text-valign': 'center',
				'text-halign': 'center',
				
				'border-width': 2,
				'border-color': 'black',
				//makes changes to these properties an animation
				'transition-property': 'border-width, border-color',
				'transition-duration': '0.8s', //fadeout, essentially
				}
		},
		{
			selector: 'edge',
			style: {
				'label': 'data(name)',
				'text-background-color' : 'white',
				'text-background-opacity' : 1,
				
				'text-border-opacity' : 1,
				'text-border-color' : '#90caf9',
				'text-border-width' : 2,
				'width': 4,
				'target-arrow-shape': 'triangle',
				'line-color': '#90caf9',
				'target-arrow-color': '#89b9e8',
				'curve-style': 'bezier',
				'line-style': 'solid',
			}
		},
		{
			selector: ':parent',
			style:{
				'label': 'data(name)',
				'shape': 'roundrectangle',
				'background-color': '#DDD',
				'backgroun-opacity': '1',
		        'padding-top': '10px',
		        'padding-left': '10px',
		        'padding-bottom': '10px',
		        'padding-right': '10px',
		        'text-halign': 'center',
		        'text-valign': 'top',
		        'text-events': 'yes',
		        //'events': 'no',
				'text-border-opacity' : 1,
		        'text-border-color': 'black',
		        'text-border-width': '2px',
		        'transition-property': 'text-valign',
		        'transition-duration': '0.8s'
			},
		},
		{
			selector: '.expanded',
			style:{
			}
		},
		{
			selector: '.collapsed',
			style:{
			}
		},
		{
			selector: '.hidden',
			style:{
				'opacity': '0',
				//'visibility': 'hidden'
			}
		},
		// node classes
		{
			selector: '.page',
			style:{
				'shape': 'roundrectangle',
				'background-color': '#aaaaaa',

			}		
		},		
		{
			selector: '.jump',
			style:{
				'shape': 'diamond',
				'background-color': '#FFBB89',

			}		
		},
		{
			selector: '.control',
			style:{
				'shape': 'ellipse',
				'background-color': '#7E9ED8',
			}
			
		},
		{
			selector: '.source_node',
			style:{
				'border-width': 7,
				'border-color': '#90caf9', //same as the edges!
				'transition-duration': '0.1s',
			}
		},
		{
			selector: '.disconnected',
			style:{
				'border-width': 7,
				'border-color': 'red',
				'transition-property': 'border-width, border-color',
				'transition-duration': '0.1s',
			}
		},
		{
			selector: '.start',
			style:{
				'label': 'Start',
				'width': 40,
				'height': 40,
				'background-color': '#9deaa6',
				'padding-left' : '2px',
				'padding-right' : '2px',
			}
		},
		{
			selector: '.leaf',
			style:{
				'shape': 'hexagon',
				'width': 35,
				'height': 35,
				'background-color': '#eacd9d',
			}
		},
		
		// edge classes
		{
			selector: '.pageedge',
			style: {
			}			
		},
		{
			selector: '.success-edge',
			style: {
				'line-color': '#a1d490',
				'target-arrow-color': '#a1d490',
				'text-border-color' : '#a1d490',

			}			
		},
		{
			selector: '.fail-edge',
			style: {
				'line-color': '#c390d4',
				'target-arrow-color': '#c390d4',
				'text-border-color' : '#c390d4',

				}
			
		},	
		{
			selector: '.parent-selected',
			style: {
				'line-style': 'dashed',
			}
		},	
		
		//style for selected elements		
		{
			selector: ':selected', 
			style: {
				'text-border-color' : 'black',
				'border-width':5,
				'line-color': 'black',
				'target-arrow-color': 'black',
				'transition-duration': '0.1s',
			}
		},

	],
	boxSelectionEnabled: true,
	selectionType: 'single', //allows only one element to be selected at a time
	minZoom: 0.2,
	maxZoom: 5, 
});

cy.panzoom();

resizeCanvas();

console.log("Canvas done")