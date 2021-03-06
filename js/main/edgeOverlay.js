/*
	Name: edgeOverlay.js
	Created By: Darryl
	Purpose: To handle the population and initialization of the edge design overlay
*/

goog.provide('edgeOverlay')
goog.require('project')
goog.require('conditions')

var edgeOverlay_newConditionCount = 0; //used to identify how many conds user has added to ui
var edgeOverlay_newOutcomeCount = 0; //used to identify how many outcomes user has added to ui
var edgeOverlay_selectedEdge; // edge that the user is modifying (DAZ NOTE - NOT USED?)

function populateEdgeOverlay(edge){

	var srcName = cy.nodes("[id='" + edge.data.source +"']").json().data.name;
	var destName = cy.nodes("[id='" + edge.data.target +"']").json().data.name;
	$('#edge_name').text('Path: ' + edge.data.name)
	$('#edge_details').text('(Page ' + srcName + '   to    Page ' + destName + ')')

	//$('#edge_name').attr('data-tooltip','Origin of edge: page '+srcName+'<br> Target of edge: page'+destName+'<br>')
	//$('#edge_name').tooltip({delay: 50});

	//reset for new page overlay
	edgeOverlay_newConditionCount = 0;
	edgeOverlay_newOutcomeCount = 0;
	edgeOverlay_selectedEdge = edge;

	//for all condition in edge
	for(var i = 0; i<edge.data.conditions.length; i++){
		var curr = edge.data.conditions[i];
		console.log(curr)

		//add condition to ui
		edgeOverlay_addExistingCondition("conditionsList",curr); // adds default condition html to ui

	}

	//for all outcome in edge
	for(var i = 0; i<edge.data.outcomes.length; i++){
		var curr = edge.data.outcomes[i];

		//add condition to ui
		edgeOverlay_addExistingOutcome("outcomesList",curr); // adds default outcome html to ui
	}
}

