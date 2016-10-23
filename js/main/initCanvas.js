goog.provide('initCanvas')
goog.require('host')
goog.require('states')
console.log("Enter initCanvas.js")

var cytoscape_headless;
var cytoscape_container;

if (window.location.href !== host_play())
{
	//in create module
	cytoscape_headless = false;
	cytoscape_container = document.getElementById('cy');
}
else
{
	//in play module
	cytoscape_headless = true;
	cytoscape_container = null;
}

var cy = cytoscape({
	container: cytoscape_container, // container to render in

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
		        'text-background-shape': 'roundrectangle',
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
				'background-opacity': '1',
		        'padding-top': '10px',
		        'padding-left': '10px',
		        'padding-bottom': '10px',
		        'padding-right': '10px',
		        'text-background-color': 'white',
		        'text-background-opacity': 1,
		        'text-halign': 'center',
		        'text-valign': 'top',
		        'text-events': 'yes',
		        //'events': 'no',
				'text-border-opacity' : 1,
		        'text-border-color': 'black',
		        'text-border-width': '2px',
		        'transition-property': 'text-valign',
		        'transition-duration': '0.8s',
				'compound-sizing-wrt-labels': 'exclude',
			},
		},
		{
			selector: '.named',
			style:{
				'label': 'data(name)',
				'text-background-color': 'white',
				'text-background-opacity': 1,
				'text-border-opacity' : 1,
			    'text-border-color': 'black',
			    'text-border-width': '2px',
			}
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
				'width': 35,
				'height': 35,
				'shape': 'polygon', //triangle
				'shape-polygon-points': [0, -1, -1, 0.5, 1, 0.5],
				'background-color': '#FFBB89',
		        'text-background-color': 'white',
		        'text-background-opacity': 1,
		        'text-background-shape': 'roundrectangle',
		        'text-halign': 'center',
		        'text-valign': 'top',
				'text-border-opacity' : 1,
		        'text-border-color': 'black',
		        'text-border-width': '2px',

			}		
		},
		{
			selector: '.jumpend',
			style:{
				'width': 35,
				'height': 35,
				'shape': 'polygon', // inverted triangle
				'shape-polygon-points': [0, 1, -1, -0.5, 1, -0.5],
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
			selector: '.jumpenderror',
			style:{
				'border-width': 7,
				'border-color': 'orange',
				'transition-property': 'border-width, border-color',
				'transition-duration': '0.1s',
			}
		},
		{
			selector: '.start',
			style:{
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
				'width': 35,
				'height': 35,
				'shape': 'octagon',
				'background-color': '#eacd9d',
			}
		},
		
		// edge classes
		{
			selector: '.jumpedge',
			style: {	

				'label': '',
				'text-background-opacity' : 0,
				'text-border-opacity' : 0,
				'text-border-width' : 0,
				'line-color': '#FFBB89',
				'target-arrow-color': '#FFBB89',
				'text-border-color' : '#FFBB89',
			}			
		},
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
	headless: cytoscape_headless,
	boxSelectionEnabled: true,
	selectionType: 'single', //allows only one element to be selected at a time
	minZoom: 0.2,
	maxZoom: 5, 
});

cy.panzoom();

resizeCanvas();

console.log("Canvas done")
