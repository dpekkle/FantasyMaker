goog.require('initCanvas') //for cytoscape functions like outgoers
goog.require('generalOverlay') //for escapehtml
goog.provide('playGame')
goog.require('project')
goog.require('audio')
goog.require('events')
goog.require('logger')



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

	//reset all audio
	for (var i = 0; i < project_project.audio.getAsset().length; i++)
	{
		project_project.audio.assets[i].setVolume(100);
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
	resizePlayPage();
	//load page data
	var text_cont = currentNode.data('textcontainers');
	var dec_cont = currentNode.data('decisioncontainers');
	var img_cont = currentNode.data('imgcontainers');
	var vid_cont = currentNode.data('vidcontainers');
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

	for (var i = 0; i < vid_cont.length; i++)
	{
		$('.playpage').append(vid_cont[i].html);
	}

	for (var i = 0; i < dec_cont.length; i++)
	{
		// we will need to check visibility conditions when deciding to add a decision container to a page
		if(assessEdge(currentNode.outgoers("[name='" + dec_cont[i].name + "']").id())){
			$('.playpage').append(dec_cont[i].html);
		}

	}

	$('.playpage').append(output_cont);

	//append output container data based on maker or player mode
	if($('.output-container').hasClass('player')){
		$('.output-container').children().append(logger.playerOutput())
	}
	else if($('.output-container').hasClass('maker')){
		$('.output-container').children().append(logger.makerOutput())
	}
	logger.flush()


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
	$(".playpage").children().removeClass('resize-child'); //for youtube videos
	$(".playpage").children().children().removeClass('resize-element');

	$(".playpage").children().attr('contenteditable','false');
	$(".playpage").children().children().attr('contenteditable','false');
}

function parseControl(sourceNode, outgoingEdges)
{

		//logger.flush()
		var order = sourceNode.json().data.priorityList //get order in which to assess edges
		//handle control stuff
		//Todo - Check Inventory Items & Attributes
		var possibleEdges = ''
		for(var i = 0; i<order.length; i++){
			possibleEdges += cy.edges("[id='" + order[i] + "']").json().data.name
			if(i !== order.length-1){
				possibleEdges += ','
			}
		}
	//	console.log(possibleEdges)
		logger.log("At control node. possible edges are: " + possibleEdges)


		var results = [] //stores the T/F results of assessing each condition on edge
		var firstValidEdgeIndex = -1; //index of the first edge thats valid
		for(var i = 0; i<order.length; i++){

			var edgeResult = assessEdge(order[i])
			if(edgeResult === true){
				if(firstValidEdgeIndex === -1){
					firstValidEdgeIndex = i
				}
				logger.log("edge " + cy.edges("[id='" + order[i] + "']").json().data.name + " is a valid path")
			}
			else{
				logger.log("edge " + cy.edges("[id='" + order[i] + "']").json().data.name + " is an invalid path")
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
			logger.log("All edges from control node " + sourceNode.json().data.name + " have evaluated false. Following default fail edge...")
		}

		logger.log("Progressing through edge " + cy.edges("[id='" + nextNodeID + "']").json().data.name)
		if(nextNodeIndex !== -1){
			//console.log(logger.outputAsArray())
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
			logger.log("Assessing edge " + edge.json().data.name)
			if(edge !== undefined){
				var conditions = edge.json().data.conditions
				var results = [] //storage of results of T/F condition assessments


				if(conditions.length > 0){
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
					logger.log('Edge ' + edge.json().data.name + ' has no conditions.')
					return true
				}


			}
			else{
				console.log("assessEdge(): invalid edge. unable to assess")
				return false
			}
}

function boolToString(bool){
	if(bool){
		return 'true'
	}
	else{
		return 'false'
	}
}


function assessCondition(condition){
	var html = $.parseHTML(condition.html)
	//console.log('Assess Condition: ')
	//console.log(html)

	var type = html[0].attributes[1].value
	if(type === '1'){
		var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
		var comparison = html[0].childNodes[2].childNodes[0].data
		var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])

		//logger.log("Condition '" + )
		//console.log(attButton1_val + comparison + attButton2_val)
		//console.log()
		var ret = assessComparison(attButton1_val,comparison,attButton2_val)
		logger.log('Condition: ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + '(' + attButton1_val + ') '+comparison + ' ' +
								getAttributeText(html[0].childNodes[3].childNodes[0]) + '('+ attButton2_val +') is ' + boolToString(ret))
		return ret
	}
	else if(type === '2'){
		var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
		var modification = html[0].childNodes[2].childNodes[0].data
		var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])
		var lhs = assessModification(attButton1_val, modification,attButton2_val)

		var pivot = html[0].childNodes[4].childNodes[0].data
		var rhs = getAttributeValue(html[0].childNodes[5].childNodes[0])


		//console.log(attButton1_val + ' ' + modification + ' ' + attButton2_val + ' ' + pivot + ' ' + rhs)
		var ret = assessComparison(lhs,pivot,rhs)
		logger.log('Condition: ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + '(' + attButton1_val + ') ' + modification + ' ' +
								getAttributeText(html[0].childNodes[3].childNodes[0]) + '('+ attButton2_val +') ' + pivot + ' ' + getAttributeText(html[0].childNodes[5].childNodes[0]) +
								'('+rhs+')' +' is ' +  boolToString(ret))
		return ret

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
		//console.log(attButton1_val + ' ' + mod1 + ' ' + attButton2_val + ' ' + pivot + ' ' + attButton3_val + ' ' + mod2 + ' ' + attButton4_val )
		//console.log(assessComparison(lhs,pivot,rhs))
		var ret = assessComparison(lhs,pivot,rhs)
		logger.log('Condition: ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + '(' + attButton1_val + ') ' + mod1 + ' ' +
								getAttributeText(html[0].childNodes[3].childNodes[0]) + '('+ attButton2_val +') ' + pivot + ' ' + getAttributeText(html[0].childNodes[5].childNodes[0]) +
								'('+attButton3_val+')' + mod2 + ' ' + getAttributeText(html[0].childNodes[7].childNodes[0]) + '('+attButton4_val+')'+ ' is '+ boolToString(ret))
		return ret
	}


}