function saveEdge(selectedEdge, mode){

		//console.log(cy.elements().jsons())

		var currEdge = selectedEdge.json();

		setInputFieldValues()
		//save all existing conditions
		for(var i = 0; i<currEdge.data.conditions.length; i++){
			var temp = currEdge.data.conditions[i]
			if($('#exCondition_' + temp.edge + '_' + temp.id).length > 0){
				/*
				$('#exCondition_' + temp.edge + '_' + temp.id + '_specValue_s1_2_inputField').attr('value',$('#exCondition_' + temp.edge + '_' + temp.id + '_specValue_s1_2_inputField').val())
				$('#exCondition_' + temp.edge + '_' + temp.id + '_specValue_s2_1_inputField').attr('value',$('#exCondition_' + temp.edge + '_' + temp.id + '_specValue_s2_1_inputField').val())
				$('#exCondition_' + temp.edge + '_' + temp.id + '_specValue_s2_2_inputField').attr('value',$('#exCondition_' + temp.edge + '_' + temp.id + '_specValue_s2_2_inputField').val())
				*/

				var html = $('#exCondition_' + temp.edge + '_' + temp.id).html()

				temp.html = html
			}

		}





		//save all existing outcomes
		for(var i = 0; i<currEdge.data.outcomes.length; i++){
			var temp = currEdge.data.outcomes[i];
			var id = 'exOutcome_' + temp.edge + '_' + temp.id

			if($('#exOutcome_' + temp.edge + '_' + temp.id).length > 0){
				//$('#exOutcome_' + temp.edge + '_' + temp.id + '_specValue_2_inputField').attr('value',$('#exOutcome_' + temp.edge + '_' + temp.id + '_specValue_2_inputField').val())
				var html = $('#exOutcome_' + temp.edge + '_' + temp.id).html()
				temp.html = html
			}

		}


		//only the edge overlay will be handling new conds/outcomes
		if(mode === "EDGE_OVERLAY"){
			//save all new conditions
			for(var i = 0; i<edgeOverlay_newConditionCount; i++){

				//convert ui condition row into json obj
				if($('#' + 'newCondition_' + i).length > 0){
					var html = $('#' + 'newCondition_' + i).html()

					var newCond = conditions_createCondition(currEdge,null);
					$('#' + 'newCondition_' + i + '_settings').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_settings')
					$('#' + 'newCondition_' + i).attr('id','exCondition_' + newCond.edge + '_' + newCond.id)
					$('#' + 'newCondition_' + i + '_attButton_s1_1').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s1_1')
					//$('#' + 'newCondition_' + i + '_attButton_s1_1_title').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s1_1_title')
					//$('#' + 'newCondition_' + i + '_attButton_s1_1_attribute').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s1_1_attribute')

					$('#' + 'newCondition_' + i + '_compMenu_s1').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_compMenu_s1')

					if($('#' + 'newCondition_' + i + '_attButton_s1_2').length > 0){
						$('#' + 'newCondition_' + i + '_attButton_s1_2').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s1_2')
						//$('#' + 'newCondition_' + i + '_attButton_s1_2_title').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s1_2_title')
						//$('#' + 'newCondition_' + i + '_attButton_s1_2_attribute').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s1_2_attribute')
					}
					else if($('#' + 'newCondition_' + i + '_specValue_s1_2').length > 0){
						$('#' + 'newCondition_' + i + '_specValue_s1_2').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s1_2')
						$('#' + 'newCondition_' + i + '_specValue_s1_2_inputField').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s1_2_inputField')
						//$('#' + 'exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s1_2_inputField').attr('value',$('#' + 'exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s1_2_inputField').val())
					}
					else if($('#' + 'newCondition_' + i + '_randValue_s1_2').length > 0){
						$('#' + 'newCondition_' + i + '_randValue_s1_2').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_randValue_s1_2')
					}

					$('#' + 'newCondition_' + i + '_pivot').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_pivot')

					if($('#' + 'newCondition_' + i + '_attButton_s2_1').length > 0){
						$('#' + 'newCondition_' + i + '_attButton_s2_1').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s2_1')
						//$('#' + 'newCondition_' + i + '_attButton_s2_1_title').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s2_1_title')
					//	$('#' + 'newCondition_' + i + '_attButton_s2_1_attribute').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s2_1_attribute')
					}
					else if($('#' + 'newCondition_' + i + '_specValue_s2_1').length > 0){
						$('#' + 'newCondition_' + i + '_specValue_s2_1').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_1')
						$('#' + 'newCondition_' + i + '_specValue_s2_1_inputField').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_1_inputField')
						//$('#' + 'exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_1_inputField').attr('value',$('#' + 'exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_1_inputField').val())
					}
					else if($('#' + 'newCondition_' + i + '_randValue_s2_1').length > 0){
						$('#' + 'newCondition_' + i + '_randValue_s2_1').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_randValue_s2_1')
					}

					$('#' + 'newCondition_' + i + '_compMenu_s2').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_compMenu_s2')

					if($('#' + 'newCondition_' + i + '_attButton_s2_2').length > 0){
						$('#' + 'newCondition_' + i + '_attButton_s2_2').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s2_2')
						//$('#' + 'newCondition_' + i + '_attButton_s2_2_title').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s2_2_title')
						//$('#' + 'newCondition_' + i + '_attButton_s2_2_attribute').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_attButton_s2_2_attribute')
					}
					else if($('#' + 'newCondition_' + i + '_specValue_s2_2').length > 0){
						$('#' + 'newCondition_' + i + '_specValue_s2_2').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_2')
						$('#' + 'newCondition_' + i + '_specValue_s2_2_inputField').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_2_inputField')
						//$('#' + 'exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_2_inputField').attr('value',$('#' + 'exCondition_' + newCond.edge + '_' + newCond.id + '_specValue_s2_2_inputField').val())
					}
					else if($('#' + 'newCondition_' + i + '_randValue_s2_2').length > 0){
						$('#' + 'newCondition_' + i + '_randValue_s2_2').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_randValue_s2_2')
					}

					if($('#newCondition_' + i + '_invButton').length > 0){
						$('#newCondition_' + i + '_invButton').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_invButton')
						$('#newCondition_' + i + '_existsButton').attr('id','exCondition_' + newCond.edge + '_' + newCond.id + '_existsButton')
					}

					newCond.html = $('#' + 'exCondition_' + newCond.edge + '_' + newCond.id).html()


					if(newCond !== undefined){
						currEdge.data.conditions.push(newCond);
					}
				}


			}

			//save all new outcomes
			for(var i = 0; i<edgeOverlay_newOutcomeCount; i++){
				if($('#' + 'newOutcome_' + i).length > 0){
					//convert ui condition row into json obj

					var newOut = conditions_createOutcome(currEdge,null);
					$('#' + 'newOutcome_' + i + '_settings').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_settings')
					$('#' + 'newOutcome_' + i).attr('id','exOutcome_' + newOut.edge + '_' + newOut.id)
					$('#' + 'newOutcome_' + i + '_attButton_1').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_attButton_1')
					$('#' + 'newOutcome_' + i + '_compMenu').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_compMenu')
					$('#' + 'newOutcome_' + i + '_attButton_2').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_attButton_2')
					$('#' + 'newOutcome_' + i + '_specValue_2').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_specValue_2')
					$('#' + 'newOutcome_' + i + '_specValue_2_inputField').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_specValue_2_inputField')
					//$('#' + 'exOutcome_' + newOut.edge + '_' + newOut.id + '_specValue_2_inputField').attr('value',$('#' + 'exOutcome_' + newOut.edge + '_' + newOut.id + '_specValue_2_inputField').val())
					$('#' + 'newOutcome_' + i + '_randValue_2').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_randValue_2')
					$('#' + 'newOutcome_' + i + '_text_1').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_text_1')

					//inventory outcome
					$('#' + 'newOutcome_' + i + '_invButton').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_invButton')
					$('#' + 'newOutcome_' + i + '_inputField').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_inputField')
					$('#' + 'exOutcome_' + newOut.edge + '_' + newOut.id + '_inputField').siblings().attr('for','exOutcome_' + newOut.edge + '_' + newOut.id + '_inputField')
					$('#' + 'newOutcome_' + i + '_addRemove').attr('id','exOutcome_' + newOut.edge + '_' + newOut.id + '_addRemove')


					newOut.html = $('#' + 'exOutcome_' + newOut.edge + '_' + newOut.id).html()

					if(newOut !== undefined){
						currEdge.data.outcomes.push(newOut);
					}
				}
			}

		}

		edgeOverlay_newConditionCount = 0;
		edgeOverlay_newOutcomeCount = 0;


}


