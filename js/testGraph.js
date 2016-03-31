goog.provide('testgraph')
goog.require('initCanvas')


//tests if the graph is connected
//does a depth first search with an arbitrary node, then if it visits every node we know it is connected
//https://en.wikipedia.org/wiki/Connectivity_(graph_theory)#Computational_aspects
function testConnectivity()
{
	var connected = false;
	
	var arbitrary_node = cy.$('node').first(); //get the "first" node (doesn't matter which)  in the collection of all nodes
	var all_nodes = cy.$('node');
	
	console.log("Root node: " + arbitrary_node.data('id'))
	
	var connected_nodes = cy.collection(); //empty collection
	connected_nodes = connected_nodes.add(arbitrary_node)	//add the root node
	
	var dfs = cy.elements().dfs(
	{
		roots: arbitrary_node,
		visit: function(i, depth, v)
		{
			connected_nodes = connected_nodes.add(v); //add visited node to collection
			console.log( 'visit ' + this.id() + " total " + i);
		},
		directed: true,
	});
	
	console.log("Total nodes:" + all_nodes.size() + " Connected_nodes: " + connected_nodes.size())
	
	if (all_nodes.size() == connected_nodes.size())
	{
		connected = true;
	}
	else //change appearance of not-connected nodes
	{
		alert("Graph is not connected");

		var disconnected_nodes = all_nodes.diff(connected_nodes).left;
		
		console.log("Disconnected:", disconnected_nodes.size())
		var getNodeId = function( n ){ return n.id() };
		console.log( 'left: ' + disconnected_nodes.map( getNodeId ).join(', ') ); //return the id's of disconnected nodes

		disconnected_nodes.addClass('disconnected');
		//disconnected_nodes.delay(3000, disconnected_nodes.removeClass('disconnected'));
		
		//alternative in case delay "breaks" again (removenode was not firing for some reason occasionally)
		setTimeout(function()
		{ 
			disconnected_nodes.removeClass('disconnected');
		}, 3000);
		

	}

	return connected;
}
