goog.require('initCanvas') //for cytoscape functions like outgoers
goog.require('generalOverlay') //for escapehtml
goog.provide('playGame')
goog.require('project')


currentNode = null;
outgoingEdges = null;

function prepareForGame()
{
	currentNode = null;
	outgoingEdges = null;

	//clear page
	$('.playpage').html('');

	//consider case where someone creates pages without opening the page style overlay, in which case no style is assigned
	//will probably be an empty page i.e. no html

	var eles = cy.elements();
	for (var i = 0; i < eles.length; i++)
	{
		updatePageStyle(eles[i]);
	}
}


function parseNode()
{
	console.log("Parse node ", currentNode.data('id'));

	outgoingEdges = currentNode.outgoers().edges();

	if (currentNode.hasClass('page'))
	{
		parsePage(outgoingEdges);
	}
	else if (currentNode.hasClass('control'))
	{
		parseControl(currentNode, outgoingEdges);
	}
}

function parsePage(outgoingEdges)
{
	stylePage();
}

function stylePage()
{
	//clear page
	$('.playpage').html('');

	//create text containers
	var text_cont = currentNode.data('textcontainers');
	var dec_cont = currentNode.data('decisioncontainers');
	var img_cont = currentNode.data('imgcontainers');
	var output_cont = currentNode.data('outputcontainer');

	for (var i = 0; i < text_cont.length; i++)
	{
		$('.playpage').append(text_cont[i].html);
	}

	for (var i = 0; i < img_cont.length; i++)
	{
		$('.playpage').append(img_cont[i].html);
	}

	for (var i = 0; i < dec_cont.length; i++)
	{
		// we will need to check visibility conditions when deciding to add a decision container to a page
		$('.playpage').append(dec_cont[i].html);
	}

	$('.playpage').append(output_cont);

	//give decisions on click behaviour
	$('.playpage').children("div[class^='decision-container']").each(function(index)
	{
		$(this).click(function()
		{
			progressStory(index);
		})
	});

	//make content read-only
	$(".playpage .handle").hide(); // can't drag without a handle

	$(".playpage").children().removeClass('resize-element');
	$(".playpage").children().children().removeClass('resize-element');

	$(".playpage").children().attr('contenteditable','false');
	$(".playpage").children().children().attr('contenteditable','false');

}

function parseControl(sourceNode, outgoingEdges)
{
	//handle control stuff
	//Todo - Check Inventory Items & Attributes
	console.log("At control node. possible edges are: " + sourceNode.json().data.priorityList)

	var order = sourceNode.json().data.priorityList //get order in which to assess edges
	var results = [] //stores the T/F results of assessing each condition on edge
	var firstValidEdgeIndex = -1; //index of the first edge thats valid
	for(var i = 0; i<order.length; i++){

		var edgeResult = assessEdge(order[i])
		if(edgeResult === true){
			if(firstValidEdgeIndex === -1){
				firstValidEdgeIndex = i
			}
			console.log("edge " + cy.edges("[id='" + order[i] + "']").json().data.name + " is a valid path")
		}
		else{
			console.log("edge " + cy.edges("[id='" + order[i] + "']").json().data.name + " is an invalid path")
		}
		results[i] = edgeResult

	}

	//find first eligable edge ID
	var nextNodeID = null
	if(firstValidEdgeIndex !== -1){
		nextNodeID = order[firstValidEdgeIndex]
	}

	var nextNodeIndex = null
	if(nextNodeID !== null){	//valid path has been found
		nextNodeIndex = getIndexFromOutgoingEdges(nextNodeID, outgoingEdges)
	}
	else{	//no valid path, follow default fail edge
		//dazNote - update when user can choose default fail edge
		nextNodeIndex = getIndexFromOutgoingEdges(sourceNode.json().data.defaultFailEdge, outgoingEdges)
		console.log("All edges from control node " + sourceNode.json().data.name + " have evaluated false. Following default fail edge...")
	}

	if(nextNodeIndex !== -1){
		progressStory(nextNodeIndex)
	}
	else{
		progressStory(0)
		console.log("parseControl(): invalid edge id. progressing to first edge in outgoingEdges")
	}

}