function edgeOverlay_addNewCondition(listID){

		//html of condition row
		var id = 'newCondition_' + edgeOverlay_newConditionCount
		var conditionHtml = generateCondition_type1(id)
		//add html to conditionList html element
		$('#' + listID).append(conditionHtml);
		initAttributeButton(id + '_attButton_s1_1')
		initAttributeButton(id + '_attButton_s1_2')
		edgeOverlay_newConditionCount++;

		//Open Collapsibles
		if(!$('#conditions-li-header').hasClass('active'))
				$('#conditions-li-header').click();
}

function edgeOverlay_addNewOutcome(listID){
	//html of condition row
	var id = 'newOutcome_' + edgeOverlay_newOutcomeCount
	var outcomeHtml = generateOutcome(id)
	//add html to conditionList html element
	$('#' + listID).append(outcomeHtml);
	initAttributeButton(id + '_attButton_1')
	initAttributeButton(id + '_attButton_2')
	edgeOverlay_newOutcomeCount++;

	//Open Collapsibles
	if(!$('#outcomes-li-header').hasClass('active'))
		$('#outcomes-li-header').click();
}

function edgeOverlay_addExistingCondition(listID, cond){
	//html of condition row
	var id = 'exCondition_' + cond.edge + '_' + cond.id
	var conditionHtml = '<li id='+id+'>'+cond.html+'</li>'
	//add html to conditionList html element
	$('#' + listID).append(conditionHtml);

	doesAttributeExist(id + '_attButton_s1_1')
	doesAttributeExist(id + '_attButton_s1_2')
	doesAttributeExist(id + '_attButton_s2_1')
	doesAttributeExist(id + '_attButton_s2_2')
	doesInventoryItemExist(id + '_invButton')

	$('#' + id + '_specValue_s1_2_inputField').val($('#' + id + '_specValue_s1_2_inputField').attr('value'))
	$('#' + id + '_specValue_s2_1_inputField').val($('#' + id + '_specValue_s2_1_inputField').attr('value'))
	$('#' + id + '_specValue_s2_2_inputField').val($('#' + id + '_specValue_s2_2_inputField').attr('value'))
	//init tooltipp
	$('#'+id + '_attButton_s1_1').tooltip({delay: 50});
	$('#'+id + '_attButton_s1_2').tooltip({delay: 50});
	$('#'+id + '_attButton_s2_1').tooltip({delay: 50});
	$('#'+id + '_attButton_s2_2').tooltip({delay: 50});
	$('#'+id + '_randValue_s1_2').tooltip({delay: 50});
	$('#'+id + '_randValue_s2_1').tooltip({delay: 50});
	$('#'+id + '_randValue_s2_2').tooltip({delay: 50});
	$('#'+id + '_invButton').tooltip({delay: 50});
	$('#'+id + '_randButton').tooltip({delay: 50});


	//do fancy animation
	$('#' + id).hide(0,function(){
		$('#' + id).show(300);
	});
}



