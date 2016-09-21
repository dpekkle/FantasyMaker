goog.require('initCanvas') //for cytoscape functions like outgoers
goog.require('generalOverlay') //for escapehtml
goog.provide('playGame')
goog.require('project')
goog.require('audio')
goog.require('events')



//load project file here for play module

// currentNode = null;
// outgoingEdges = null;

function loadingScreen(more_to_load)
{
	if (!more_to_load)
	{
		//all the audio is loaded, allow player to continue
		$('#loader').hide();
		$('.progressbutton').show();

	}
	else
	{
		$('#loader').show();
		$('.progressbutton').hide();
	}

}

function prepareForGame()
{
	loadingScreen(project_project.audio.changed);

	event_manager = new eventManager();
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

	//preload all the audio assets
	if (project_project.audio.changed)
	{
		//clear assets
		$('#playwindow #audioplayerlist').html('');

		var audio_assets = project_project.audio.getAsset();
		for (var i = 0; i < audio_assets.length; i++)
		{
			audio_assets[i].loadAudio();
		}
		project_project.audio.changed = false;
	}
}

function wipeGame()
{
	project_project.audio.loaded = 0;

	//clear page
	for (var i = 0; i < project_project.audio.getAsset().length; i++)
	{
		project_project.audio.assets[i].stopAudio();
	}

	$('.playpage').html('');
	$('.playpage').attr('style', '');
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
	event_manager.newPage(currentNode.data('events'));
	stylePage();
}

function stylePage()
{
	//clear page
	$('.playpage').html('');
	$('.playpage').attr("style", currentNode.data('pagestyle'));

	//load page data
	var text_cont = currentNode.data('textcontainers');
	var dec_cont = currentNode.data('decisioncontainers');
	var img_cont = currentNode.data('imgcontainers');
	var output_cont = currentNode.data('outputcontainer');
	var events_list = currentNode.data('events');

	//create text containers
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
		if(assessEdge(currentNode.outgoers("[name='" + dec_cont[i].name + "']").id())){
			$('.playpage').append(dec_cont[i].html);
		}

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
	$(".playpage .handlecontainer").hide(); // can't drag without a handle

	$(".playpage").children().removeClass('resize-element');
	$(".playpage").children().children().removeClass('resize-element');

	$(".playpage").children().attr('contenteditable','false');
	$(".playpage").children().children().attr('contenteditable','false');

	//handle events
	for (var i = 0; i < events_list.length; i++)
	{

	}

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
		console.log('ER: ' + edgeResult)
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

	//progressStory(0)


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

			var ret = true
			for(var i = 0; i<conditions.length; i++){ //for all conditions in edge
				var result = assessCondition(conditions[i])

				if(result === false){
					ret = false
				}
			}
			return ret

		}
		else{
			console.log("assessEdge(): invalid edge. unable to assess")
			return false
		}
}


function assessCondition(condition){
	var html = $.parseHTML(condition.html)
	console.log(html)

	var type = html[0].attributes[1].value
	if(type === '1'){
		var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
		var comparison = html[0].childNodes[2].childNodes[0].data
		var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])
		console.log(attButton1_val + comparison + attButton2_val)
		console.log(assessComparison(attButton1_val,comparison,attButton2_val))
		return assessComparison(attButton1_val,comparison,attButton2_val)
	}
	else if(type === '2'){
		var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
		var modification = html[0].childNodes[2].childNodes[0].data
		var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])
		var lhs = assessModification(attButton1_val, modification,attButton2_val)

		var pivot = html[0].childNodes[4].childNodes[0].data
		var rhs = getAttributeValue(html[0].childNodes[5].childNodes[0])
		console.log(attButton1_val + ' ' + modification + ' ' + attButton2_val + ' ' + pivot + ' ' + rhs)
		console.log(assessComparison(lhs,pivot,rhs))
		return assessComparison(lhs,pivot,rhs)

	}
	else if(type === '3'){
		var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
		var mod1 = html[0].childNodes[2].childNodes[0].data
		var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])
		var lhs = assessModification(attButton1_val, mod1,attButton2_val)

		var pivot = html[0].childNodes[4].childNodes[0].data

		var attButton3_val = getAttributeValue(html[0].childNodes[5].childNodes[0])
		var mod2 = html[0].childNodes[6].childNodes[0].data
		var attButton4_val = getAttributeValue(html[0].childNodes[7].childNodes[0])
		var rhs = assessModification(attButton3_val,mod2,attButton4_val)
		console.log(attButton1_val + ' ' + mod1 + ' ' + attButton2_val + ' ' + pivot + ' ' + attButton3_val + ' ' + mod2 + ' ' + attButton4_val )
		console.log(assessComparison(lhs,pivot,rhs))
		return assessComparison(lhs,pivot,rhs)
	}

}


function getAttributeValue(childNode){

	if(childNode.id.split('_')[3] === 'specValue'){
		//button is an input feild
		console.log(childNode.childNodes[0].value)
		return parseFloat(childNode.childNodes[0].value)

	}
	else{
		//button is attribute button
		var path = childNode.attributes.path.nodeValue
		var att = gameAttributes_find(path)
		return att.value
	}

}

function assessComparison(left_value, comparison, right_value){
	var L = parseInt(left_value)
	var R = parseInt(right_value)
	switch (comparison) {
		case '=':
			if(L === R){
				return true
			}
			else{
				return false
			}
			break;

		case '!=':
			if(L !== R){
				return true
			}
			else{
				return false
			}
			break;

		case '>':
			if(L > R){
				return true
			}
			else{
				return false
			}
			break;

		case '<':
			if(L < R){
				return true
			}
			else{
				return false
			}
			break;

		case '>=':
			if(L >= R){
				return true
			}
			else{
				return false
			}
			break;

		case '<=':
			if(L <= R){
				return true
			}
			else{
				return false
			}
			break;
	}
}

function assessModification(left_value, modifier, right_value){
	var L = parseInt(left_value)
	var R = parseInt(right_value)
	switch (modifier) {
		case '=':
			var ret = R
			return ret
			break;

		case '+':
			var ret = L + R
			return ret
			break;

		case '-':
			var ret = L - R
			return ret
			break;

		case '*':
			var ret = L * R
			return ret
			break;

		case '/':
			var ret = L / R
			return ret
			break;
	}
}


function executeOutcomes(edge){
	console.log("Executing outcomes")
		outcomes = edge.json().data.outcomes
		for(var i = 0; i<outcomes.length; i++){
			var currOut = outcomes[i]
			var html = $.parseHTML(currOut.html)

			var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
			var modification = html[0].childNodes[2].childNodes[0].data
			var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])
			var newValue = assessModification(attButton1_val,modification,attButton2_val)

			var path = html[0].childNodes[1].childNodes[0].attributes[5].value
			var att = gameAttributes_find(path)
			att.value = newValue
			console.log(attButton1_val + ' ' + modification + ' ' + attButton2_val + ' ' + newValue + ' ' + path)
			console.log(html)
		}
}

function progressStory(i)
{
	if (currentNode === null) //very first page
	{
		if (cy.$('*').length < 1)
		{
			alert("Your graph is empty")
		}
		else
		{
			currentNode = cy.$('.start')[0];
			parseNode();
		}
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
		console.log("Reached the end")
		$('.playpage').html('<h1>Fin!</h1>');
	}
}

function stripDraggable(str)
{
	var newstr = str.replace(/drag-element/g, "");
	return newstr;
}