//function that converts an edgeID into the index of given edge in outgoingEdges array
function getIndexFromOutgoingEdges(id, outgoingEdges){
	var outs = outgoingEdges.jsons()
	for(var a = 0; a<outs.length; a++){
		if(outs[a].data.id === id){
			return a
		}
	}

	return -1
}

function assessEdge(edgeID){

	var edge = cy.edges("[id='" + edgeID + "']")
	console.log("Assessing edge " + edge.json().data.name)
	if(edge !== undefined){
		var conditions = edge.json().data.conditions
		var results = [] //storage of results of T/F condition assessments
		var character = project_project.characters[0] //character to assess against

		for(var i = 0; i<conditions.length; i++){ //for all conditions in edge
			var currCond = conditions[i]
			switch (currCond.comparison) {
				case '=':
					if(parseInt(character[currCond.stat]) === parseInt(currCond.value)){
						results[i] = true
					}
					else{
						results[i] = false
					}
					break;

				case '!=':
					if(parseInt(character[currCond.stat]) !== parseInt(currCond.value)){
						results[i] = true
					}
					else{
						results[i] = false
					}
					break;

				case '>':
					if(parseInt(character[currCond.stat]) > parseInt(currCond.value) ){
						results[i] = true
					}
					else{
						results[i] = false
					}
					break;

				case '<':
					if(parseInt(character[currCond.stat]) < parseInt(currCond.value)){
						results[i] = true
					}
					else{
						results[i] = false
					}
					break;

				case '>=':
					if(parseInt(character[currCond.stat]) >= parseInt(currCond.value)){
						results[i] = true
					}
					else{
						results[i] = false
					}
					break;

				case '<=':
					if(parseInt(character[currCond.stat]) <= parseInt(currCond.value)){
						results[i] = true
					}
					else{
						results[i] = false
					}
					break;
			}

			if(results[i] === true){
				console.log("Condition '" + currCond.stat + " " + currCond.comparison + " " + currCond.value + "' is true")
			}
			else{
				console.log("Condition '" + currCond.stat + " " + currCond.comparison + " " + currCond.value + "' is false")
			}


		}

		//assess if all conditions are met
		var res = true;
		for(var x = 0; x<results.length; x++){
			if(results[x] === false){
				res = false
			}
		}

		if(res.length === 0){
			res = false
		}
		return res;
	}
	else{
		console.log("assessEdge(): invalid edge. unable to assess")
		return false
	}
}

function executeOutcomes(edge){
	console.log("Executing outcomes")
	console.log(project_project.characters[0])
	outcomes = edge.json().data.outcomes
	var character = project_project.characters[0]
	for(var i = 0; i<outcomes.length; i++){
		var currOut = outcomes[i]
		switch (currOut.modifier) {
			case '=':
				character[currOut.stat] = parseInt(currOut.value)
				break;

			case '+':
				character[currOut.stat] = parseInt(character[currOut.stat]) + parseInt(currOut.value)
				break;

			case '-':
				character[currOut.stat] = parseInt(character[currOut.stat]) - parseInt(currOut.value)
				break;

			case '*':
				character[currOut.stat] = parseInt(character[currOut.stat]) * parseInt(currOut.value)
				break;

			case '/':
				character[currOut.stat] = parseInt(character[currOut.stat]) / parseInt(currOut.value)
				break;
		}
	}
	console.log(project_project.characters[0])
}

function progressStory(i)
{
	if (currentNode === null) //very first page
	{
		currentNode = cy.$('.start')[0];
		parseNode();
	}
	else if (currentNode.outgoers().size() > 0)
	{
		currentNode = outgoingEdges.eq(i).target();
		//need to run edge outcomes here
		executeOutcomes(outgoingEdges.eq(i))
		console.log("Now on node ", currentNode.data('id'));
		parseNode();
	}
	else
	{
		currentNode = null;
		$('.playpage').html("");
	}
}

function stripDraggable(str)
{
	var newstr = str.replace(/drag-element/g, "");
	return newstr;
}
