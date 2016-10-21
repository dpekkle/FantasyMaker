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
				var path = getAttributePath(html[0].childNodes[1].childNodes[0])


				if(attButton1_val === undefined || attButton2_val === undefined || path === undefined){
					console.log('executeOutcomes() attribute modification: attButton1, attButton2, or path is undefined')
					return
				}

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

				if(attButton1_val === undefined){
					console.log('executeOutcomes() attribute modification: attButton1 or attButton2 is undefined')
					attButton1_val = ' <Error: No attribute selected> '
					//return
				}

				logger.playerLog(textButton1_val + attButton1_val + textButton2_val)

			}
			else if(type === 'Text-InvItem-Text'){
				console.log('TEXT ATT TEXT:')
				console.log('ONE: ' + getTextButtonValue(html[0].childNodes[1].childNodes[0]))
				console.log('TWO: ' + getTextButtonValue(html[0].childNodes[3].childNodes[0]))

				var textButton1_val = getTextButtonValue(html[0].childNodes[1].childNodes[0])
				var item = getInventoryItemFromHtml(html[0].childNodes[2].childNodes[0])
				var textButton2_val = getTextButtonValue(html[0].childNodes[3].childNodes[0])

				var itemText = ''
				if(item !== undefined){
					itemText = item.playCount

				}
				else{
					console.log('executeOutcomes() inventory Text-InvItem-Text: item is undefined.')
				}

				logger.playerLog(textButton1_val + itemText + textButton2_val)
			}
			else if(type === "Text"){
				//console.log('TEXT: ')
				//console.log(getTextButtonValue(html[0].childNodes[1].childNodes[0]))

				var textButton1_val = getTextButtonValue(html[0].childNodes[1].childNodes[0])
				logger.playerLog(textButton1_val)

			}
			else if(type ==='inventory_addRemove'){
				console.log(html)
				var state = getAddRemoveButtonState(html[0].childNodes[1].childNodes[0])
				var inputFieldValue = getAttributeValue(html[0].childNodes[2].childNodes[0])
				var item = getInventoryItemFromHtml(html[0].childNodes[3].childNodes[0])

				if(item === undefined){
					console.log('executeOutcomes() inventory add/remove: item is undefined.')
					return
				}
				else if(isNaN(inputFieldValue)){
					console.log('executeOutcomes() inventory add/remove: inputFieldValue is not a number.')
					return
				}

				if(state === 'add'){
					var currPlayCount = parseInt(item.playCount)
					var newCount = currPlayCount + inputFieldValue
					item.playCount = newCount
				}
				else if(state === 'remove'){
					var currPlayCount = parseInt(item.playCount)
					var newCount = currPlayCount - inputFieldValue
					if(newCount < 0){
						item.playCount = 0
					}
					else{
						item.playCount = newCount
					}
				}

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

function getAddRemoveButtonState(childNode){
	//console.log('GET ADDREMOVE BUTTON STATE:')
	return childNode.childNodes[0].attributes.state.value

}

function parseControl(sourceNode, outgoingEdges){
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

function getInventoryItemFromHtml(childNode){
	var itemID = childNode.attributes.itemid.value
	return gameInventory_getItem(itemID)
}


function assessCondition(condition){
	//console.log(condition)
	var html = $.parseHTML(condition.html)
	//console.log(html)
	var type = html[0].attributes[1].value
	if(type === '1'){
		//attribute : comparison : attribute condition
		var attButton1_val = getAttributeValue(html[0].childNodes[1].childNodes[0])
		var comparison = html[0].childNodes[2].childNodes[0].data
		var attButton2_val = getAttributeValue(html[0].childNodes[3].childNodes[0])

		if(attButton1_val === undefined || attButton2_val === undefined){
			console.log('assessCondition() type1: attButton1 or attButton2 is undefined')
			return false
		}

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
		var pivot = html[0].childNodes[4].childNodes[0].data
		var rhs = getAttributeValue(html[0].childNodes[5].childNodes[0])
		if(attButton1_val === undefined || attButton2_val === undefined || rhs === undefined){
			console.log('assessCondition() type2: attButton1, attButton2 or rhs is undefined')
			return false
		}

		var lhs = assessModification(attButton1_val, modification,attButton2_val)

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
		var attButton3_val = getAttributeValue(html[0].childNodes[5].childNodes[0])
		var pivot = html[0].childNodes[4].childNodes[0].data
		var mod2 = html[0].childNodes[6].childNodes[0].data
		var attButton4_val = getAttributeValue(html[0].childNodes[7].childNodes[0])

		if(attButton1_val === undefined || attButton2_val === undefined || attButton3_val === undefined || attButton4_val === undefined){
			console.log('assessCondition() type3: attButton1, attButton2,attButton3, or attButton4 is undefined')
			return false
		}

		var lhs = assessModification(attButton1_val, mod1,attButton2_val)
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
		var item = getInventoryItemFromHtml(html[0].childNodes[1].childNodes[0])
		var exists = html[0].childNodes[2].childNodes[0].firstChild.attributes.state.value

		if(item === undefined || exists === undefined){
			console.log('assessCondition() type4: item or exists is undefined')
			return false
		}

		if(isNaN(parseInt(item.playCount))){
			console.log('assessCondition() type4: item.playCount is not a number')
			return false
		}

		if(exists === "true" || exists === true){
			//exists
			console.log('dose exist?')
			if(parseInt(item.playCount) > 0){
				console.log('YES')
				return true
			}
			console.log('NO')
		}
		else{
			//not exists
			console.log('does not exist?')
			if(parseInt(item.playCount) === 0){
				console.log('YES')
				return true
			}
			console.log('NO')
		}
		return false

	}
	else if(type === "5"){
		//amount of inventory exists
		//get cond from html
		console.log(html)

		var itemID = html[0].childNodes[1].childNodes[0].attributes.itemid.value
		var item = gameInventory_getItem(itemID)
		var inputFieldValue = getAttributeValue(html[0].childNodes[2].childNodes[0])

		//define if is exists/not exists
		if(itemID === undefined || item === undefined){
			console.log('assessCondition() type4: item undefined')
			return false
		}
		else if(isNaN(parseInt(item.playCount))){
			console.log('assessCondition() type4: item.playCount is not a number')
			return false
		}

		if(parseInt(item.playCount) === inputFieldValue){
			//console.log('YES')
			return true
		}
		//console.log('NO')

		return false

	}
	else if(type === "6"){
		//random number comparisons use type1 assessment
		console.log('Type 6 condition should not be used, use type 1 for random comparisons')
		return false
	}
}

function getAttributeValue(childNode){
	//console.log('getting value for: ' + childNode.id)
	//if(childNode.id.split('_')[3] === 'specValue'){
	if(childNode.classList[0] === 'input-field'){
		//button is an input feild
		//the value attribute of the input feild must be explicitly set when saving a condition
		var ret = parseFloat(childNode.attributes.value.value)
		//console.log('Specific Value parsed: ' + childNode.attributes.value.value )
		return parseFloat(childNode.attributes.value.value)

	}
	else if(childNode.classList[0] === 'random'){
		console.log('random number found')
		//console.log('GENERATING RANDOM NUMBER')

		var min = parseFloat(childNode.attributes.min.value)
		var max = parseFloat(childNode.attributes.max.value)
		var rand = Math.floor(Math.random() * (max - min + 1)) + min
		console.log('Generated number between ' + min + ' and ' + max + ' is: ' + rand)
		return rand;
	}
	else{
		//button is attribute button
			var pathx = getAttributePath(childNode)
			if(pathx === undefined){
				return
			}
			//console.log("Path is: ", pathx);
			var att = gameAttributes_find(pathx)
			//console.log("Att Value is: ", att.value);
			if(att === undefined){
				console.log('getAttributeValue(): att is undefined')
				return
			}
			return att.value


	}

}

function getAttributePath(childNode){
	if(childNode.attributes.hasOwnProperty('path')){
		console.log('getAttributePath(): path is undefined')
		return childNode.attributes.path.nodeValue
	}
}

function getAttributeText(childNode){
	if(childNode.classList[0] === 'input-field'){
		//button is an input feild
		return childNode.attributes.value.value
	}
	else if(childNode.classList[0] === 'random'){
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

	//console.log('COMPARISON: LEFT' + L + ' ' + comparison + ' RIGHT: ' + R)
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
	var L = parseFloat(left_value)
	var R = parseFloat(right_value)
	console.log('MODIFICATION: LEFT: ' + L + ' RIGHT: ' + R)
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
