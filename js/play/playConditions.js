goog.provide('playConditions')


function executeOutcomes(edge){
	logger.log("<br>Executing Outcomes<br>")
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
					logger.log('Arrtibute ' + getAttributeText(html[0].childNodes[1].childNodes[0]) +  ' has reached its maximum value.<br>')
					att.value = att.maxValue
				}
				else if(newValue < att.minValue){
					logger.log('Arrtibute ' + getAttributeText(html[0].childNodes[1].childNodes[0]) +  ' has reached its minimum value.<br>')
					att.value = att.minValue
				}
				else{
					att.value = newValue
				}

				logger.log('Outcome: ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + '(' + attButton1_val + ') ' + modification +
										' ' + getAttributeText(html[0].childNodes[3].childNodes[0]) + '(' + attButton2_val + ') <br>')
				logger.log('Attribute ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + ' was modified to ' + att.value + '<br>')
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
		logger.log('Edge ' + edge.json().data.name + ' has no outcomes.<br>')
	}

}

function getTextButtonValue(childNode){
	return childNode.attributes['data-tooltip'].value
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
		logger.log("At control node. possible edges are: " + possibleEdges + '<br>')


		var results = [] //stores the T/F results of assessing each condition on edge
		var firstValidEdgeIndex = -1; //index of the first edge thats valid
		for(var i = 0; i<order.length; i++){

			var edgeResult = assessEdge(order[i])
			if(edgeResult === true){
				if(firstValidEdgeIndex === -1){
					firstValidEdgeIndex = i
				}
				logger.log("edge " + cy.edges("[id='" + order[i] + "']").json().data.name + " is a valid path. <br>")
			}
			else{
				logger.log("edge " + cy.edges("[id='" + order[i] + "']").json().data.name + " is an invalid path. <br>")
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
			logger.log("All edges from control node " + sourceNode.json().data.name + " have evaluated false. Following default fail edge...<br>")
		}

		logger.log("Progressing through edge " + cy.edges("[id='" + nextNodeID + "']").json().data.name + '<br>')
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
			logger.log("Assessing edge " + edge.json().data.name + '<br>')
			if(edge !== undefined){
				var conditions = edge.json().data.conditions

				if(conditions.length > 0){
					var ret = true
					for(var i = 0; i<conditions.length; i++){ //for all conditions in edge
						var result = assessCondition(conditions[i])
						console.log('RESULT: ' + result)
						if(result === false){
							ret = false
						}
					}
					return ret
				}
				else{
					logger.log('Edge ' + edge.json().data.name + ' has no conditions.' + '<br>')
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
	//console.log(condition)
	var html = $.parseHTML(condition.html)

	var type = html[0].attributes[1].value
	if(type === '1'){
		//attribute : comparison : attribute condition
		var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
		var comparison = html[0].childNodes[2].childNodes[0].data
		var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])

		//logger.log("Condition '" + )
		//console.log(attButton1_val + comparison + attButton2_val)
		//
		var ret = assessComparison(attButton1_val,comparison,attButton2_val)
		logger.log('Condition: ' + getAttributeText(html[0].childNodes[1].childNodes[0]) + '(' + attButton1_val + ') '+comparison + ' ' +
								getAttributeText(html[0].childNodes[3].childNodes[0]) + '('+ attButton2_val +') is ' + boolToString(ret) + '<br>')
		//console.log('result is ' + ret)
		return ret
	}
	else if(type === '2'){
		//attribute : comparison : attribute : comparison : attribute condition
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
								'('+rhs+')' +' is ' +  boolToString(ret) + '<br>')
		return ret

	}
	else if(type === '3'){
		//attribute : comparison : attribute : comparison : attribute : comparison : attribute condition
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
								'('+attButton3_val+')' + mod2 + ' ' + getAttributeText(html[0].childNodes[7].childNodes[0]) + '('+attButton4_val+')'+ ' is '+ boolToString(ret) + '<br>')
		return ret
	}
	else if(type === "4"){
		//inventory exists condition
		//get cond from html
		var itemID = html[0].childNodes[1].childNodes[0].attributes.itemid.value
		var item = gameInventory_getItem(itemID)
		var exists = html[0].childNodes[2].childNodes[0].firstChild.attributes.state.value

		//define if is exists/not exists
		if(exists === "true"){
			//exists
			if(item.playCount > 0){
				return true
			}
		}
		else{
			//not exists
			if(item.playCount === 0){
				return true
			}
		}
		return false

	}

}


function getAttributeValue(childNode){

	if(childNode.id.split('_')[3] === 'specValue'){
		//button is an input feild
		//the value attribute of the input feild must be explicitly set when saving a condition
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
		var pathx = childNode.attributes.path.nodeValue
		console.log("Path is: ", pathx);
		var att = gameAttributes_find(pathx)
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