function getAttributeValue(childNode){

	if(childNode.id.split('_')[3] === 'specValue'){
		//button is an input feild
		//console.log(childNode.childNodes[0].value)
		return parseFloat(childNode.childNodes[0].value)

	}
	else if(childNode.id.split('_')[3] === 'randValue'){
		//console.log('GENERATING RANDOM NUMBER')
		var min = parseFloat(childNode.attributes.min.value)
		var max = parseFloat(childNode.attributes.max.value)
		return Math.floor(Math.random() * (max - min + 1)) + min;

	}
	else{
		//button is attribute button
		var path = childNode.attributes.path.nodeValue
		var att = gameAttributes_find(path)
		return att.value
	}

}

function getAttributeText(childNode){
	if(childNode.id.split('_')[3] === 'specValue'){
		//button is an input feild
		//console.log(childNode.childNodes[0].value)
		return childNode.childNodes[0].value

	}
	else if(childNode.id.split('_')[3] === 'randValue'){
		return "a random number"
	}
	else{
		var path = childNode.attributes.path.value.split('_')
		//console.log("PATH: ")
		//console.log(path)
		var ret
		var currPath
		for(var i = 0; i<path.length; i++){
			if(i === 0){
				currPath = path[i]
				//console.log(currPath)
				ret = gameAttributes_find(currPath).name
			}
			else{
				currPath += '_' + path[i]
				//console.log(currPath)

				ret += ' : ' + gameAttributes_find(currPath).name
			}
		}
		return ret
	}

}

function assessComparison(left_value, comparison, right_value){
	var L = parseFloat(left_value)
	var R = parseFloat(right_value)
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
	logger.log("Executing outcomes")
	outcomes = edge.json().data.outcomes
	if(outcomes.length > 0){
		for(var i = 0; i<outcomes.length; i++){
			var currOut = outcomes[i]
			var html = $.parseHTML(currOut.html)
			console.log(html)

			var type = html[0].attributes[1].value
			if(type === "Attribute Modification"){
				var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
				var modification = html[0].childNodes[2].childNodes[0].data
				var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])
				var newValue = assessModification(attButton1_val,modification,attButton2_val)

				var path = html[0].childNodes[1].childNodes[0].attributes.path.value
				var att = gameAttributes_find(path)

				//evaluate atts mix/max values
				if(newValue > att.maxValue){
					logger.log('Arrtibute ' + getAttributeText(html[0].childNodes[1].childNodes[0]) +  ' has reached its maximum value.')
					att.value = att.maxValue
				}
				else if(newValue < att.minValue){
					logger.log('Arrtibute ' + getAttributeText(html[0].childNodes[1].childNodes[0]) +  ' has reached its minimum value.')
					att.value = att.minValue
				}
				else{
					att.value = newValue
				}

				logger.log('Outcome: ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + '(' + attButton1_val + ') ' + modification +
										' ' + getAttributeText(html[0].childNodes[3].childNodes[0]) + '(' + attButton2_val + ') ' )
				logger.log('Attribute ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + ' was modified to ' + att.value)
			}
			else if(type === "Text-Attribute-Text"){
				console.log('TEXT ATT TEXT:')
				console.log('ONE: ' + getTextButtonValue(html[0].childNodes[1].childNodes[0]))
				console.log('TWO: ' + getTextButtonValue(html[0].childNodes[3].childNodes[0]))

				var textButton1_val = getTextButtonValue(html[0].childNodes[1].childNodes[0])
				var attButton1_val = getAttributeValue(html[0].childNodes[2].childNodes[0])
				var textButton2_val = getTextButtonValue(html[0].childNodes[3].childNodes[0])
				logger.playerLog(textButton1_val + attButton1_val + textButton2_val)

			}
			else if(type === "Text"){
				//console.log('TEXT: ')
				//console.log(getTextButtonValue(html[0].childNodes[1].childNodes[0]))

				var textButton1_val = getTextButtonValue(html[0].childNodes[1].childNodes[0])
				logger.playerLog(textButton1_val)

			}
		}
	}
	else{
		logger.log('Edge ' + edge.json().data.name + ' has no outcomes.')
	}

}

function getTextButtonValue(childNode){
	return childNode.attributes['data-tooltip'].value
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

function resizePlayPage()
{
	$('.playpage').width(project_project.resolution.x);
	$('.playpage').height(project_project.resolution.y);
	var scale;


	var y = $(window).height();		//want total height of the page
	var buffer = $('#tabheadings').outerHeight() + $('.nav-wrapper').outerHeight() + $('.progressbutton').outerHeight();

	$('#playwindow').css('height', y-buffer); //tabs at top are 42;

	var w = $('#playwindow').width();
	var h = $('#playwindow').height();
	var inner_w = $('.playpage').width();
	var inner_h = $('.playpage').outerHeight();

	scale = Math.min(w/inner_w, h/inner_h);

	$('.playpage').css({'transform': 'scale(' + scale + ')'});
	$('.playpage').css({'-ms-transform': 'scale(' + scale + ')'});
	$('.playpage').css({'-webkit-transform': 'scale(' + scale + ')'});

}

$(window).resize(resizePlayPage);
