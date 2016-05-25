goog.provide('initCanvas')

console.log("Enter initCanvas.js")

var cy = cytoscape({
	container: document.getElementById('cy'), // container to render in
  
	//predefined layout, mostly used for static graphs
	layout: {
			},

	// appearance for elements in canvas, similar to CSS
	style: [
		// broad types of elements
		{
			selector: 'node',
			style: {
				'content': 'data(name)',
				'text-opacity': 1,
				'text-valign': 'center',
				'text-halign': 'center',
				'border-width': 1,
				'border-color': 'black',
				//makes changes to these properties an animation
				'transition-property': 'border-width, border-color',
				'transition-duration': '0.8s', //fadeout, essentially
				}
		},
		{
			selector: 'edge',
			style: {
				'content': 'data(name)',
				'width': 4,
				'target-arrow-shape': 'triangle',
				'line-color': '#9dbaea',
				'target-arrow-color': '#9dbaea',
				'curve-style': 'bezier',
				'line-style': 'solid',
			}
		},
		
		// node classes
		{
			selector: '.page',
			style:{
				'shape': 'roundrectangle',
				'background-color': 'gray',

			}		
		},
		{
			selector: '.control',
			style:{
				'shape': 'ellipse',
				'background-color': '#72dadb',
			}
			
		},
		{
			selector: '.source_node',
			style:{
				'border-width': 7,
				'border-color': '#9dbaea', //same as the edges!
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
				'content': 'Start',
				'background-color': '#9deaa6',
			}
		},
		{
			selector: '.leaf',
			style:{
				'background-color': '#eacd9d',
				'transition-property': 'background-color',
				'transition-duration': '0.1s',
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
			}			
		},
		{
			selector: '.fail-edge',
			style: {
				'line-color': '#c390d4',
				'target-arrow-color': '#c390d4',
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
