goog.provide('initCanvas')

console.log("Enter initCanvas.js")

var cy = cytoscape({
	container: document.getElementById('cy'), // container to render in
  
	//predefined layout, mostly used for static graphs
	layout: {
				name: 'grid',
				rows: 1
			},

	// appearance for elements in canvas, similar to CSS
	style: [
		{
			selector: 'node',
			style: {
				'content': 'data(id)',
				'text-opacity': 1,
				'text-valign': 'center',
				'text-halign': 'center',
				'border-width': 5,
				'border-opacity': 0,
				'border-color': 'black',
				//makes changes to these properties an animation
				'transition-property': 'border-width, border-opacity, border-color',
				'transition-duration': '0.5s',
			}
		},

		{
			selector: 'edge',
			style: {
				'width': 4,
				'target-arrow-shape': 'triangle',
				'line-color': '#9dbaea',
				'target-arrow-color': '#9dbaea',
				'curve-style': 'bezier'
			}
		},
		{
			selector: ':selected', //style for selected elements
			style: {
				'border-opacity': 1,

				'line-color': 'black',
				'target-arrow-color': 'black',
			}
		},
		{
			selector: '.page',
			style:{
				'shape': 'roundrectangle',
				'background-color': 'light-gray',

			}
			
		},
		{
			selector: '.control',
			style:{
				'shape': 'ellipse',
				'background-color': 'yellow',
			}
			
		},
		{
			selector: '.source_node',
			style:{
				'border-width': 7,
				'border-opacity': 1,
				'border-color': '#9dbaea', //same as the edges!
			}
		},
		{
			selector: '.disconnected',
			style:{
				'border-width': 7,
				'border-opacity': 1,
				'border-color': 'red',

			}
		},
	],


	//define initial nodes and edges
	elements: {
		nodes: [
		],
		edges: [
		],

	},
	
	selectionType: 'single', //allows nodes to be selected
	minZoom: 1e-10,
	maxZoom: 1e10,
	
  
});
console.log("Canvas done")
