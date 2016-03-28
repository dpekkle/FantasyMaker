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
				'background-color': '#777777',
				'border-width': 5,
				'border-opacity': 0,
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
				'shape': 'roundrectangle'
			}
			
		},
		{
			selector: '.decision',
			style:{
				'shape': 'ellipse'
			}
			
		},
	],


	//define initial nodes and edges
	elements: {
		nodes: [
			{ data: { id: 'a', text: 'sample text 1'}, classes: 'page' },
			{ data: { id: 'b', text: 'sample text 2'}, classes: 'decision' },		
		],
		edges: [
			{ data: { id: 'edge-ab', source: 'a', target: 'b'} }
		],

	},
	
	selectionType: 'single', //allows nodes to be selected
	
  
});
console.log("Canvas done")
