goog.provide('testgraph')
goog.require('initCanvas')


//tests if the graph is connected
//does a depth first search with an arbitrary node, then if it visits every node we know it is connected
//https://en.wikipedia.org/wiki/Connectivity_(graph_theory)#Computational_aspects

function testJumpNodes()
{

	//DISALLOW any way to reach a jumpend without having originated from a jump start node
	var pass = true;
	//idea: for all jumpend nodes check the classes of their greatest ancestor, if any aren't 'jump' then error!
	cy.$('.jumpend').each(function(i, ele)
	{
		var roots = ele.predecessors('node').roots();
		for (var i = 0; i < roots.size(); i++)
		{
			if (!roots[i].hasClass('jump'))
			{
				console.log("bad one found", roots[i].data('name'))
				//ele can be reached from a non-jump root
				pass = false
				roots[i].flashClass('jumpenderror', 3000);
				ele.flashClass('jumpenderror', 3000);
			}
		}
	});
	
	return pass;
}

function checkValidGraph()
{
	var alertString = "";
	
	if (cy.$('*').length < 1)
		alertString = alertString.concat("The graph is empty\n");

	//check if starting node is a page
	if (!cy.$('.start').hasClass('page'))
	{
		alertString = alertString.concat("Starting class must be a page node\n");
	}
	
	if (!testConnectivity())
	{
		alertString = alertString.concat("Graph is NOT connected\n");
	}
	
	if (!testJumpNodes())
	{
		alertString = alertString.concat("Jump End nodes can be reached without arriving from a jump start!\n")
	}

	if (alertString == "")
		alert("All tests passed");
	else
		alert(alertString);
}

function testConnectivity()
{
	var connected = false;
	
	var root_nodes = cy.$('.start, .jump'); //get the "start" node and all .jump start nodes
	var all_nodes = cy.$('.page, .control, .jumpend');
	
	console.log("Root nodes: " + root_nodes)
	
	var connected_nodes = cy.collection(); //empty collection
	connected_nodes = connected_nodes.add(root_nodes)	//add the root node
	
	var dfs = all_nodes.union(cy.$('edge')).dfs(
	{
		roots: root_nodes,
		visit: function(i, depth, v)
		{
			connected_nodes = connected_nodes.add(v); //add visited node to collection
			console.log( 'visit ' + this.id() + " total " + i);
		},
		directed: true,
	});
	
	console.log("Total nodes:" + all_nodes.size() + " Connected_nodes: " + connected_nodes.size())
	
	var disconnected_nodes = all_nodes.diff(connected_nodes).left;
	
	//check that these "disconnected" nodes dont have jump roots

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
	
	return (disconnected_nodes.size() == 0);
}
