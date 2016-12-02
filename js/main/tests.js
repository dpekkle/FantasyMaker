/*
	Name: tests
	Created By: Danielle
	Purpose: to define tests for checking the project valididty
*/

goog.provide('tests')


function testAudioObjects()
{
	console.info("Testing Audio");
	//must be imbed link, such as https://www.youtube.com/embed/4vKmEmY8ZD8
	project_project.audio.addAsset("Reggae Rap", "https://www.youtube.com/watch?v=4vKmEmY8ZD8")
	project_project.audio.addAsset("Fantasy RPG", "https://www.youtube.com/watch?v=Pq824AM9ZHQ")
	project_project.audio.addAsset("Missing You", "https://www.youtube.com/watch?v=Ct_t92NloA8")
	project_project.audio.addAsset("Electronic", "https://www.youtube.com/watch?v=MiRcFl8iafg")

	project_project.audio.selected_audio = 1;
	project_project.audio.removeAsset();
	project_project.audio.addAsset("Fantasy RPG", "https://www.youtube.com/watch?v=Pq824AM9ZHQ")


	try{
		for (var x = 0; x < project_project.audio.assets.length; x++)
		{
			if (project_project.audio.assets[x] === undefined)
				throw "There is an undefined entry in the array";
		}
		console.info("Testing Passed");

	}
	catch(err)
	{
		console.log("Audio error encountered: " + err)
	}
}

function test_Edge_Labels()
{
	var edge_graph_label = cy.nodes('.start').outgoers().edges().map(function( ele, i ){
  		return (ele.data('name') + " with " + ele.source().data('decisioncontainers')[i].name);
	});

	console.info(edge_graph_label);

	var decision_order = [];
	var decision_container = cy.nodes('.start').data('decisioncontainers');
	for (var i = 0; i < decision_container.length; i++)
	{
		decision_order.push(decision_container[i].name);
	}
	console.info(decision_order);
}