function edgeOverlay_addExistingOutcome(listID, out){
	//html of condition row
	var id = 'exOutcome_' + out.edge + '_' + out.id
	var outcomeHtml = '<li id='+id+' >'+out.html+'</li>'

	//add html to conditionList html element
	$('#' + listID).append(outcomeHtml);

	//some function that validates if an attribute exists
	doesAttributeExist(id + '_attButton_1')
	doesAttributeExist(id + '_attButton_2')
	doesInventoryItemExist(id + '_invButton')


	$('#'+id + '_attButton_1').tooltip({delay: 50});
	$('#'+id + '_attButton_2').tooltip({delay: 50});
	$('#'+id + '_randValue_2').tooltip({delay: 50});
	$('#'+id + '_text_1').tooltip({delay: 50});
	$('#'+id + '_text_2').tooltip({delay: 50});
	$('#'+id + '_invButton').tooltip({delay: 50});

	//do fancy animation
	$('#' + id).hide(0,function(){
		$('#' + id).show(300);
	});

}

function doesAttributeExist(id){
	if($('#' + id).length === 0){
		//dont need to check attButtons that are not in ui
		return false
	}

	if($('#' + id).attr('path') !== undefined){
		var att = gameAttributes_find($('#' + id).attr('path'))
		if(att === undefined){
			console.log('ATT DOES NOT EXIST YO')
			//re init button
			initAttributeButton(id)
			return false
		}
		return true
	}
	else{
		console.log('PATH IS UNDEFINED YO')
		//re init button
		initAttributeButton(id)
	}
	return false
}

function doesInventoryItemExist(id){
	if($('#' + id).length === 0){
		//dont need to check attButtons that are not in ui
		return false
	}

	if($('#'+id).attr('itemid') !== undefined){ //idiot check
			var item = gameInventory_getItem($('#'+id).attr('itemid'))
			if(item === undefined){
				console.log('ITEM UNDEFINED YO')
				$('#'+id).attr('itemid','')
				$('#'+id).children().text('....')
				return false
			}
			return true
	}

}



function removeCondition(id){
	console.log("Removing condition " + id);
	var arr = id.split('_')
	//remove html of element
	$('#' + id).hide(300, function(){
		$('#' + id).remove();
	});

	//console.log(id)


	if(arr[0] === 'newCondition'){
		//new conditon being deleted
	}
	else if(arr[0] === 'exCondition'){
		//existing condtion being deleted
		//delete from model
		var edge = cy.edges("[id='" + arr[1] +"']").json();
		for(var i = 0; i < edge.data.conditions.length; i++){
			if(edge.data.conditions[i].id === parseInt(arr[2])){
				console.log( 'removing condition: ' + edge.data.conditions[i].id + ' ' + arr[2])
				edge.data.conditions.splice(i,1)
			}
		}
	}
	else{
		console.log("removeCondition(): error in id formatting")
	}

}

function removeOutcome(id){
	console.log("Removing outcome " + id);
	//remove html of element

	$('#' + id).hide(300, function(){
		$('#' + id).remove();
	});


	//console.log(id)
	var arr = id.split('_')

	if(arr[0] === 'newOutcome'){
		//new conditon being deleted
	}
	else if(arr[0] === 'exOutcome'){
		//existing condtion being deleted
		//delete from model
		var edge = cy.edges("[id='" + arr[1] +"']").json();
		for(var i = 0; i < edge.data.outcomes.length; i++){
			if(edge.data.outcomes[i].id === parseInt(arr[2])){
				console.log( 'removing outcome: ' + edge.data.outcomes[i].id + ' ' + arr[2])
				edge.data.outcomes.splice(i,1)
				$('#' + id).hide(300, function(){
					$('#' + id).remove();
				});
			}
		}
	}
	else{
		console.log("removeOutcome(): error in id formatting")
	}
}
