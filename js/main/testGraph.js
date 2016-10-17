goog.provide('testgraph')
goog.require('initCanvas')


//tests if the graph is connected
//does a depth first search with an arbitrary node, then if it visits every node we know it is connected
//https://en.wikipedia.org/wiki/Connectivity_(graph_theory)#Computational_aspects

function testJumpNodes()
{

	//DISALLOW any way to reach a jumpend without having originated from a jump start node
	var bad_jumpers = cy.collection();

	//idea: for all jumpend nodes check the classes of their greatest ancestor, if any aren't 'jump' then error!
	cy.$('.jumpend').each(function(ele)
	{
		var x = ele.predecessors('node').roots();
		x.each(function(a_root)
		{
			if (!a_root.hasClass('jump'))
			{
				//ele can be reached from a non-jump root
				bad_jumpers.add(a_root);
				bad_jumpers.add(ele);
			}
		});
	});
	
	if (bad_jumpers.size() != 0)
	{
		bad_jumpers.addClass('jumpenderror');
		//disconnected_nodes.delay(3000, disconnected_nodes.removeClass('disconnected'));
		
		//alternative in case delay "breaks" again (removenode was not firing for some reason occasionally)
		setTimeout(function()
		{ 
			bad_jumpers.removeClass('jumpenderror');
		}, 3000);
		return false;
	}
	else{
		return true;
	}
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
	
	if (!testJumpNodes)
	{
		alertString = alertString.concat("Jump End nodes can be reached without arriving from a jump start!")
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
	
	if (all_nodes.size() == connected_nodes.size())
	{
		connected = true;
	}
	else //change appearance of not-connected nodes
	{
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
		

	}

	return connected;
}
